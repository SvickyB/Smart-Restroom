// import React, { useState, useEffect } from "react";
// import { Card } from "@/components/ui/card";

// const AlertList = () => {
//   const [alerts, setAlerts] = useState([]);
//   const [ws, setWs] = useState(null);

//   useEffect(() => {
//     // Create WebSocket connection
//     const websocket = new WebSocket('ws://localhost:3000/ws');
//     setWs(websocket);

//     websocket.onopen = () => {
//       console.log('WebSocket Connected');
//     };

//     websocket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.type === 'alert') {
//         fetchAlerts();
//       }
//     };

//     websocket.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };

//     // Initial fetch
//     fetchAlerts();
    
//     // Set up polling interval
//     const interval = setInterval(fetchAlerts, 5000);

//     // Cleanup on unmount
//     return () => {
//       clearInterval(interval);
//       if (websocket) {
//         websocket.close();
//       }
//     };
//   }, []);

//   const fetchAlerts = async () => {
//     try {
//       const response = await fetch('http://localhost:3000/api/alerts');
//       const data = await response.json();
//       setAlerts(data);
//     } catch (error) {
//       console.error('Error fetching alerts:', error);
//     }
//   };

//   const handleResolve = async (id) => {
//     try {
//       await fetch(`http://localhost:3000/api/alerts/${id}/resolve`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
//       fetchAlerts();
//     } catch (error) {
//       console.error('Error resolving alert:', error);
//     }
//   };

//   return (
//     <Card className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Active Alerts</h2>
//       <div className="space-y-4">
//         {alerts.map((alert) => (
//           <div key={alert.id} className="border p-4 rounded-lg">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h3 className="text-lg font-semibold">{alert.sensor_type}</h3>
//                 <p>Current Value: {alert.current_value} (Threshold: {alert.threshold_value})</p>
//                 <p className="text-sm text-gray-500">
//                   {new Date(alert.created_at).toLocaleString()}
//                 </p>
//               </div>
//               {alert.status === 'pending' && (
//                 <button
//                   onClick={() => handleResolve(alert.id)}
//                   className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
//                 >
//                   Resolve
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//         {alerts.length === 0 && (
//           <p className="text-center text-gray-500">No active alerts</p>
//         )}
//       </div>
//     </Card>
//   );
// };

// export default AlertList;

// src/components/AlertList.jsx
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

const AlertList = () => {
  const [alerts, setAlerts] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Create WebSocket connection
    const websocket = new WebSocket('ws://localhost:3000/ws');
    setWs(websocket);

    websocket.onopen = () => {
      console.log('WebSocket Connected');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'alert') {
        fetchAlerts();
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Initial fetch
    fetchAlerts();
    
    // Set up polling interval
    const interval = setInterval(fetchAlerts, 5000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/alerts');
      const data = await response.json();
      // Filter out people_count alerts
      const filteredAlerts = data.filter(alert => alert.sensor_type !== 'people_count');
      setAlerts(filteredAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const handleResolve = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/alerts/${id}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      fetchAlerts();
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Active Alerts</h2>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">
                  {alert.sensor_type.split('_').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </h3>
                <p>Current Value: {alert.current_value}% (Threshold: {alert.threshold_value}%)</p>
                <p className="text-sm text-gray-500">
                  {new Date(alert.created_at).toLocaleString()}
                </p>
              </div>
              {alert.status === 'pending' && (
                <button
                  onClick={() => handleResolve(alert.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Resolve
                </button>
              )}
            </div>
          </div>
        ))}
        {alerts.length === 0 && (
          <p className="text-center text-gray-500">No active alerts</p>
        )}
      </div>
    </Card>
  );
};

export default AlertList;