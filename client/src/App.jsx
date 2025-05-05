import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Feed from './pages/Feed';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';


function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
              <Dashboard />
          }
        />

        <Route
          path="/admin-dashboard"
          element={
              <AdminDashboard />
          }
        />      
        </Routes>
    </div>
  );
}

export default App;
