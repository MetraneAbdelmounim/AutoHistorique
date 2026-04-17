const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN
});

exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;
    const existant = await User.findOne({ email });
    if (existant) {
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé.' });
    }
    const user = await User.create({ nom, prenom, email, password });
    const token = signToken(user._id);
    res.status(201).json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis.' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.verifierPassword(password))) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
    }
    if (!user.actif) {
      return res.status(401).json({ success: false, message: 'Compte désactivé.' });
    }
    user.dernierAcces = new Date();
    await user.save({ validateBeforeSave: false });
    const token = signToken(user._id);
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.me = async (req, res) => {
  res.json({ success: true, user: req.user });
};
