import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiSave } = FiIcons;

const PropertyModal = ({ isOpen, onClose, property }) => {
  const { addProperty, updateProperty } = useData();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    status: 'vacant',
    monthlyRevenue: '',
    occupancyRate: '',
    nextCheckout: '',
    image: '',
    cleaningFee: '',
    petFee: '',
    totalBookings: '',
    averageNightly: '',
    expenses: '',
    profit: ''
  });

  useEffect(() => {
    if (property) {
      setFormData(property);
    } else {
      setFormData({
        name: '',
        address: '',
        status: 'vacant',
        monthlyRevenue: '',
        occupancyRate: '',
        nextCheckout: '',
        image: '',
        cleaningFee: '',
        petFee: '',
        totalBookings: '',
        averageNightly: '',
        expenses: '',
        profit: ''
      });
    }
  }, [property]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      monthlyRevenue: parseFloat(formData.monthlyRevenue),
      occupancyRate: parseFloat(formData.occupancyRate),
      cleaningFee: parseFloat(formData.cleaningFee) || 0,
      petFee: parseFloat(formData.petFee) || 0,
      totalBookings: parseInt(formData.totalBookings) || 0,
      averageNightly: parseFloat(formData.averageNightly) || 0,
      expenses: parseFloat(formData.expenses) || 0,
      profit: parseFloat(formData.profit) || 0
    };

    if (property) {
      updateProperty(property.id, data);
    } else {
      addProperty(data);
    }
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate profit when revenue or expenses change
      if (name === 'monthlyRevenue' || name === 'expenses') {
        const revenue = parseFloat(updated.monthlyRevenue) || 0;
        const expenses = parseFloat(updated.expenses) || 0;
        updated.profit = revenue - expenses;
      }
      
      return updated;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {property ? 'Edit Property' : 'Add New Property'}
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Name
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="vacant">Vacant</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Occupancy Rate (%)
                  </label>
                  <input
                    type="number"
                    name="occupancyRate"
                    value={formData.occupancyRate}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Revenue ($)
                  </label>
                  <input
                    type="number"
                    name="monthlyRevenue"
                    value={formData.monthlyRevenue}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Expenses ($)
                  </label>
                  <input
                    type="number"
                    name="expenses"
                    value={formData.expenses}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Average Nightly Rate ($)
                  </label>
                  <input
                    type="number"
                    name="averageNightly"
                    value={formData.averageNightly}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Bookings
                  </label>
                  <input
                    type="number"
                    name="totalBookings"
                    value={formData.totalBookings}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cleaning Fee ($)
                  </label>
                  <input
                    type="number"
                    name="cleaningFee"
                    value={formData.cleaningFee}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pet Fee ($)
                  </label>
                  <input
                    type="number"
                    name="petFee"
                    value={formData.petFee}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next Checkout Date
                  </label>
                  <input
                    type="date"
                    name="nextCheckout"
                    value={formData.nextCheckout}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Monthly Profit:</span>
                  <span className="text-green-600">${formData.profit || 0}</span>
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

export default PropertyModal;