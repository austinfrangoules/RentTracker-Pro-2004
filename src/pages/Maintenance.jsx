import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MaintenanceManagement from '../components/MaintenanceManagement';
import PurchaseOrderManagement from '../components/PurchaseOrderManagement';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTool, FiShoppingCart } = FiIcons;

const Maintenance = () => {
  const [activeTab, setActiveTab] = useState('records');

  const tabs = [
    { id: 'records', name: 'Maintenance Records', icon: FiTool },
    { id: 'purchases', name: 'Purchase Orders', icon: FiShoppingCart }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <SafeIcon icon={FiTool} className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maintenance & Repairs</h1>
            <p className="text-gray-600">Track maintenance records and purchase orders</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'records' && <MaintenanceManagement />}
            {activeTab === 'purchases' && <PurchaseOrderManagement />}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;