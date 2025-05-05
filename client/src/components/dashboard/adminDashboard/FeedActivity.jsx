import { useState, useEffect } from 'react';
import ReportedFeedsTable from './ui/ReportedFeedsTable';
import { BookmarkPlus } from 'lucide-react';
import StatCard from '../userDashboard/ui/StatCard';

export default function FeedActivity({ allposts }) {
  const [feedStats, setFeedStats] = useState({
    totalSaved: 0,
    totalReported: 0,
    totalRead: 0
  });
  const [categoryData, setCategoryData] = useState([]);
  const [reportedFeeds, setReportedFeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setIsLoading(true);

      let totalSaved = 0;
      let totalReported = 0;
      let totalRead = allposts.length;

      const allReportEntries = [];
      const categoryStats = {};

      allposts.forEach(feed => {
        totalSaved += feed.savedBy.length;

        if (feed.reports.length > 0) {
          totalReported += feed.reports.length;

          // Flatten each report into a row entry
          feed.reports.forEach(report => {
            allReportEntries.push({
              feedId: feed._id,
              title: feed.title,
              user: report.user?.username || 'Unknown',
              reasons: report.reasons.join(', '),
              otherReason: report.otherReason,
              reportedAt: report.createdAt,
            });
          });
        }

        if (categoryStats[feed.source]) {
          categoryStats[feed.source]++;
        } else {
          categoryStats[feed.source] = 1;
        }
      });

      setFeedStats({ totalSaved, totalReported, totalRead });
      setReportedFeeds(allReportEntries);
      setCategoryData(Object.entries(categoryStats).map(([source, count]) => ({ source, count })));
    } catch (error) {
      console.error('Error fetching feed data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [allposts]);

  if (isLoading) {
    return <div>Loading feed activity data...</div>;
  }

  return (
    <div className="space-y-6 ">
      {/* Responsive Grid for Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Feeds Saved"
          value={feedStats.totalSaved}
          icon={<BookmarkPlus className="h-8 w-8 text-green-500" />}
        />
        <StatCard
          title="Total Feeds Reported"
          value={feedStats.totalReported}
          icon={<BookmarkPlus className="h-8 w-8 text-green-500" />}
        />
        <StatCard
          title="Total Feeds Read"
          value={feedStats.totalRead}
          icon={<BookmarkPlus className="h-8 w-8 text-green-500" />}
        />
      </div>

      {/* Responsive Reported Feeds Table */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Reported Feeds</h3>
        <ReportedFeedsTable feeds={reportedFeeds} />
      </div>
    </div>
  );
}
