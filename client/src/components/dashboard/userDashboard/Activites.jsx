// components/Activities.js
import React from 'react';
import ActivityItem from './ui/ActivityItem';
import { formatDateWithTime } from '../../../utils/formatters';

const Activities = ({ activities }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">All Activity</h3>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-500">No activity recorded yet.</p>
          ) : (
            [...activities].reverse().map(activity => (
              <ActivityItem
                key={activity._id}
                action={activity.action}
                detail={activity.detail}
                timestamp={formatDateWithTime(activity.timestamp)}
              />
            ))
            
          )}
        </div>
      </div>
    </div>
  );
};

export default Activities;