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

const app = express();

// Security
app.use(helmet());

const isDev = process.env.NODE_ENV === 'development';

// Dev: allow localhost + LAN (so phones/tablets on Wi-Fi can hit the API)
// Dev: allow Capacitor native origins (iOS / Android app shells)
// Prod: FRONTEND_URL + Capacitor native origins (for the packaged mobile app)
const devOriginPatterns = [
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
  /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/,
  /^http:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/,
  /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+(:\d+)?$/,
  /^capacitor:\/\/localhost$/,
  /^ionic:\/\/localhost$/,
  /^http:\/\/localhost$/
];

// Capacitor WebView origins (always allowed — our own installed app)
const nativeAppOrigins = [
  'capacitor://localhost',
  'https://localhost',
  'ionic://localhost'
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // same-origin, curl, Capacitor native
    if (nativeAppOrigins.includes(origin)) return cb(null, true);
    if (isDev) {
      if (devOriginPatterns.some(rx => rx.test(origin))) return cb(null, true);
    }
    if (origin === process.env.FRONTEND_URL) return cb(null, true);
    return cb(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Trop de requêtes, réessayez dans 15 minutes.' }
});
app.use('/api', limiter);

// Middleware
app.use(express.json());
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

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`✅ MongoDB connecté [${process.env.NODE_ENV}]`);
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${process.env.PORT} [${process.env.NODE_ENV}]`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur MongoDB:', err.message);
    process.exit(1);
  });

module.exports = app;
