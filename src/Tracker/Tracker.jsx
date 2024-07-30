import React, { useEffect, useState } from 'react';
import axios from 'axios';
import haversine from 'haversine-distance';
import DistanceTable from '../DistanceTable/DistanceTable';
import { useNavigate } from 'react-router-dom';

const Tracker = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [previousLocation, setPreviousLocation] = useState(null);
  const [distance, setDistance] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const navigate = useNavigate();

  const userId = '123456'; // Replace with actual user ID from login

  useEffect(() => {
    const handleSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      const newLocation = { latitude, longitude };

      if (previousLocation) {
        const newDistance = haversine(previousLocation, newLocation);
        setDistance((prevDistance) => prevDistance + newDistance / 1000); // Convert to kilometers
      }

      setLocation(newLocation);
      setPreviousLocation(newLocation);
    };

    const handleError = (error) => {
      console.error('Error getting location', error);
    };

    if (navigator.geolocation) {
      const watcher = navigator.geolocation.watchPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });

      return () => {
        navigator.geolocation.clearWatch(watcher);
      };
    }
  }, [previousLocation]);

  useEffect(() => {
    // Send distance to the server every minute
    const sendDistanceToServer = async () => {
      try {
        await axios.post('http://localhost:5000/track', {
          userId,
          distance,
        });
      } catch (error) {
        console.error('Error sending distance to server', error);
      }
    };

    const intervalId = setInterval(sendDistanceToServer, 60000); // Send every minute
    setIntervalId(intervalId);

    return () => {
      clearInterval(intervalId);
    };
  }, [distance, userId]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout', { userId });
      navigate('/');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  return (
    <div>
      <h2>Location Tracker</h2>
      {location.latitude && location.longitude ? (
        <>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </>
      ) : (
        <p>Loading location...</p>
      )}
      <p>Distance traveled: {distance.toFixed(2)} km</p>
      <button onClick={handleLogout} className='logout'>Logout</button>
      <DistanceTable userId={userId} />
    </div>
  );
};

export default Tracker;
