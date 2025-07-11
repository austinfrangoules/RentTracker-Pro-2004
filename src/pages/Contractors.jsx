import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ContractorManagement from '../components/ContractorManagement';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers } = FiIcons;

const Contractors = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <SafeIcon icon={FiUsers} className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contractors</h1>
            <p className="text-gray-600">Manage your trusted service providers</p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ContractorManagement />
      </motion.div>
    </div>
  );
};

export default Contractors;