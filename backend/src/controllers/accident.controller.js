const Accident = require('../models/accident.model');
const { parseImmatriculation } = require('../config/immatriculation.helper');

exports.creer = async (req, res) => {
  const parsed = parseImmatriculation(req.body.immatriculation || '');
  if (!parsed.valid) {
    return res.status(400).json({ success: false, message: parsed.error });
  }
  try {
    const accident = await Accident.create({
      ...req.body,
      immatriculation: parsed.normalized
    });
    res.status(201).json({ success: true, accident });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.lister = async (req, res) => {
  try {
    const { immatriculation } = req.query;
    const filtre = {};
    if (immatriculation) {
      const parsed = parseImmatriculation(immatriculation);
      if (parsed.valid) filtre.immatriculation = parsed.normalized;
    }
    const accidents = await Accident.find(filtre).sort({ dateAccident: -1 }).limit(50);
    res.json({ success: true, accidents });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
