const Vehicle = require('../models/vehicle.model');
const Accident = require('../models/accident.model');
const { parseImmatriculation, calculerScoreConfiance } = require('../config/immatriculation.helper');

exports.rechercher = async (req, res) => {
  const parsed = parseImmatriculation(req.params.immatriculation);
  if (!parsed.valid) {
    return res.status(400).json({ success: false, message: parsed.error });
  }

  try {
    const [vehicle, accidents] = await Promise.all([
      Vehicle.findOne({ immatriculation: parsed.normalized }),
      Accident.find({ immatriculation: parsed.normalized }).sort({ dateAccident: -1 })
    ]);

    const scoreConfiance = calculerScoreConfiance(accidents);

    res.json({
      success: true,
      immatriculation: parsed.display,
      type: parsed.type,
      vehicule: vehicle,
      nombreAccidents: accidents.length,
      scoreConfiance,
      accidents
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.creer = async (req, res) => {
  const parsed = parseImmatriculation(req.body.immatriculation || '');
  if (!parsed.valid) {
    return res.status(400).json({ success: false, message: parsed.error });
  }
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { immatriculation: parsed.normalized },
      { ...req.body, immatriculation: parsed.normalized },
      { upsert: true, new: true, runValidators: true }
    );
    res.status(201).json({ success: true, vehicle });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.statistiques = async (req, res) => {
  try {
    const [totalVehicules, totalAccidents, parGravite] = await Promise.all([
      Vehicle.countDocuments(),
      Accident.countDocuments(),
      Accident.aggregate([
        { $group: { _id: '$gravite', count: { $sum: 1 } } }
      ])
    ]);
    res.json({ success: true, totalVehicules, totalAccidents, parGravite });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
