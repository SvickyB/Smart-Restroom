const WebSocket = require('ws');
const alertService = require('./alertService');

class SensorService {
  constructor() {
    this.sensorData = {
      soap: 100,
      paper_towel_1: 100,
      paper_towel_2: 100,
      paper_towel_3: 100,
      dustbin: 0,
      people_count: 0
    };
    this.wss = null;
    this.mqttClient = null;
  }

  setWebSocketServer(wss) {
    this.wss = wss;
  }

  setMqttClient(mqttClient) {
    this.mqttClient = mqttClient;
  }

  resetSensorValue(sensorType) {
    if (sensorType === 'dustbin') {
      this.sensorData[sensorType] = 0;
    } else if (sensorType !== 'people_count') {
      this.sensorData[sensorType] = 100;
    }
    this.broadcastSensorData();
  }

  async updateSensorData() {
    // Update sensor values
    this.sensorData = {
      soap: Math.max(0, this.sensorData.soap - 10),
      paper_towel_1: Math.max(0, this.sensorData.paper_towel_1 - 10),
      paper_towel_2: Math.max(0, this.sensorData.paper_towel_2 - 10),
      paper_towel_3: Math.max(0, this.sensorData.paper_towel_3 - 10),
      dustbin: Math.min(100, this.sensorData.dustbin + 10),
      people_count: Math.floor(Math.random() * 101)
    };

    // Check each sensor and create alerts if needed
    for (const [sensor, value] of Object.entries(this.sensorData)) {
      if (sensor !== 'people_count') {
        await alertService.createAlert(sensor, value);
      }
    }

    // Publish to MQTT if client exists
    if (this.mqttClient) {
      Object.entries(this.sensorData).forEach(([sensor, value]) => {
        this.mqttClient.publish(`sensors/${sensor}`, value.toString());
      });
    }

    this.broadcastSensorData();
    return this.sensorData;
  }

  broadcastSensorData() {
    if (!this.wss) return;

    const message = JSON.stringify({
      type: 'sensorUpdate',
      data: this.sensorData
    });

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  getCurrentSensorData() {
    return this.sensorData;
  }
}

module.exports = new SensorService();