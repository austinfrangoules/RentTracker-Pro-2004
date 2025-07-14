import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiSave, FiLink, FiShoppingCart, FiMapPin, FiTag, FiPackage, FiDollarSign, FiCalendar } = FiIcons;

const InventoryModal = ({ isOpen, onClose, item, properties }) => {
  const { addInventoryItem, updateInventoryItem } = useData();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    property: '',
    currentStock: '',
    minStock: '',
    maxStock: '',
    unitCost: '',
    supplier: '',
    lastRestocked: '',
    productUrl: '',
    location: '',
    notes: '',
    purchaseDate: ''
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        name: '',
        category: '',
        property: '',
        currentStock: '',
        minStock: '',
        maxStock: '',
        unitCost: '',
        supplier: '',
        lastRestocked: '',
        productUrl: '',
        location: '',
        notes: '',
        purchaseDate: ''
      });
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      currentStock: parseInt(formData.currentStock),
      minStock: parseInt(formData.minStock),
      maxStock: parseInt(formData.maxStock),
      unitCost: parseFloat(formData.unitCost)
    };

    if (item) {
      updateInventoryItem(item.id, data);
    } else {
      addInventoryItem(data);
    }
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const categories = [
    'Linens', 'Bathroom', 'Kitchen', 'Cleaning', 
    'Amenities', 'Maintenance', 'Electronics', 'Furniture', 
    'Decorations', 'Outdoor', 'Safety', 'Other'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {item ? 'Edit Item' : 'Add New Item'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center">
                      <SafeIcon icon={FiTag} className="w-4 h-4 mr-1" />
                      Category *
                    </span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center">
                      <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-1" />
                      Property *
                    </span>
                  </label>
                  <select
                    name="property"
                    value={formData.property}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Property</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.name}>{property.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center">
                      <SafeIcon icon={FiPackage} className="w-4 h-4 mr-1" />
                      Storage Location
                    </span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Kitchen Cabinet, Garage Shelf 2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              {/* Stock Information */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-md font-medium text-gray-800 mb-3">Stock Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Stock *
                    </label>
                    <input
                      type="number"
                      name="currentStock"
                      value={formData.currentStock}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Stock *
                    </label>
                    <input
                      type="number"
                      name="minStock"
                      value={formData.minStock}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Stock *
                    </label>
                    <input
                      type="number"
                      name="maxStock"
                      value={formData.maxStock}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Purchase Information */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-md font-medium text-gray-800 mb-3">Purchase Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <SafeIcon icon={FiDollarSign} className="w-4 h-4 mr-1" />
                        Unit Cost ($) *
                      </span>
                    </label>
                    <input
                      type="number"
                      name="unitCost"
                      value={formData.unitCost}
                      onChange={handleChange}
                      required
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <SafeIcon icon={FiShoppingCart} className="w-4 h-4 mr-1" />
                        Supplier
                      </span>
                    </label>
                    <input
                      type="text"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <SafeIcon icon={FiLink} className="w-4 h-4 mr-1" />
                        Product URL
                      </span>
                    </label>
                    <input
                      type="url"
                      name="productUrl"
                      value={formData.productUrl}
                      onChange={handleChange}
                      placeholder="https://amazon.com/product/link"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                        Last Restocked
                      </span>
                    </label>
                    <input
                      type="date"
                      name="lastRestocked"
                      value={formData.lastRestocked}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Additional Information */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-md font-medium text-gray-800 mb-3">Additional Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any additional information about this item..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              {/* Preview Product Link */}
              {formData.productUrl && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center">
                    <SafeIcon icon={FiLink} className="w-4 h-4 mr-1" />
                    Product Link Preview
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 truncate max-w-[75%]">
                      {formData.productUrl}
                    </span>
                    <a
                      href={formData.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 text-sm font-medium hover:text-blue-800"
                    >
                      Open Link
                    </a>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3 pt-4 mt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiSave} className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InventoryModal;