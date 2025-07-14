import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiCalendar, FiUser, FiDollarSign, FiMapPin, FiEdit2, FiTrash2, 
  FiClock, FiX, FiSave
} = FiIcons;

export const BookingCard = ({ booking, onEdit }) => {
  const { deleteBooking } = useData();
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'Airbnb': return 'bg-red-100 text-red-800';
      case 'VRBO': return 'bg-blue-100 text-blue-800';
      case 'Booking.com': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      deleteBooking(booking.id);
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }} 
      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm card-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPlatformColor(booking.platform)}`}>
            {booking.platform}
          </span>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={onEdit} 
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiEdit2} className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDelete} 
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-gray-700">
          <SafeIcon icon={FiUser} className="w-4 h-4 mr-3 text-gray-500" />
          <span className="font-medium">{booking.guestName}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-3 text-gray-500" />
          <span className="text-sm">{booking.propertyName}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-3 text-gray-500" />
          <span className="text-sm">
            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
          </span>
        </div>
        <div className="flex items-center text-gray-700">
          <SafeIcon icon={FiClock} className="w-4 h-4 mr-3 text-gray-500" />
          <span className="text-sm">{booking.nights} nights</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <SafeIcon icon={FiDollarSign} className="w-4 h-4 mr-1" />
            <span className="text-sm">${booking.rate}/night</span>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">${booking.total.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total Revenue</p>
          </div>
        </div>
        {(booking.cleaningFee > 0 || booking.petFee > 0) && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-500">
              {booking.cleaningFee > 0 && (
                <span>Cleaning: ${booking.cleaningFee}</span>
              )}
              {booking.petFee > 0 && (
                <span>Pet Fee: ${booking.petFee}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const BookingModal = ({ isOpen, onClose, booking }) => {
  const { addBooking, updateBooking, properties } = useData();
  const [formData, setFormData] = useState({
    propertyId: '',
    propertyName: '',
    guestName: '',
    checkIn: '',
    checkOut: '',
    nights: '',
    rate: '',
    cleaningFee: '',
    petFee: '',
    total: '',
    platform: 'Airbnb',
    status: 'confirmed'
  });
  
  useEffect(() => {
    if (booking) {
      setFormData(booking);
    } else {
      setFormData({
        propertyId: '',
        propertyName: '',
        guestName: '',
        checkIn: '',
        checkOut: '',
        nights: '',
        rate: '',
        cleaningFee: '',
        petFee: '',
        total: '',
        platform: 'Airbnb',
        status: 'confirmed'
      });
    }
  }, [booking]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      propertyId: parseInt(formData.propertyId),
      nights: parseInt(formData.nights),
      rate: parseFloat(formData.rate),
      cleaningFee: parseFloat(formData.cleaningFee) || 0,
      petFee: parseFloat(formData.petFee) || 0,
      total: parseFloat(formData.total)
    };
    
    if (booking) {
      updateBooking(booking.id, data);
    } else {
      addBooking(data);
    }
    
    onClose();
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate nights when check-in/out dates change
      if (name === 'checkIn' || name === 'checkOut') {
        if (updated.checkIn && updated.checkOut) {
          const checkIn = new Date(updated.checkIn);
          const checkOut = new Date(updated.checkOut);
          const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
          updated.nights = nights > 0 ? nights : '';
        }
      }
      
      // Auto-calculate total when any pricing field changes
      if (['nights', 'rate', 'cleaningFee', 'petFee'].includes(name) || (name === 'checkIn' || name === 'checkOut')) {
        const nights = parseInt(updated.nights) || 0;
        const rate = parseFloat(updated.rate) || 0;
        const cleaningFee = parseFloat(updated.cleaningFee) || 0;
        const petFee = parseFloat(updated.petFee) || 0;
        updated.total = (nights * rate) + cleaningFee + petFee;
      }
      
      // Update property name when property is selected
      if (name === 'propertyId') {
        const selectedProperty = properties.find(p => p.id === parseInt(value));
        updated.propertyName = selectedProperty ? selectedProperty.name : '';
      }
      
      return updated;
    });
  };
  
  const platforms = ['Airbnb', 'VRBO', 'Booking.com', 'Direct', 'Other'];
  const statuses = ['confirmed', 'pending', 'cancelled'];
  
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
                {booking ? 'Edit Booking' : 'Add New Booking'}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property
                  </label>
                  <select 
                    name="propertyId" 
                    value={formData.propertyId} 
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Property</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>{property.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guest Name
                  </label>
                  <input 
                    type="text" 
                    name="guestName" 
                    value={formData.guestName} 
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date
                  </label>
                  <input 
                    type="date" 
                    name="checkIn" 
                    value={formData.checkIn} 
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date
                  </label>
                  <input 
                    type="date" 
                    name="checkOut" 
                    value={formData.checkOut} 
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Nights
                  </label>
                  <input 
                    type="number" 
                    name="nights" 
                    value={formData.nights} 
                    onChange={handleChange}
                    required 
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nightly Rate ($)
                  </label>
                  <input 
                    type="number" 
                    name="rate" 
                    value={formData.rate} 
                    onChange={handleChange}
                    required 
                    step="0.01" 
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
                    min="0"
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
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform
                  </label>
                  <select 
                    name="platform" 
                    value={formData.platform} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {platforms.map((platform) => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
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
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total Revenue:</span>
                  <span className="text-green-600">${formData.total || 0}</span>
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