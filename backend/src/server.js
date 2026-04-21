require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const vehicleRoutes = require('./routes/vehicle.routes');
const accidentRoutes = require('./routes/accident.routes');
const { initialize } = require('./config/initialize');

const app = express();

// Trust proxy so express-rate-limit sees the real client IP (behind nginx)
app.set('trust proxy', 1);

// Security headers (helmet manages all the standard ones)
app.use(helmet());

// CORS — restricted whitelist. Reflect origin back when it matches so
// `credentials: true` keeps working (plain '*' is incompatible with credentials).
const allowedOrigins = [
  process.env.FRONTEND_URL,           // set in .env
  'capacitor://localhost',            // Capacitor Android
  'https://localhost',                // Capacitor WebView (Android scheme=https)
  'ionic://localhost',                // Ionic legacy
  'http://localhost:4200',            // Angular dev
  'http://localhost:8100',            // Ionic dev
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);                // same-origin, curl, native
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true
}));

// ─── Rate limiting ────────────────────────────────────────
// Global — broad defense
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Trop de requêtes, réessayez dans 15 minutes.' }
});
app.use('/api', globalLimiter);

// Strict — login + register brute-force protection
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,                             // 8 attempts / 15 min / IP
  skipSuccessfulRequests: true,       // count failures only
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Trop de tentatives. Réessayez dans 15 minutes.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Body parser + logs
app.use(express.json({ limit: '100kb' }));
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/accidents', accidentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, env: process.env.NODE_ENV, timestamp: new Date() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route introuvable' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Erreur serveur interne' });
});

// MongoDB connection + first-run initialization
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log(`✅ MongoDB connecté [${process.env.NODE_ENV}]`);
    try {
      await initialize();
    } catch (e) {
      console.error('⚠️  Auto-seed a échoué (non bloquant):', e.message);
    }
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${process.env.PORT} [${process.env.NODE_ENV}]`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur MongoDB:', err.message);
    process.exit(1);
  });

module.exports = app;
