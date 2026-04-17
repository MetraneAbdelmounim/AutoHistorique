const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  immatriculation: {
    type: String, required: true, unique: true,
    uppercase: true, trim: true, index: true
  },
  marque: { type: String, trim: true },
  modele: { type: String, trim: true },
  annee: { type: Number, min: 1950, max: new Date().getFullYear() + 1 },
  couleur: { type: String },
  typeCarburant: { type: String, enum: ['essence', 'diesel', 'hybride', 'electrique', 'gpl'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

vehicleSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
