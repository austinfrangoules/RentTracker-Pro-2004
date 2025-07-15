```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMapPin, FiDollarSign, FiCalendar, FiEdit2, FiTrash2, FiTrendingUp, FiUsers, FiHome, FiEye } = FiIcons;

const PropertyCard = ({ property, onEdit }) => {
  const { deleteProperty } = useData();
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'occupied':
        return 'bg-yellow-100 text-yellow-800';
      case 'vacant':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    if (window.confirm('Are you sure you want to delete this property?')) {
      deleteProperty(property.id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking edit
    onEdit(property);
  };

  const handleClick = () => {
    navigate(`/properties/${property.id}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden card-hover cursor-pointer"
      onClick={handleClick}
    >
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-full object-cover"
        />
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
            ${property.monthlyRevenue?.toLocaleString() || 0} / month
          </div>
        </div>

        {/* Enhanced metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-gray-500">Avg Nightly</p>
            <p className="text-sm font-semibold text-gray-800">${property.averageNightly || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Total Bookings</p>
            <p className="text-sm font-semibold text-gray-800">{property.totalBookings || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Expenses</p>
            <p className="text-sm font-semibold text-red-600">${property.expenses || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Profit</p>
            <p className="text-sm font-semibold text-green-600">${property.profit || 0}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Occupancy Rate</span>
            <span>{property.occupancyRate || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${property.occupancyRate || 0}%` }}
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/properties/${property.id}`);
            }}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiEye} className="w-4 h-4" />
            <span>View</span>
          </button>
          <button
            onClick={handleEdit}
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

export default PropertyCard;
```