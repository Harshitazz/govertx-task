import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReportModal = ({ isOpen, onClose, post, token, onReportSubmitted }) => {
  const [reasons, setReasons] = useState({
    spam: false,
    inappropriate: false,
    offensive: false,
    misleading: false,
    illegal: false,
    other: false
  });
  const [otherReason, setOtherReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleReasonChange = (reason) => {
    setReasons(prev => ({
      ...prev,
      [reason]: !prev[reason]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const selectedReasons = Object.keys(reasons).filter(key => reasons[key]);
    
    if (selectedReasons.length === 0) {
      toast.warning('Please select at least one reason for reporting');
      return;
    }

    if (reasons.other && !otherReason.trim()) {
      toast.warning('Please provide details for "Other" reason');
      return;
    }

    const reportData = {
      feedId: post._id,
      reasons: selectedReasons,
      otherReason: reasons.other ? otherReason : '',
    };
    const toastId = toast.loading('Submitting report...');

    try {
      setIsSubmitting(true);
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/feeds/report`,
        reportData,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      toast.update(toastId, { 
        render: 'Report submitted successfully', 
        type: 'success', 
        isLoading: false, 
        autoClose: 3000 
      });
      
      if (onReportSubmitted) {
        onReportSubmitted(response.data);
      }
      
      onClose();
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already reported')) {
        // If user has already reported this post
        toast.update(toastId, { 
            render: 'You have already reported this post', 
            type: 'error', 
            isLoading: false, 
            autoClose: 3000 
          });
        // toast.info('');
        onClose(); // Close the modal automatically
      } else {
        // Handle other errors
        toast.error('Failed to submit report: ' + (error.response?.data?.message || error.message));
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Report Content</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">
          Help us understand why you're reporting this content.
          Please select all that apply:
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-2 mb-4">
            {Object.keys(reasons).map(reason => (
              <div key={reason} className="flex items-center">
                <input
                  type="checkbox"
                  id={reason}
                  checked={reasons[reason]}
                  onChange={() => handleReasonChange(reason)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <label htmlFor={reason} className="ml-2 text-gray-700 capitalize">
                  {reason}
                </label>
              </div>
            ))}
          </div>
          
          {reasons.other && (
            <div className="mb-4">
              <label htmlFor="otherReason" className="block text-sm font-medium text-gray-700 mb-1">
                Please specify:
              </label>
              <textarea
                id="otherReason"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 h-20 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Please provide details..."
                disabled={isSubmitting}
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;