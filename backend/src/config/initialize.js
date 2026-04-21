// Idempotent DB initializer — runs on server startup.
// Seeds demo data only if the DB is empty (no destructive ops).
// Can be disabled by setting SKIP_AUTO_SEED=1 in the environment.
const User = require('../models/user.model');
const { runSeed } = require('./seed-data');

async function initialize() {
  if (process.env.SKIP_AUTO_SEED === '1') {
    console.log('ℹ️  SKIP_AUTO_SEED=1 — auto-seed disabled');
    return;
  }

  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log(`ℹ️  DB already has ${userCount} user(s) — skipping auto-seed`);
    return;
  }

  console.log('🌱 Empty DB detected — seeding demo data...');
  await runSeed({ reset: false });
  console.log('✅ Auto-seed terminé');
}

module.exports = { initialize };