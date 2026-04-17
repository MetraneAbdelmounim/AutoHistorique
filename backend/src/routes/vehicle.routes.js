const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/stats', vehicleController.statistiques);
router.get('/:immatriculation', vehicleController.rechercher);
router.post('/', adminOnly, vehicleController.creer);

module.exports = router;
