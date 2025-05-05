import React from 'react';
import { LineChart, CreditCard, User, BookmarkPlus, Bell } from 'lucide-react';

const ActivityItem = ({ action, detail, timestamp }) => {
  let actionIcon;
  let bgColor;
  
  // Handle new activity types from our schema
  switch (action) {
    case 'feed_read':
      actionIcon = <LineChart className="h-5 w-5 text-blue-500" />;
      bgColor = 'bg-blue-100';
      break;
    case 'credit_earned':
      actionIcon = <CreditCard className="h-5 w-5 text-green-500" />;
      bgColor = 'bg-green-100';
      break;
    case 'login':
      actionIcon = <User className="h-5 w-5 text-purple-500" />;
      bgColor = 'bg-purple-100';
      break;
    case 'feed_saved':
      actionIcon = <BookmarkPlus className="h-5 w-5 text-amber-500" />;
      bgColor = 'bg-amber-100';
      break;
    case 'feed_reported':
      actionIcon = <Bell className="h-5 w-5 text-red-500" />;
      bgColor = 'bg-red-100';
      break;
    // Legacy types for backward compatibility
    case 'Feed Read':
      actionIcon = <LineChart className="h-5 w-5 text-blue-500" />;
      bgColor = 'bg-blue-100';
      break;
    case 'Credit Purchase':
      actionIcon = <CreditCard className="h-5 w-5 text-green-500" />;
      bgColor = 'bg-green-100';
      break; 
    case 'Profile Update':
      actionIcon = <User className="h-5 w-5 text-purple-500" />;
      bgColor = 'bg-purple-100';
      break;
    case 'Feed Saved':
      actionIcon = <BookmarkPlus className="h-5 w-5 text-amber-500" />;
      bgColor = 'bg-amber-100';
      break;
    default:
      actionIcon = <Bell className="h-5 w-5 text-gray-500" />;
      bgColor = 'bg-gray-100';
  }

  // Format the action name for display (convert from snake_case to Title Case)
  const formatActionName = (actionStr) => {
    if (actionStr.includes('_')) {
      return actionStr.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return actionStr; // Already formatted
  };

  return (
    <div className="flex items-start">
      <div className={`${bgColor} rounded-full p-2 mr-3`}>
        {actionIcon}
      </div>
      <div>
        <p className="font-medium">{formatActionName(action)}</p>
        <p className="text-sm text-gray-600">{detail}</p>
        <p className="text-xs text-gray-500 mt-1">{timestamp}</p>
      </div>
    </div>
  );
};

export default ActivityItem;