import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/modals/Modal';
import { AuthContext } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', username: '', role: "user" });
  const [showModal, setShowModal] = useState(false);
  const [creditsEarned, setCreditsEarned] = useState(0); // To show in modal
const { setUserData ,userData} = useContext(AuthContext);  
  const navigate = useNavigate();
const[ role_, setRole]=useState('user');


  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/register', formData);
      const { token, role, credits } = response.data;
      setUserData({ token, role, credits });
      setRole(role);
      setCreditsEarned(credits);
      setShowModal(true); // Show modal after successful registration
      setTimeout(() => {
        setShowModal(false);
        
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
        
      }, 3000);
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-lg ">
        <h2 className="text-2xl mb-4">Register</h2>
        <select
          className="p-2 border mb-4 w-full"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="text"
          placeholder="Username"
          className="p-2 border mb-4 w-full"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="p-2 border mb-4 w-full"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border mb-4 w-full"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded">
          Register
        </button>
      </form>

      {/* Credit Modal */}
      {showModal && role_!=='admin' &&
      <Modal credits={creditsEarned}
       onClose={() => setShowModal(false)}
        message="Welcome to the platform. You've earned 10 credits for signing up."
       />}

    </div>
  );
};

export default Register;
