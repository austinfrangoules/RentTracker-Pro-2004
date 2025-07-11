import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMenu, FiBell, FiUser, FiChevronLeft, FiChevronRight } = FiIcons;

const Header = ({ onMenuClick, sidebarOpen }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm border-b border-gray-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuClick} 
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <SafeIcon 
              icon={sidebarOpen ? FiChevronLeft : FiChevronRight} 
              className="w-6 h-6 text-gray-600" 
            />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Welcome back!</h2>
            <p className="text-sm text-gray-600">Here's what's happening with your properties</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <SafeIcon icon={FiBell} className="w-6 h-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          
          <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiUser} className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">John Doe</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;