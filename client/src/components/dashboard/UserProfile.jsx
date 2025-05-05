// components/dashboard/UserProfile.js
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { formatDateWithTime } from '../../utils/formatters';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';

const UserProfile = ({ user, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { userData, setUserData } = useContext(AuthContext);
  
  const [form, setForm] = useState({
    username: user.username || '',
    email: user.email || ''
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!userData.token) return;
    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/user/update-profile`, form, {
        headers: { Authorization: `Bearer ${userData?.token}` },
      });
      
      toast.success('Profile updated!');
      
      const updatedUser = {
        ...user,
        username: res.data.user.username,
        email: res.data.user.email
      };
      
      // Call the parent component's update function
      if (onProfileUpdate) {
        onProfileUpdate(updatedUser);
      }
      
      // Update AuthContext
      setUserData(prev => ({ ...prev, username: res.data.user.username }));
      setIsEditing(false);
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">User Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Username</p>
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              <p className="font-medium">{user.username}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              <p className="font-medium">{user.email}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium capitalize">{user.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Login</p>
            <p className="font-medium">{formatDateWithTime(user.lastLoginDate)}</p>
          </div>
        </div>
        <div className="mt-6 flex gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-500 text-white rounded-md px-4 py-2 font-medium"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 font-medium"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white rounded-md px-4 py-2 font-medium"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;