import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import Modal from '../components/modals/Modal';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserData,userData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
const[ role_, setRole]=useState('user');
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, { email, password });
      const { token, role, credits, username,lastLoginDate } = res.data;

      setUserData({ token, role, credits });
      setRole(role);

      const lastLogin = new Date(lastLoginDate).toDateString();
      const today = new Date().toDateString();

  
      if (lastLogin !== today) {
        // Show modal if it's a new day
        setShowModal(true)
  
        // Navigate after 3 seconds
        setTimeout(() => {
          setShowModal(false);
          if (role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/dashboard');
          }
        }, 3000);
      } else {
        // No modal, navigate immediately
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      }

     
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-2xl mb-4">Login</h2>
        <input 
          type="email" 
          placeholder="Email" 
          className="p-2 border mb-4 w-full" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="p-2 border mb-4 w-full" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
        />
        <button type="submit" className="bg-blue-500 text-white w-full p-2">Login</button>
      </form>
      {showModal && <Modal credits={10} onClose={() => setShowModal(false)}
      message="Thanks for logging in Daily You've earned 10 credits for login ."
       />}

    </div>
  );
};

export default Login;
