const mqtt = require('mqtt');
require('dotenv').config(); 

const mqttOptions = {
  host: process.env.MQTT_HOST,
  port: process.env.MQTT_PORT,
  protocol: process.env.MQTT_PROTOCOL,
  reconnectPeriod: parseInt(process.env.MQTT_RECONNECT_PERIOD), 
};

const client = mqtt.connect(mqttOptions);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('sensors/#', (err) => {
    if (!err) {
      console.log('Subscribed to sensors/#');
    } else {
      console.error('MQTT subscription error:', err);
    }
  });
});

client.on('error', (error) => {
  console.error('MQTT error:', error);
});

client.on('close', () => {
  console.log('MQTT connection closed');
});

client.on('reconnect', () => {
  console.log('Attempting to reconnect to MQTT broker');
});

client.on('message', (topic, message) => {
  console.log(`Received message on ${topic}: ${message.toString()}`);
});

process.on('SIGINT', () => {
  client.end();
  process.exit();
});

module.exports = client;
