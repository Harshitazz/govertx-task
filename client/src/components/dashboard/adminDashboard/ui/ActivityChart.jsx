import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function ActivityChart({ data }) {
  const [activeDataKey, setActiveDataKey] = useState('logins');

  const transformUserDataToChartData = (users) => {
    return users.map(user => {
      const logins = user.activities?.filter(a => a.action === 'daily_login').length || 0;
      const feedsSaved = user.activities?.filter(a => a.action === 'feed_saved').length || 0;

      return {
        name: user.username || user.email || 'Unnamed',
        logins,
        feedsSaved,
        credits: user.credits || 0
      };
    });
  };

  const chartData = transformUserDataToChartData(data);

  const dataKeys = {
    logins: { name: 'Logins', color: '#4f46e5' },
    feedsSaved: { name: 'Feeds Saved', color: '#10b981' },
    credits: { name: 'Credits', color: '#f59e0b' }
  };

  return (
    <div className="h-full">
      <div className="flex space-x-4 mb-4">
        {Object.entries(dataKeys).map(([key, { name, color }]) => (
          <button
            key={key}
            className={`px-3 py-1 text-xs rounded-full ${
              activeDataKey === key ? 'text-white' : 'bg-gray-100 text-gray-700'
            }`}
            style={{ backgroundColor: activeDataKey === key ? color : undefined }}
            onClick={() => setActiveDataKey(key)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey={activeDataKey}
              fill={dataKeys[activeDataKey].color}
              barSize={30}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
