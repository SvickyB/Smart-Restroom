const { pool, cleanupAlerts } = require('../models/Alert');
const thresholds = require('../config/thresholds');

class AlertService {
  async createAlert(sensorType, value) {
    // Only create alerts for specific sensors
    const alertSensors = ['soap', 'paper_towel_1', 'paper_towel_2', 'paper_towel_3', 'dustbin'];
    
    if (!alertSensors.includes(sensorType)) {
      return; // Skip alert creation for other sensors
    }

    try {
      // Check if there's already a pending alert for this sensor
      const existingAlert = await pool.query(
        'SELECT id FROM alerts WHERE sensor_type = $1 AND status = $2',
        [sensorType, 'pending']
      );

      if (existingAlert.rows.length > 0) {
        return; // Skip if there's already a pending alert
      }

      // Check if the sensor value violates the threshold
      const threshold = thresholds[sensorType];
      const shouldCreateAlert = sensorType === 'dustbin' 
        ? value > threshold  // Dustbin alert when above threshold
        : value < threshold; // Other sensors alert when below threshold

      if (shouldCreateAlert) {
        console.log(`Creating alert for ${sensorType}, Value: ${value}, Threshold: ${threshold}`);
        await pool.query(
          'INSERT INTO alerts (sensor_type, threshold_value, current_value) VALUES ($1, $2, $3)',
          [sensorType, threshold, value]
        );
        await cleanupAlerts(); // Clean up resolved alerts older than 7 days
      }
    } catch (error) {
      console.error('Error creating alert:', error.message);
    }
  }

  async getActiveAlerts() {
    try {
      const result = await pool.query(
        'SELECT * FROM alerts WHERE status = $1 ORDER BY created_at DESC',
        ['pending']
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting active alerts:', error.message);
      throw error;
    }
  }

  async resolveAlert(id) {
    try {
      const alertResult = await pool.query(
        'SELECT sensor_type FROM alerts WHERE id = $1',
        [id]
      );
      
      if (alertResult.rows.length > 0) {
        const sensorType = alertResult.rows[0].sensor_type;
        
        await pool.query(
          'UPDATE alerts SET status = $1, resolved_at = CURRENT_TIMESTAMP WHERE id = $2',
          ['resolved', id]
        );
        
        return { success: true, sensorType };
      }
      return { success: false, error: 'Alert not found' };
    } catch (error) {
      console.error('Error resolving alert:', error.message);
      throw error;
    }
  }
}

module.exports = new AlertService();