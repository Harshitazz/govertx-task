import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const CreditChart = ({ data }) => {
  // Format data with tooltips
  const formattedData = data?.map(item => ({
    ...item,
    tooltipContent: item.reason || 'Balance change'
  }));
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <LineChart width={500} height={220} data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Line 
          type="monotone" 
          dataKey="balance" 
          stroke="#3B82F6" 
          activeDot={{ r: 8 }} 
          name="Credit Balance"
        />
        <Tooltip 
          formatter={(value, name, props) => {
            return [`${value} credits`, 'Balance', props.payload.tooltipContent];
          }}
        />
      </LineChart>
    </div>
  );
};

export default CreditChart;