import { useEffect, useState } from 'react';
import { Users, CreditCard, Save, Activity } from 'lucide-react';
import StatCard from '../userDashboard/ui/StatCard';
import ActivityChart from './ui/ActivityChart';
import RecentActivitiesList from './ui/RecentActivityList';

export default function Dashboard({ users }) {
  const [stats, setStats] = useState({
    userCount: 0,
    creditsDistributed: 0,
    feedsSaved: 0,
    activeUsers: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!users || users.length === 0) return;

    // Compute stats
    const userCount = users.length;
    const creditsDistributed = users.reduce((sum, user) => sum + user.credits, 0);
    const feedsSaved = users.reduce((sum, user) => sum + user.savedFeeds.length, 0);

    const today = new Date().toISOString().split('T')[0];
    const activeUsers = users.filter(user =>
      user.activities.some(activity => activity.timestamp.startsWith(today))
    ).length;

    // Gather recent activities
    const allActivities = users.flatMap(user =>
      user.activities.map(a => ({
        ...a,
        user: user.username
      }))
    );
    const sortedActivities = allActivities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    // Update state
    setStats({ userCount, creditsDistributed, feedsSaved, activeUsers });
    setRecentActivities(sortedActivities);
    setIsLoading(false);
  }, [users]);

  if (isLoading) {
    return <div>Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.userCount}
          icon={<Users className="text-blue-500" />}
        />
        <StatCard
          title="Credits Distributed"
          value={stats.creditsDistributed}
          icon={<CreditCard className="text-green-500" />}
        />
        <StatCard
          title="Feeds Saved"
          value={stats.feedsSaved}
          icon={<Save className="text-purple-500" />}
        />
        <StatCard
          title="Daily Active Users"
          value={stats.activeUsers}
          icon={<Activity className="text-orange-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">User Activity Trends</h3>
          <div className="h-64">
            <ActivityChart data={users} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <RecentActivitiesList activities={recentActivities} />
        </div>
      </div>
    </div>
  );
}
