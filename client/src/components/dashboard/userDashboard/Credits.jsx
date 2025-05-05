// components/Credits.js
import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import CreditChart from './ui/CreditChart';

const Credits = ({ userData }) => {
  const [creditPurchaseAmount, setCreditPurchaseAmount] = useState(50);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">Credit Status</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Current Balance</p>
            <p className="text-3xl font-bold">{userData.credits} credits</p>
          </div>
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <CreditCard className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Purchase Credits</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="creditAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  id="creditAmount"
                  className="border border-gray-300 rounded-l-md px-3 py-2 w-full"
                  value={creditPurchaseAmount}
                  onChange={(e) => setCreditPurchaseAmount(Number(e.target.value))}
                  min="10"
                />
                <span className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-md px-3 py-2">
                  credits
                </span>
              </div>
            </div>
            <button className="bg-blue-500 text-white rounded-md px-4 py-2 w-full font-medium">
              Purchase Credits
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Credit Usage History</h3>
          <div className="h-64">
            <CreditChart data={userData.creditHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credits;