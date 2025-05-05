import React from 'react';
import {
  Grid, CreditCard, BookmarkPlus, Bell, User, LogOut,
  Users, Activity, Home
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, admin = false }) {
  // Common items for all users
  const baseNavItems = [
    { id: 'overview', label: 'Overview', icon: <Grid size={20} /> },
    { id: 'credits', label: 'Credits', icon: <CreditCard size={20} /> },
    { id: 'saved', label: 'Saved Feeds', icon: <BookmarkPlus size={20} /> },
    { id: 'activity', label: 'Activity', icon: <Bell size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  ];

  // Additional admin-only items
  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'users', label: 'User Management', icon: <Users size={20} /> },
    { id: 'feeds', label: 'Feed Activity', icon: <Activity size={20} /> },
  ];

  const navItems = admin ?adminNavItems : baseNavItems;

  return (
    <aside className="w-64 bg-white shadow-md h-screen">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600">
          {admin ? 'Admin Panel' : 'Dashboard'}
        </h1>
      </div>
      <nav className="p-2 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`flex items-center space-x-3 p-3 w-full rounded-md text-left transition-colors ${
              activeTab === item.id
                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
