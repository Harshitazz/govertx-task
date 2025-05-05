import React, { useState, useEffect, useContext } from 'react';

import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

import { toast } from 'react-toastify';
import Dashboard from '../components/dashboard/adminDashboard/Dashboard';
import FeedActivity from '../components/dashboard/adminDashboard/FeedActivity';
import UserManagement from '../components/dashboard/adminDashboard/UserManagement';

// Main Dashboard Component
export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState('');
  const { userData } = useContext(AuthContext);
  const isAuthenticated = !!userData.token;
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    // Fetch users data - in a real app, this would be an API call
    fetchUsers();
  }, [isAuthenticated]);

  const fetchUsers = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/admin`, {
        headers: { Authorization: `Bearer ${userData.token}` }
      });
      setUsers(response.data);

      const response1 = await axios.get(`http://localhost:5000/admin/posts`, {
        headers: { Authorization: `Bearer ${userData.token}` }
      });
      setPosts(response1.data)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user dashboard:', error);
      toast.error('Failed to load user data');
      setLoading(false);
    }
  };



  // Get the current component based on active tab
  const getActiveComponent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard users={users}/>;
      case 'users':
        return <UserManagement users={users} onCreditChange={handleCreditChange} />;
      case 'feeds':
        return <FeedActivity allposts={posts}/>;
      
      default:
        return <Dashboard users={users}/>;
    }
  };
  const handleCreditChange = (updatedProfile) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user._id === updatedProfile._id ? updatedProfile : user
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} admin={true}/>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Header activeTab={activeTab} username={userData.name} />
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        ) : (
          getActiveComponent()
        )}
      </div>
    </div>
  );
}