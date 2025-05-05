import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { userData, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  return (
    <nav className="bg-blue-500 p-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-white font-bold">Home</Link>

        {!userData?.token ? (
          <div className="space-x-4">
            <Link to="/login" className="text-white">Login</Link>
            <Link to="/register" className="text-white">Register</Link>
          </div>
        ) : (
          <div className="space-x-4 flex items-center">
            {userData.role === 'admin' ? (
              <Link to="/admin-dashboard" className="text-white">Admin Dashboard</Link>
            ) : (
              <Link to="/dashboard" className="text-white">User Dashboard</Link>
            )}

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
