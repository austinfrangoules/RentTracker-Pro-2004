import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiMapPin, FiDollarSign, FiCalendar, FiEdit2, FiTrash2, FiTrendingUp, 
  FiUsers, FiHome, FiSave, FiX
} = FiIcons;

export const PropertyCard = ({ property, onEdit }) => {
  const { deleteProperty } = useData();
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'occupied': return 'bg-yellow-100 text-yellow-800';
      case 'vacant': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      deleteProperty(property.id);
    }
  };
  
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }} 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden card-hover"
    >
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{property.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
            {property.status}
          </span>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-2" />
            {property.address}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <SafeIcon icon={FiDollarSign} className="w-4 h-4 mr-2" />
            ${property.monthlyRevenue.toLocaleString()} / month
          </div>
          {property.nextCheckout && (
            <div className="flex items-center text-sm text-gray-600">
              <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-2" />
              Next checkout: {new Date(property.nextCheckout).toLocaleDateString()}
            </div>
          )}
        </div>
        
        {/* Enhanced metrics matching your spreadsheet */}
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-gray-500">Avg Nightly</p>
            <p className="text-sm font-semibold text-gray-800">${property.averageNightly}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Total Bookings</p>
            <p className="text-sm font-semibold text-gray-800">{property.totalBookings}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Expenses</p>
            <p className="text-sm font-semibold text-red-600">${property.expenses}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Profit</p>
            <p className="text-sm font-semibold text-green-600">${property.profit}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Occupancy Rate</span>
            <span>{property.occupancyRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${property.occupancyRate}%` }} 
            />
          </div>
        </div>
        
        {/* Fee Information */}
        <div className="flex justify-between text-xs text-gray-500 mb-4 p-2 bg-gray-50 rounded">
          <span>Cleaning: ${property.cleaningFee}</span>
          <span>Pet: ${property.petFee}</span>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={onEdit} 
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiEdit2} className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button 
            onClick={handleDelete} 
            className="bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const PropertyModal = ({ isOpen, onClose, property }) => {
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

export const PropertyOverview = () => {
  const { properties } = useData();
  
  const statusCounts = properties.reduce((acc, property) => {
    acc[property.status] = (acc[property.status] || 0) + 1;
    return acc;
  }, {});
  
  const statusConfig = {
    occupied: { icon: FiUsers, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    vacant: { icon: FiHome, color: 'text-green-600', bg: 'bg-green-100' },
    maintenance: { icon: FiIcons.FiTool, color: 'text-red-600', bg: 'bg-red-100' }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Property Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(statusCounts).map(([status, count]) => {
          const config = statusConfig[status];
          return (
            <div key={status} className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bg}`}>
                <SafeIcon icon={config.icon} className={`w-5 h-5 ${config.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600 capitalize">{status}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="space-y-3">
        {properties.slice(0, 3).map((property) => (
          <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <img src={property.image} alt={property.name} className="w-12 h-12 rounded-lg object-cover" />
              <div>
                <h3 className="font-medium text-gray-800">{property.name}</h3>
                <p className="text-sm text-gray-600">{property.occupancyRate}% occupancy</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">${property.monthlyRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">per month</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};