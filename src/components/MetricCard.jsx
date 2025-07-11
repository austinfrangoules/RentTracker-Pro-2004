import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';

const MetricCard = ({ title, value, icon, trend, trendUp, color }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 card-hover"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <SafeIcon icon={icon} className="w-5 h-5" />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className={`text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </p>
      </div>
    </motion.div>
  );
};

export default MetricCard;