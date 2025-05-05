// components/Header.js
import React from 'react';

const Header = ({ activeTab, username }) => {
  // Get page title based on active tab
  const getPageTitle = () => {
    switch(activeTab) {
      case 'overview':
        return 'Dashboard Overview';
      case 'credits':
        return 'Credit Management';
      case 'saved':
        return 'Saved Feeds';
      case 'activity':
        return 'Recent Activity';
      case 'profile':
        return 'User Profile';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="mb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          {getPageTitle()}
        </h1>
        <div className="flex items-center">
          <div className="mr-4 text-right">
            <p className="text-sm text-gray-500">Welcome back,</p>
            <p className="font-semibold">{username}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {username?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;