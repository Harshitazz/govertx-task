import { Eye, AlertTriangle } from 'lucide-react';
import { formatDateWithTime } from '../../../../utils/formatters';
import { useEffect } from 'react';

export default function ReportedFeedsTable({ feeds }) {

  useEffect(() => {
    console.log(feeds);
  }, [feeds]);

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[700px] w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Feed Title</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reported By</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-xs font-semibold text-center text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {feeds.map((feed, index) => (
            <tr key={`${feed.feedId}-${index}`}>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="font-medium text-gray-900">{feed.title}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-600">{feed.user}</td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-600">{feed.reasons}</td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-600">{formatDateWithTime(feed.reportedAt)}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex justify-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100">
                    <AlertTriangle className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
