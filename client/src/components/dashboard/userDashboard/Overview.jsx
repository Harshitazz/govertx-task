// components/Overview.js
import React from 'react';
import { CreditCard, BookmarkPlus, User, LineChart, Bell } from 'lucide-react';
import StatCard from './ui/StatCard';
import CreditChart from './ui/CreditChart';
import ActivityItem from './ui/ActivityItem';
import { formatDate, formatDateWithTime } from '../../../utils/formatters';

const Overview = ({ userData, setActiveTab }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Available Credits" 
          value={userData.credits} 
          icon={<CreditCard className="h-8 w-8 text-blue-500" />} 
        />
        <StatCard 
          title="Saved Feeds" 
          value={userData.savedFeeds?.length} 
          icon={<BookmarkPlus className="h-8 w-8 text-green-500" />} 
        />
        <StatCard 
          title="Last Login" 
          value={formatDate(userData.lastLoginDate)} 
          icon={<User className="h-8 w-8 text-purple-500" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4 flex items-center">
            <LineChart className="h-5 w-5 mr-2 text-blue-500" />
            Credit History
          </h3>
          <div className="h-64">
            <CreditChart data={userData.creditHistory} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-amber-500" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {userData?.activities?.slice(0, 3).map(activity => (
              <ActivityItem
                key={activity._id}
                action={activity.action}
                detail={activity.detail}
                timestamp={formatDateWithTime(activity.timestamp)}
              />
            ))}
            <button 
              onClick={() => setActiveTab('activity')}
              className="text-blue-500 text-sm font-medium hover:underline"
            >
              View all activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;