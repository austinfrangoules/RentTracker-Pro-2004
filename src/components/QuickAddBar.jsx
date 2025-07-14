import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiPlus, 
  FiX, 
  FiPackage, 
  FiShoppingCart, 
  FiChevronDown, 
  FiChevronUp 
} = FiIcons;

const QuickAddBar = ({ properties, categories, onAddInventory, onAddShopping }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quickAddType, setQuickAddType] = useState(null); // 'inventory' or 'shopping'
  const [quickAddItem, setQuickAddItem] = useState({
    name: '',
    property: properties.length > 0 ? properties[0].name : '',
    category: categories.length > 0 ? categories[0] : 'Other'
  });

  const handleQuickAddSubmit = (e) => {
    e.preventDefault();
    if (quickAddType === 'inventory') {
      onAddInventory();
    } else {
      onAddShopping();
    }
    setQuickAddItem({
      name: '',
      property: properties.length > 0 ? properties[0].name : '',
      category: categories.length > 0 ? categories[0] : 'Other'
    });
    setIsExpanded(false);
  };

  // Only show on small screens
  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
          isExpanded 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-white text-gray-700 border border-gray-200'
        }`}
      >
        <span className="font-medium flex items-center">
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Quick Add
        </span>
        <SafeIcon 
          icon={isExpanded ? FiChevronUp : FiChevronDown} 
          className="w-4 h-4" 
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 mt-2 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setQuickAddType('inventory')}
                  className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center space-x-1 ${
                    quickAddType === 'inventory'
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <SafeIcon icon={FiPackage} className="w-4 h-4" />
                  <span>Inventory</span>
                </button>
                <button
                  onClick={() => setQuickAddType('shopping')}
                  className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center space-x-1 ${
                    quickAddType === 'shopping'
                      ? 'bg-purple-100 text-purple-800 font-medium'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <SafeIcon icon={FiShoppingCart} className="w-4 h-4" />
                  <span>Shopping</span>
                </button>
              </div>

              {quickAddType && (
                <form onSubmit={handleQuickAddSubmit}>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item Name
                      </label>
                      <input
                        type="text"
                        value={quickAddItem.name}
                        onChange={(e) => setQuickAddItem({ ...quickAddItem, name: e.target.value })}
                        placeholder="Enter item name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Property
                      </label>
                      <select
                        value={quickAddItem.property}
                        onChange={(e) => setQuickAddItem({ ...quickAddItem, property: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        {properties.map(property => (
                          <option key={property.id} value={property.name}>
                            {property.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setIsExpanded(false);
                          setQuickAddType(null);
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={`px-4 py-2 rounded-lg text-white transition-colors ${
                          quickAddType === 'inventory'
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickAddBar;