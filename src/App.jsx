// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login/Login';
import Tracker from './Tracker/Tracker';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
