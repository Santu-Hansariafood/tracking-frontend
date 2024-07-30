// src/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [status, setStatus] = useState('Idle');

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ latitude, longitude });
        axios.post('https://your-backend-api/location', { latitude, longitude }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      },
      (err) => console.error('Geolocation error', err),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (position.latitude && position.longitude) {
      setStatus('Active');
    }
  }, [position]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Latitude: {position.latitude}</p>
      <p>Longitude: {position.longitude}</p>
      <p>Status: {status}</p>
    </div>
  );
};

export default Dashboard;
