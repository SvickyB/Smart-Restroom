const express = require('express');
const router = express.Router();
const { getActiveAlerts, resolveAlert } = require('../controllers/alertController');

router.get('/', getActiveAlerts);
router.put('/:id/resolve', resolveAlert);

module.exports = router;
