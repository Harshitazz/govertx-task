// components/SavedFeeds.js
import React from 'react';
import FeedItem from './ui/FeedItem';
import { formatDate } from '../../../utils/formatters';

const SavedFeeds = ({ savedFeeds, onFeedRemove, token }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">Your Saved Feeds</h3>
        <div className="space-y-4">
          {savedFeeds.length === 0 ? (
            <p className="text-gray-500">You don't have any saved feeds yet.</p>
          ) : (
            savedFeeds.map(feed => (
              <FeedItem
                key={feed._id}
                id={feed._id}
                title={feed.title}
                link={feed.link}
                date={formatDate(feed.createdAt)}
                source={feed.source}
                onRemove={onFeedRemove}
                 token={token}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedFeeds;