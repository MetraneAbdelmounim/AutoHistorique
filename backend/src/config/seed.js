require('dotenv').config({ path: '.env.development' });
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Vehicle = require('../models/vehicle.model');
const Accident = require('../models/accident.model');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await Promise.all([User.deleteMany(), Vehicle.deleteMany(), Accident.deleteMany()]);

  await User.create([
    { nom: 'Admin', prenom: 'System', email: 'admin@autohistorique.ma', password: 'admin123', role: 'admin' },
    { nom: 'Benali', prenom: 'Youssef', email: 'user@autohistorique.ma', password: 'user123', role: 'user' }
  ]);

  const vehicles = await Vehicle.create([
    { immatriculation: '123456A78', marque: 'Dacia', modele: 'Logan', annee: 2018, couleur: 'Blanc', typeCarburant: 'diesel' },
    { immatriculation: '654321B22', marque: 'Renault', modele: 'Clio', annee: 2020, couleur: 'Rouge', typeCarburant: 'essence' },
    { immatriculation: '11111WW', marque: 'Peugeot', modele: '308', annee: 2019, couleur: 'Gris', typeCarburant: 'diesel' },
  ]);

  await Accident.create([
    {
      immatriculation: '123456A78', dateAccident: new Date('2022-03-15'),
      gravite: 'modere', typeChoc: 'arriere', compagnieAssurance: 'Wafa Assurance',
      montantDommage: 12000, reparationEffectuee: true, lieu: 'Casablanca - Bd Zerktouni',
      responsabilite: 'non_responsable', description: 'Collision à l\'arrêt au feu rouge'
    },
    {
      immatriculation: '123456A78', dateAccident: new Date('2023-07-20'),
      gravite: 'leger', typeChoc: 'lateral_gauche', compagnieAssurance: 'AXA Maroc',
      montantDommage: 3500, reparationEffectuee: true, lieu: 'Rabat - Avenue Hassan II',
      responsabilite: 'responsable', description: 'Accrochage en stationnement'
    },
    {
      immatriculation: '11111WW', dateAccident: new Date('2021-11-08'),
      gravite: 'grave', typeChoc: 'frontal', compagnieAssurance: 'RMA Assurance',
      montantDommage: 45000, reparationEffectuee: true, lieu: 'Route nationale N1',
      responsabilite: 'responsable', description: 'Collision frontale, airbags déclenchés'
    }
  ]);

  console.log('✅ Données de test insérées');
  console.log('📧 Admin: admin@autohistorique.ma / admin123');
  console.log('📧 User:  user@autohistorique.ma / user123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
