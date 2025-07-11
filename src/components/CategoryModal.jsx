import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiSave, FiPlus, FiCheck } = FiIcons;

const CategoryModal = ({ isOpen, onClose, type, propertyFilter }) => {
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
      .filter(cat => cat.properties.includes(propertyFilter))
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
    
    if ((!selectedCategories.length && !customCategory) || 
        (customCategory && !customCategoryName.trim())) {
      alert('Please select or enter at least one category');
      return;
    }

    if (!propertyFilter || propertyFilter === 'all') {
      alert('Please select a specific property');
      return;
    }

    setIsLoading(true);
    try {
      const categoriesToAdd = customCategory 
        ? [customCategoryName] 
        : selectedCategories;

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
                            className={`p-3 text-sm rounded-lg text-left transition-colors flex items-center justify-between
                              ${selectedCategories.includes(category)
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

export default CategoryModal;