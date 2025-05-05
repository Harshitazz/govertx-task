import React, { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import ReportModal from '../components/modals/ReportModal';
import Modal from '../components/modals/Modal';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'saved'
  const [filter, setFilter] = useState('all'); // 'all', 'reddit', 'linkedin'
  const { userData, setUserData } = useContext(AuthContext);
  const isAuthenticated = !!userData.token;
const [showModal,setShowModal]= useState(false)
  // Report modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [postToReport, setPostToReport] = useState(null);

  // Fetch all feeds
  const fetchFeed = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/feeds`);
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feed:', error);
      toast.error('Failed to load feeds');
      setLoading(false);
    }
  };

  // Fetch saved feeds for authenticated users
  const fetchSavedFeeds = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/feeds/saved`, {
        headers: { Authorization: `Bearer ${userData.token}` }
      });
      setSavedPosts(response.data);
    } catch (error) {
      console.error('Error fetching saved feeds:', error);
      toast.error('Failed to load saved feeds');
    }
  };

  // Initial data load
  useEffect(() => {
    fetchFeed();
    if (isAuthenticated) {
      fetchSavedFeeds();
    }
  }, [isAuthenticated]);

  // Handle save post action
  const handleSave = async (post) => {
    if (!userData?.token) {
      toast.warning('Please log in to save posts');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/feeds/save`,
        { feedId: post._id },
        { headers: { Authorization: `Bearer ${userData?.token}` } }
      );

      const { message, credits } = response.data;

      setUserData((prev) => ({
        ...prev,
        credits: credits
      }));

      if (message === 'Feed already saved') {
        toast.info('Post already saved');
      } else {
        
        setShowModal(true); 
        setTimeout(() => {
          setShowModal(false);
          
        }, 3000);
      }

      fetchSavedFeeds(); // Optional: Refresh saved feeds if needed
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    }
  };


  // Handle share post action
  const handleShare = (post) => {
    navigator.clipboard.writeText(post.link)
      .then(() => {
        toast.success('Link copied to clipboard!');
      })
      .catch((error) => {
        console.error('Failed to copy link:', error);
        toast.error('Failed to copy link');
      });
  };

  // Open report modal
  const openReportModal = async (post) => {
    if (!isAuthenticated) {
      toast.warning('Please log in to report posts');
      return;
    }
      setPostToReport(post);
      setReportModalOpen(true);
    
  };

  // Handle report submission
  const handleReportSubmitted = (updatedPost) => {
    // Update the post in the current list to reflect report count
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === updatedPost._id ? { ...post, reportCount: updatedPost.reportCount } : post
      )
    );

    // Also update in saved posts if present
    setSavedPosts(prevSavedPosts =>
      prevSavedPosts.map(post =>
        post._id === updatedPost._id ? { ...post, reportCount: updatedPost.reportCount } : post
      )
    );

    toast.info(`This content now has ${updatedPost.reportCount} report(s)`);
  };

  // Filter displayed posts based on viewMode and filter
  const displayedPosts = useMemo(() => {
    let displayPosts = viewMode === 'all' ? posts : savedPosts;

    if (filter !== 'all') {
      displayPosts = displayPosts.filter(post => post.source === filter);
    }

    return displayPosts;
  }, [viewMode, posts, savedPosts, filter]);

  // Check if a post is saved
  const isPostSaved = (post) => {
    return savedPosts.some(savedPost => savedPost._id === post._id);
  };

  return (
    <div className="p-6">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Social Feed</h2>

        <div className="flex space-x-2">
          {/* View mode toggle */}
          {userData?.token && (
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode('all')}
                className={`px-4 py-2 text-sm rounded-l-md ${viewMode === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setViewMode('saved')}
                className={`px-4 py-2 text-sm rounded-r-md ${viewMode === 'saved'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
                  }`}
              >
                Saved
              </button>
            </div>
          )}

          {/* Source filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-md bg-white border border-gray-300"
          >
            <option value="all">All Sources</option>
            <option value="reddit">Reddit</option>
            <option value="twitter">Twitter</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : displayedPosts.length > 0 ? (
        <div className="max-h-[600px] overflow-y-scroll space-y-4 pr-2">
          {displayedPosts.map((post) => (
            <div key={post._id || post.link} className="p-4 border rounded shadow-sm bg-white">
              <div className="flex items-center mb-2 text-sm text-gray-600">
                <span className={`px-2 py-1 rounded-full mr-2 capitalize ${post.source === 'reddit' ? 'bg-orange-100 text-orange-700' :
                  post.source === 'twitter' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100'
                  }`}>
                  {post.source}
                </span>
                {post.author && <span className="mr-2">by {post.author}</span>}
                {post.createdAt &&
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                }

                {/* Report count badge */}
                {post.reportCount > 0 && (
                  <span className="ml-auto px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    {post.reportCount} report{post.reportCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-blue-600 hover:underline"
              >
                {post.title}
              </a>

              {post.content && (
                <p className="mt-2 text-gray-700 line-clamp-3">{post.content}</p>
              )}

              {post.thumbnail && (
                <img
                  src={post.thumbnail}
                  alt="Post thumbnail"
                  className="mt-2 max-h-32 rounded"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => handleSave(post)}
                  className={`text-white px-4 py-1 rounded flex items-center ${isPostSaved(post)
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  {isPostSaved(post) ? 'Saved' : 'Save'}
                </button>

                <button
                  onClick={() => handleShare(post)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-1 rounded flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>

                <button
                  onClick={() => openReportModal(post)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Report
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <h3 className="text-xl text-gray-700">No posts found</h3>
          <p className="text-gray-500 mt-2">
            {viewMode === 'saved'
              ? "You haven't saved any posts yet"
              : "No posts available for the selected filter"}
          </p>
        </div>
      )}

      {/* Report Modal */}
      {reportModalOpen && postToReport && (
        <ReportModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          post={postToReport}
          token={userData?.token}
          onReportSubmitted={handleReportSubmitted}
        />
      )}
      {showModal &&userData.role!=='admin' && (
        <Modal
          credits={5} // You can also pass `userData.credits` if needed
          onClose={() => setShowModal(false)}
          message="Huuray! you have earned 5 for your Interaction with Feeds."
        />
      )}
    </div>
  );
};

export default Feed;