import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import OccupancyChart from '../components/OccupancyChart';
import RevenueChart from '../components/RevenueChart';
import PropertyPerformance from '../components/PropertyPerformance';

const Analytics = () => {
  const { properties, transactions } = useData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <div className="text-sm text-gray-500">
          Data insights for better decisions
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Occupancy Rates</h2>
          <OccupancyChart properties={properties} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Revenue Trends</h2>
          <RevenueChart transactions={transactions} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Property Performance</h2>
        <PropertyPerformance properties={properties} transactions={transactions} />
      </motion.div>
    </div>
  );
};

export default Analytics;