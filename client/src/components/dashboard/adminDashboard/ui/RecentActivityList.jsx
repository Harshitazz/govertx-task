import { formatDateWithTime } from '../../../../utils/formatters';

export default function RecentActivitiesList({ activities }) {
  const getActivityText = (activity) => {
    switch(activity.action) {
      case 'feed_saved': 
        return <span>Saved feed: <span className="text-blue-600">{activity.detail}</span></span>;
      case 'feed_report':
        return <span>Reported feed: <span className="text-red-600">{activity.detail}</span></span>;
      case 'daily_login':
        return <span>Logged into the system</span>;
      case 'credit_earned':
        return <span>Credit adjustment: <span className="text-green-600">{activity.detail}</span></span>;
      case 'account_created':
        return <span>Created A New Account</span>;
      default:
        return <span>{activity.action}</span>;
    }
  };

 

  return (
    <div className="space-y-4 max-h-64 overflow-y-auto">
      {activities.map(activity => (
        <div key={activity._id} className="border-b pb-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">{activity.user}</span>
            <span className="text-xs text-gray-500">{formatDateWithTime(activity.timestamp)}</span>
          </div>
          <div className="text-sm flex items-center gap-2 mt-1">
            {/* <ActivityBadge type={activity.action} /> */}
            {getActivityText(activity)}
          </div>
        </div>
      ))}
    </div>
  );
}