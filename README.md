# Smart Restroom Monitoring System

A real-time monitoring solution for managing restroom facilities with sensor tracking and automated alerts.

## Dashboard Preview

### Sensor Monitoring Interface
![WhatsApp Image 2024-12-31 at 6 32 05 AM](https://github.com/user-attachments/assets/02363743-3a66-4047-9ff9-df851f52cfcf)


The dashboard provides real-time monitoring of:
- Soap Dispenser Levels
- Paper Towel Dispensers (3 Units)
- Dustbin Capacity
- People Counter

### Active Alerts Panel
![WhatsApp Image 2024-12-31 at 6 39 28 AM](https://github.com/user-attachments/assets/93fffca3-0d4f-4826-bb3d-b743d846bd0a)

### Sensor Monitoring Interface
![WhatsApp Image 2024-12-31 at 6 39 44 AM](https://github.com/user-attachments/assets/30bf7c30-bd2e-43a4-95ee-00340daadc7f)


## Features

### Real-time Monitoring
- Live sensor data updates via WebSocket
- Visual progress indicators with status colors
- Threshold-based monitoring
- Automatic alert generation

### Alert Management
- Real-time alert notifications
- One-click alert resolution
- Historical alert tracking
- Auto-cleanup of resolved alerts

### Sensor Types and Thresholds
| Sensor Type | Default Threshold | Alert Condition |
|-------------|------------------|-----------------|
| Soap Dispenser | 20% | Below threshold |
| Paper Towel 1 | 20% | Below threshold |
| Paper Towel 2 | 20% | Below threshold |
| Paper Towel 3 | 20% | Below threshold |
| Dustbin | 80% | Above threshold |

## Technology Stack

### Frontend
- React.js
- Tailwind CSS
- WebSocket Client
- Shadcn UI Components

### Backend
- Node.js
- Express.js
- PostgreSQL
- MQTT
- WebSocket Server

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/smart-restroom-monitoring.git
cd smart-restroom-monitoring
```

2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configure environment variables
```bash
# Backend (.env)
MQTT_HOST=localhost
MQTT_PORT=1883
MQTT_PROTOCOL=mqtt
MQTT_RECONNECT_PERIOD=5000
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=smart_restroom
DB_PASSWORD=your_password
DB_PORT=5432
SERVER_PORT=3000

# Frontend (.env)
REACT_APP_API_URL=http://localhost:3000
REACT_APP_WS_URL=ws://localhost:3000
```

4. Initialize the database
```bash
psql -U postgres -d smart_restroom -f init.sql
```

5. Start the services
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm start
```

## Component Structure

### Frontend Components
```
src/
├── components/
│   ├── Dashboard/
│   │   ├── index.jsx
│   │   ├── SensorCard.jsx
│   │   └── AlertList.jsx
│   ├── ui/
│   │   ├── Card.jsx
│   │   └── Progress.jsx
│   └── Header.jsx
├── App.jsx
└── index.jsx
```

### Backend Structure
```
backend/
├── config/
│   └── thresholds.js
├── controllers/
│   └── alertController.js
├── models/
│   └── Alert.js
├── services/
│   ├── alertService.js
│   └── sensorService.js
├── routes/
│   └── alertRoutes.js
└── server.js
```

## API Endpoints

### Alerts
- `GET /api/alerts` - Get all active alerts
- `PUT /api/alerts/:id/resolve` - Resolve a specific alert

### WebSocket Events
- `sensorUpdate` - Real-time sensor data updates
- `alert` - Real-time alert notifications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Shadcn UI for React components
- Tailwind CSS for styling
- MQTT.js for sensor communication
- WebSocket for real-time updates
