import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiX, FiSave, FiCheck, FiAlertTriangle, FiPlus, FiEdit2, FiTrash2, 
  FiCalendar, FiUser, FiDollarSign, FiMapPin, FiClock, FiBarChart2,
  FiTrendingUp, FiFilter, FiDownload, FiPrinter, FiMove, FiEdit3, 
  FiArrowUp, FiArrowDown, FiChevronLeft, FiChevronRight, FiMenu, FiBell
} = FiIcons;

// Reusable MetricCard component
export const MetricCard = ({ title, value, icon, trend, trendUp, color }) => {
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

// Header Component
export const Header = ({ onMenuClick, sidebarOpen }) => {
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
            <SafeIcon icon={sidebarOpen ? FiChevronLeft : FiChevronRight} className="w-6 h-6 text-gray-600" />
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

// Layout Component
export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      // Auto-collapse on mobile
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        isMobile={isMobile} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          sidebarOpen={sidebarOpen} 
        />
        <main className={`flex-1 overflow-auto p-6 transition-all duration-300 ${!sidebarOpen && !isMobile ? 'ml-20' : ''}`}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

// Sidebar Component
export const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const menuItems = [
    { name: 'Dashboard', icon: FiIcons.FiHome, path: '/' },
    { name: 'Finances', icon: FiIcons.FiDollarSign, path: '/finances' },
    { name: 'Inventory', icon: FiIcons.FiPackage, path: '/inventory' },
    { name: 'Analytics', icon: FiIcons.FiBarChart2, path: '/analytics' },
    { name: 'Properties', icon: FiIcons.FiGrid, path: '/properties' },
    { name: 'Settings', icon: FiIcons.FiSettings, path: '/settings' }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      )}
      
      {/* Sidebar */}
      <motion.div 
        initial={false}
        animate={isOpen ? 'open' : 'collapsed'}
        variants={isMobile ? 
          { open: { x: 0 }, collapsed: { x: '-100%' } } : 
          { open: { width: '280px' }, collapsed: { width: '80px' } }
        }
        className={`fixed lg:static inset-y-0 left-0 z-50 sidebar-gradient text-white shadow-xl overflow-hidden ${isMobile ? 'w-80' : ''}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h1 className={`text-2xl font-bold whitespace-nowrap transition-opacity duration-200 ${!isOpen && !isMobile ? 'opacity-0' : 'opacity-100'}`}>
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
                <a 
                  href={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    window.location.hash === `#${item.path}` ? 
                      'bg-white/20 text-white shadow-lg' : 
                      'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <SafeIcon icon={item.icon} className="w-5 h-5" />
                  <span className={`ml-3 font-medium transition-opacity duration-200 ${!isOpen && !isMobile ? 'opacity-0 w-0' : 'opacity-100'}`}>
                    {item.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className={`absolute bottom-6 left-6 right-6 transition-opacity duration-200 ${!isOpen && !isMobile ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm text-white/80 mb-2">Pro Plan</p>
            <p className="text-xs text-white/60">Manage unlimited properties</p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export const PrintModal = ({ isOpen, onClose, onPrint, properties, currentYear }) => {
  const [printSettings, setPrintSettings] = useState({
    scale: 70,
    orientation: 'landscape',
    margins: 'minimal',
    years: [currentYear],
    includeHeader: true
  });

  // Generate a range of years for selection
  const availableYears = [];
  for (let i = currentYear - 4; i <= currentYear; i++) {
    availableYears.push(i);
  }

  const handlePrint = () => {
    onPrint(printSettings);
    onClose();
  };

  const toggleYearSelection = (year) => {
    setPrintSettings(prev => {
      if (prev.years.includes(year)) {
        return { ...prev, years: prev.years.filter(y => y !== year) };
      } else {
        return { ...prev, years: [...prev.years, year].sort() };
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Print Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scale ({printSettings.scale}%)
            </label>
            <input
              type="range"
              min="30"
              max="100"
              value={printSettings.scale}
              onChange={(e) => setPrintSettings(prev => ({ ...prev, scale: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>30%</span>
              <span>100%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orientation
            </label>
            <select
              value={printSettings.orientation}
              onChange={(e) => setPrintSettings(prev => ({ ...prev, orientation: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="landscape">Landscape (Recommended)</option>
              <option value="portrait">Portrait</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Margins
            </label>
            <select
              value={printSettings.margins}
              onChange={(e) => setPrintSettings(prev => ({ ...prev, margins: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="minimal">Minimal</option>
              <option value="normal">Normal</option>
              <option value="none">None</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years to Include
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableYears.map(year => (
                <div key={year} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`year-${year}`}
                    checked={printSettings.years.includes(year)}
                    onChange={() => toggleYearSelection(year)}
                    className="mr-2"
                  />
                  <label htmlFor={`year-${year}`} className="text-sm text-gray-700">{year}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="include-header"
              checked={printSettings.includeHeader}
              onChange={() => setPrintSettings(prev => ({ ...prev, includeHeader: !prev.includeHeader }))}
              className="mr-2"
            />
            <label htmlFor="include-header" className="text-sm text-gray-700">
              Include header with property name and year
            </label>
          </div>
        </div>
        <div className="flex space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Print
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const ExportDropdown = ({ isOpen, onClose, onExport }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20"
    >
      <div className="py-1">
        <button
          onClick={() => {
            onExport('csv');
            onClose();
          }}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          Export as CSV
        </button>
        <button
          onClick={() => {
            onExport('excel');
            onClose();
          }}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          Export as Excel
        </button>
        <button
          onClick={() => {
            onExport('pdf');
            onClose();
          }}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          Export as PDF
        </button>
      </div>
    </div>
  );
};

export const DeleteCategoryModal = ({ isOpen, onClose, category, onConfirm }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(dontShowAgain);
      onClose();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Delete Category</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-3 text-yellow-600 mb-4">
                <SafeIcon icon={FiAlertTriangle} className="w-6 h-6" />
                <span className="font-medium">Confirm Deletion</span>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the category "{category?.name}"? This action cannot be undone.
              </p>
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="dontShowAgain"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="dontShowAgain" className="ml-2 text-sm text-gray-600">
                  Don't show this confirmation again
                </label>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={FiCheck} className="w-4 h-4" />
                      <span>Delete Category</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const CategoryEditModal = ({ isOpen, onClose, category }) => {
  const { updateCustomCategory } = useData();
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen && category) {
      setCategoryName(category.name);
      setSuccessMessage('');
    }
  }, [isOpen, category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    if (categoryName === category.name) {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      await updateCustomCategory(
        category.name,
        categoryName,
        category.type,
        category.property
      );
      setSuccessMessage(`✅ Successfully updated category to "${categoryName}"!`);
      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!category) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Edit Category
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>
            {successMessage ? (
              <div className="p-6 text-center">
                <div className="text-green-500 text-6xl mb-4">
                  <SafeIcon icon={FiCheck} className="w-16 h-16 mx-auto" />
                </div>
                <p className="text-lg font-medium text-green-700">{successMessage}</p>
                <p className="text-sm text-gray-600 mt-2">Closing automatically...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <p><strong>Type:</strong> {category.type}</p>
                    <p><strong>Property:</strong> {category.property}</p>
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <SafeIcon icon={FiSave} className="w-4 h-4" />
                        <span>Update Category</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const CategoryModal = ({ isOpen, onClose, type, propertyFilter }) => {
  const { addCustomCategory, customCategories } = useData();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedCategories([]);
      setCustomCategory(false);
      setCustomCategoryName('');
      setSuccessMessage('');
    }
  }, [isOpen]);

  // Get existing categories for the current property and type
  const existingCategories = [
    ...(type === 'income'
      ? ['Booking Revenue', 'Cleaning Fees', 'Pet Fees', 'Other Income']
      : ['Mortgage', 'Property Tax', 'Insurance', 'Utilities', 'Cleaning', 'Maintenance', 'Supplies', 'Other Expenses']),
    ...(customCategories[type] || [])
      .filter(cat => cat.properties?.includes(propertyFilter))
      .map(cat => cat.name)
  ];

  // Suggested categories (filtered to remove existing ones)
  const suggestedCategories = type === 'income'
    ? [
        'Booking Revenue', 'Cleaning Fees', 'Pet Fees', 'Late Checkout Fees',
        'Early Checkin Fees', 'Damage Deposits', 'Additional Guest Fees',
        'Referral Commission', 'Security Deposit Interest', 'Laundry Fees',
        'Parking Fees', 'Resort Fees', 'Other Income'
      ].filter(cat => !existingCategories.includes(cat))
    : [
        'Mortgage', 'Property Tax', 'HOA Fees', 'Insurance', 'Utilities',
        'Internet/Cable', 'Cleaning', 'Maintenance', 'Repairs', 'Supplies',
        'Marketing', 'Photography', 'Listing Fees', 'Management Fees',
        'Accounting', 'Legal Fees', 'Business Licenses', 'Travel',
        'Software Subscriptions', 'Property Management', 'Landscaping',
        'Snow Removal', 'Pest Control', 'Other Expenses'
      ].filter(cat => !existingCategories.includes(cat));

  const handleToggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!selectedCategories.length && !customCategory) || (customCategory && !customCategoryName.trim())) {
      alert('Please select or enter at least one category');
      return;
    }

    if (!propertyFilter || propertyFilter === 'all') {
      alert('Please select a specific property');
      return;
    }

    setIsLoading(true);
    try {
      const categoriesToAdd = customCategory ? [customCategoryName] : selectedCategories;
      for (const categoryName of categoriesToAdd) {
        const categoryData = {
          name: categoryName,
          type: type,
          properties: [propertyFilter]
        };
        await addCustomCategory(categoryData);
      }
      setSuccessMessage(`✅ Successfully added ${categoriesToAdd.length} categor${categoriesToAdd.length === 1 ? 'y' : 'ies'}!`);
      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error adding categories:', error);
      alert('Failed to add categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Add New {type === 'income' ? 'Income' : 'Expense'} Categories
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>
            {successMessage ? (
              <div className="p-6 text-center">
                <div className="text-green-500 text-6xl mb-4">
                  <SafeIcon icon={FiCheck} className="w-16 h-16 mx-auto" />
                </div>
                <p className="text-lg font-medium text-green-700">{successMessage}</p>
                <p className="text-sm text-gray-600 mt-2">Closing automatically...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Property Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Adding to:</strong> {propertyFilter}
                  </p>
                </div>
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select categories to add
                  </label>
                  {customCategory ? (
                    <div className="mb-4">
                      <input
                        type="text"
                        value={customCategoryName}
                        onChange={(e) => setCustomCategoryName(e.target.value)}
                        placeholder="Enter custom category name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setCustomCategory(false)}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Choose from suggestions instead
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-2 mb-3 max-h-60 overflow-y-auto">
                        {suggestedCategories.map(category => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => handleToggleCategory(category)}
                            className={`p-3 text-sm rounded-lg text-left transition-colors flex items-center justify-between ${
                              selectedCategories.includes(category)
                                ? 'bg-blue-100 text-blue-800 border-2 border-blue-400'
                                : 'bg-gray-50 text-gray-800 hover:bg-gray-100 border-2 border-transparent'
                            }`}
                          >
                            <span>{category}</span>
                            {selectedCategories.includes(category) && (
                              <SafeIcon icon={FiCheck} className="w-4 h-4" />
                            )}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomCategory(true);
                          setCustomCategoryName('');
                        }}
                        className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <SafeIcon icon={FiPlus} className="w-4 h-4" />
                        <span>Create custom category</span>
                      </button>
                    </>
                  )}
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <SafeIcon icon={FiSave} className="w-4 h-4" />
                        <span>Add {selectedCategories.length || customCategory ? 'Categories' : 'Category'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};