import React, { useState, useEffect, useContext } from 'react';

import Overview from '../components/dashboard/userDashboard/Overview';
import Credits from '../components/dashboard/userDashboard/Credits';
import SavedFeeds from '../components/dashboard/userDashboard/SavedFeeds';
import Activities from '../components/dashboard/userDashboard/Activites';
import UserProfile from '../components/dashboard/UserProfile';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

import { toast } from 'react-toastify';

// Main Dashboard Component
export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState('');
  const { userData } = useContext(AuthContext);
  const isAuthenticated = !!userData.token;
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/user/dashboard`, {
        headers: { Authorization: `Bearer ${userData.token}` }
      });
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user dashboard:', error);
      toast.error('Failed to load user data');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUser();
  }, [isAuthenticated]);

  // Handle profile updates
  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  // inside UserDashboard component
const handleFeedRemoval = (removedFeedId) => {
  setProfile(prev => ({
    ...prev,
    savedFeeds: prev.savedFeeds.filter(feed => feed._id !== removedFeedId)
  }));
};


  // Get the current component based on active tab
  const getActiveComponent = () => {
    switch(activeTab) {
      case 'overview':
        return <Overview userData={profile} setActiveTab={setActiveTab} />;
      case 'credits':
        return <Credits userData={profile} />;
      case 'saved':
        return (
          <SavedFeeds 
            savedFeeds={profile.savedFeeds} 
            onFeedRemove={handleFeedRemoval} 
            token={userData.token}
          />
        );
        
      case 'activity':
        return <Activities activities={profile.activities} />;
      case 'profile':
        return <UserProfile user={profile} onProfileUpdate={handleProfileUpdate} />;
      default:
        return <Overview userData={profile} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Header activeTab={activeTab} username={profile.username} />
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