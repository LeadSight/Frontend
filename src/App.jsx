// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Dashboard from './pages/Dashboard';
import Promotion from './pages/Promotion';
// import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Uncomment when Login page is ready */}
        {/* <Route path="/login" element={<Login />} /> */}
        
        {/* Uncomment when Dashboard page is ready */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        
        {/* Active routes */}
        <Route path="/promotion" element={<Promotion />} />
        <Route path="/" element={<Navigate to="/promotion" replace />} />
        <Route path="*" element={<Navigate to="/promotion" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;