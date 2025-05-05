import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const FeedItem = ({ id, title, link, date, source, onRemove, token }) => {
  const getSourceDetails = (src) => {
    switch (src?.toLowerCase()) {
      case 'reddit':
        return { icon: '🔴', color: 'text-red-500', bgColor: 'bg-red-50' };
      case 'twitter':
        return { icon: '🐦', color: 'text-blue-400', bgColor: 'bg-blue-50' };
      default:
        return { icon: '📰', color: 'text-gray-500', bgColor: 'bg-gray-50' };
    }
  };

  const { icon, color, bgColor } = getSourceDetails(source);

  const handleRemoveClick = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/feeds/remove-feed',
        { feedId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || 'Feed removed');
      onRemove(id); // update UI in parent
    } catch (error) {
      console.error('Failed to remove feed:', error);
      toast.error('Failed to remove feed');
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className={`${bgColor} ${color} rounded-full w-6 h-6 flex items-center justify-center mr-2`}>
            {icon}
          </span>
          <h4 className="font-medium">{title}</h4>
        </div>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
      <p className="text-sm text-gray-600 mt-1">{link}</p>
      <div className="mt-3 flex justify-end">
        <Link to={link} className="text-blue-500 text-sm font-medium hover:underline mr-4">View</Link>
        <button
          className="text-red-500 text-sm font-medium hover:underline"
          onClick={handleRemoveClick}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default FeedItem;
