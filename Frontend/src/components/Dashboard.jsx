import React, { useState, useEffect } from 'react';
import SensorCard from './SensorCard';
import AlertList from './AlertList';

const Dashboard = () => {
  const [sensorData, setSensorData] = useState({
    soap: { value: 100, threshold: 20 },
    paper_towel_1: { value: 100, threshold: 20 },
    paper_towel_2: { value: 100, threshold: 20 },
    paper_towel_3: { value: 100, threshold: 20 },
    dustbin: { value: 0, threshold: 80 },
    people_count: { value: 0, threshold: 50 }
  });

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/ws');
    
    ws.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'sensorUpdate') {
        setSensorData(prev => {
          const newData = { ...prev };
          Object.entries(data.data).forEach(([sensor, value]) => {
            newData[sensor] = {
              ...prev[sensor],
              value
            };
          });
          return newData;
        });
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {Object.entries(sensorData).map(([key, data]) => (
          <SensorCard
            key={key}
            title={key.split('_').map(word =>
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
            value={data.value}
            threshold={data.threshold}
            type={key === 'dustbin' ? 'filling' : 'depleting'}
          />
        ))}
      </div>
      <AlertList />
    </div>
  );
};

export default Dashboard;
