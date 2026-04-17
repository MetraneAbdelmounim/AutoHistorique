const mongoose = require('mongoose');

const accidentSchema = new mongoose.Schema({
  immatriculation: {
    type: String, required: true, uppercase: true,
    trim: true, index: true
  },
  dateAccident: { type: Date, required: true },
  gravite: {
    type: String,
    enum: ['leger', 'modere', 'grave', 'total'],
    required: true
  },
  typeChoc: {
    type: String,
    enum: ['frontal', 'arriere', 'lateral_gauche', 'lateral_droit', 'tonneau', 'multiple']
  },
  compagnieAssurance: { type: String, required: true },
  numeroSinistre: { type: String },
  montantDommage: { type: Number, min: 0 },
  reparationEffectuee: { type: Boolean, default: false },
  dateReparation: { type: Date },
  description: { type: String, maxlength: 500 },
  lieu: { type: String },
  responsabilite: {
    type: String,
    enum: ['responsable', 'non_responsable', 'partage', 'inconnu'],
    default: 'inconnu'
  },
  source: { type: String, default: 'assurance' },
  createdAt: { type: Date, default: Date.now }
});

accidentSchema.index({ immatriculation: 1, dateAccident: -1 });

module.exports = mongoose.model('Accident', accidentSchema);
