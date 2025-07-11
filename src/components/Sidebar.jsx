import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiHome,        // Dashboard
  FiDollarSign,  // Finances
  FiPackage,     // Inventory
  FiBarChart2,   // Analytics
  FiGrid,        // Properties
  FiTool,        // Maintenance
  FiUsers,       // Contractors
  FiSettings,    // Settings
  FiX, 
  FiChevronLeft, 
  FiChevronRight 
} = FiIcons;

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const menuItems = [
    { name: 'Dashboard', icon: FiHome, path: '/' },
    { name: 'Finances', icon: FiDollarSign, path: '/finances' },
    { name: 'Properties', icon: FiGrid, path: '/properties' },
    { name: 'Maintenance', icon: FiTool, path: '/maintenance' },
    { name: 'Contractors', icon: FiUsers, path: '/contractors' },
    { name: 'Inventory', icon: FiPackage, path: '/inventory' },
    { name: 'Analytics', icon: FiBarChart2, path: '/analytics' },
    { name: 'Settings', icon: FiSettings, path: '/settings' }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={onClose} 
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={isOpen ? 'open' : 'collapsed'}
        variants={
          isMobile
            ? { open: { x: 0 }, collapsed: { x: '-100%' } }
            : { open: { width: '280px' }, collapsed: { width: '80px' } }
        }
        className={`fixed lg:static inset-y-0 left-0 z-50 sidebar-gradient text-white shadow-xl overflow-hidden ${
          isMobile ? 'w-80' : ''
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h1
            className={`text-2xl font-bold whitespace-nowrap transition-opacity duration-200 ${
              !isOpen && !isMobile ? 'opacity-0' : 'opacity-100'
            }`}
          >
            RentTracker Pro
          </h1>
          <div className="flex">
            {!isMobile && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <SafeIcon icon={isOpen ? FiChevronLeft : FiChevronRight} className="w-5 h-5" />
              </button>
            )}
            {isMobile && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`
                  }
                  end={item.path === '/'}
                >
                  <SafeIcon icon={item.icon} className="w-5 h-5" />
                  <span
                    className={`ml-3 font-medium transition-opacity duration-200 ${
                      !isOpen && !isMobile ? 'opacity-0 w-0' : 'opacity-100'
                    }`}
                  >
                    {item.name}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className={`absolute bottom-6 left-6 right-6 transition-opacity duration-200 ${
            !isOpen && !isMobile ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm text-white/80 mb-2">Pro Plan</p>
            <p className="text-xs text-white/60">Manage unlimited properties</p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;