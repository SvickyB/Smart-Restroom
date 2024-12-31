const alertService = require('../services/alertService');
const sensorService = require('../services/sensorService');

const getActiveAlerts = async (req, res) => {
  try {
    const alerts = await alertService.getActiveAlerts();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resolveAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await alertService.resolveAlert(id);
    
    if (result.success) {
      sensorService.resetSensorValue(result.sensorType);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Alert not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getActiveAlerts,
  resolveAlert
};