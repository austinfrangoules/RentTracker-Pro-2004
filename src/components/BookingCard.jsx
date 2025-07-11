import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiUser, FiDollarSign, FiMapPin, FiEdit2, FiTrash2, FiClock } = FiIcons;

const BookingCard = ({ booking, onEdit }) => {
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

export default BookingCard;