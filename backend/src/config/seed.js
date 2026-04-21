// Manual seed — destructive (wipes + repopulates).
// Usage:   docker compose exec api npm run seed
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
const mongoose = require('mongoose');
const { runSeed } = require('./seed-data');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  await runSeed({ reset: true });
  console.log('✅ Seed terminé');
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });