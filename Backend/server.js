const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const mqtt = require('mqtt');
const alertRoutes = require('./routes/alertRoutes');
const { initializeDatabase } = require('./models/Alert');
const sensorService = require('./services/sensorService');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

app.use(cors());
app.use(express.json());
app.use('/api/alerts', alertRoutes);

sensorService.setWebSocketServer(wss);

const mqttClient = mqtt.connect('mqtt://localhost:1883', {
  clientId: 'smart_restroom_server_' + Math.random().toString(16).substr(2, 8),
  clean: true,
  reconnectPeriod: 5000
});

sensorService.setMqttClient(mqttClient);

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe('sensors/#', (err) => {
    if (err) console.error('MQTT subscription error:', err);
  });
});

mqttClient.on('error', (error) => {
  console.error('MQTT error:', error);
});

// Set up WebSocket server
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  ws.send(JSON.stringify({
    type: 'sensorUpdate',
    data: sensorService.getCurrentSensorData()
  }));

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Initialize and start server
const PORT = process.env.PORT || 3000;

initializeDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      // Update sensor data every minute
      setInterval(() => sensorService.updateSensorData(), 60000);
      // Initial update
      sensorService.updateSensorData();
    });
  })
  .catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });