const express = require('express');
const router = express.Router();
const accidentController = require('../controllers/accident.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', accidentController.lister);
router.post('/', adminOnly, accidentController.creer);

module.exports = router;
