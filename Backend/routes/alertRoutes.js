// backend/routes/alertRoutes.js
const express = require('express');
const router = express.Router();
const { getActiveAlerts, resolveAlert } = require('../controllers/alertController');

// Route to get active alerts
router.get('/', getActiveAlerts);

// Route to resolve an alert
router.put('/:id/resolve', resolveAlert);

module.exports = router;
