// src/components/DistanceTable.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DistanceTable.css';

const DistanceTable = ({ userId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/track/${userId}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div>
      <h2>Distance Traveled</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Login Time</th>
            <th>Logout Time</th>
            <th>Distance (km)</th>
            <th>IP Address</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{new Date(entry.loginTime).toLocaleString()}</td>
              <td>{entry.logoutTime ? new Date(entry.logoutTime).toLocaleString() : 'N/A'}</td>
              <td>{entry.distance.toFixed(2)}</td>
              <td>{entry.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DistanceTable;
