import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiUsers, FiTool } = FiIcons;

const PropertyOverview = () => {
  const { properties } = useData();

  const statusCounts = properties.reduce((acc, property) => {
    acc[property.status] = (acc[property.status] || 0) + 1;
    return acc;
  }, {});

  const statusConfig = {
    occupied: { icon: FiUsers, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    vacant: { icon: FiHome, color: 'text-green-600', bg: 'bg-green-100' },
    maintenance: { icon: FiTool, color: 'text-red-600', bg: 'bg-red-100' }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Property Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(statusCounts).map(([status, count]) => {
          const config = statusConfig[status];
          return (
            <div key={status} className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bg}`}>
                <SafeIcon icon={config.icon} className={`w-5 h-5 ${config.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600 capitalize">{status}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        {properties.slice(0, 3).map((property) => (
          <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <img
                src={property.image}
                alt={property.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-800">{property.name}</h3>
                <p className="text-sm text-gray-600">{property.occupancyRate}% occupancy</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">${property.monthlyRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">per month</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PropertyOverview;