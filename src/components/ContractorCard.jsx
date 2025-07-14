import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiPhone, FiMail, FiMapPin, FiEdit2, FiTrash2, 
  FiCalendar, FiDollarSign, FiClock, FiCheckCircle, FiHistory
} = FiIcons;

const ContractorCard = ({ contractor, onEdit, onViewHistory, viewMode = 'grid' }) => {
  const { deleteContractor } = useData();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${contractor.name}?`)) {
      deleteContractor(contractor.id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Main Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">{contractor.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contractor.status)}`}>
                  {contractor.status || 'active'}
                </span>
              </div>
              {contractor.company && (
                <p className="text-sm text-gray-600">{contractor.company}</p>
              )}
            </div>

            {/* Services */}
            <div className="flex-1">
              <div className="flex flex-wrap gap-1">
                {contractor.services?.slice(0, 3).map((service, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {service}
                  </span>
                ))}
                {contractor.services?.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    +{contractor.services.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Contact */}
            <div className="flex-1">
              <div className="text-sm text-gray-600">
                {contractor.phone && (
                  <div className="flex items-center">
                    <SafeIcon icon={FiPhone} className="w-3 h-3 mr-1" />
                    {contractor.phone}
                  </div>
                )}
                {contractor.email && (
                  <div className="flex items-center">
                    <SafeIcon icon={FiMail} className="w-3 h-3 mr-1" />
                    {contractor.email}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onViewHistory}
              className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
              title="Service History"
            >
              <SafeIcon icon={FiHistory} className="w-4 h-4" />
            </button>
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              title="Edit Contractor"
            >
              <SafeIcon icon={FiEdit2} className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              title="Delete Contractor"
            >
              <SafeIcon icon={FiTrash2} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{contractor.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contractor.status)}`}>
              {contractor.status || 'active'}
            </span>
          </div>
          {contractor.company && (
            <p className="text-sm text-gray-600">{contractor.company}</p>
          )}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={onViewHistory}
            className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
            title="Service History"
          >
            <SafeIcon icon={FiHistory} className="w-4 h-4" />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            title="Edit Contractor"
          >
            <SafeIcon icon={FiEdit2} className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            title="Delete Contractor"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        {contractor.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <SafeIcon icon={FiPhone} className="w-4 h-4 mr-2 text-gray-500" />
            <a href={`tel:${contractor.phone}`} className="hover:text-blue-600">
              {contractor.phone}
            </a>
          </div>
        )}
        {contractor.email && (
          <div className="flex items-center text-sm text-gray-600">
            <SafeIcon icon={FiMail} className="w-4 h-4 mr-2 text-gray-500" />
            <a href={`mailto:${contractor.email}`} className="hover:text-blue-600">
              {contractor.email}
            </a>
          </div>
        )}
      </div>

      {/* Services */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-700 mb-2">Services</h4>
        <div className="flex flex-wrap gap-1">
          {contractor.services?.slice(0, 3).map((service, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {service}
            </span>
          ))}
          {contractor.services?.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              +{contractor.services.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Locations */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-700 mb-2">Work Locations</h4>
        <div className="flex flex-wrap gap-1">
          {contractor.locations?.slice(0, 2).map((location, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              <SafeIcon icon={FiMapPin} className="w-3 h-3 mr-1" />
              {location}
            </span>
          ))}
          {contractor.locations?.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              +{contractor.locations.length - 2} more
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      {(contractor.totalJobs || contractor.avgResponseTime || contractor.lastWorked) && (
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          {contractor.totalJobs && (
            <div className="text-center">
              <p className="text-xs text-gray-500">Total Jobs</p>
              <p className="text-sm font-semibold text-gray-800">{contractor.totalJobs}</p>
            </div>
          )}
          {contractor.avgResponseTime && (
            <div className="text-center">
              <p className="text-xs text-gray-500">Response Time</p>
              <p className="text-sm font-semibold text-gray-800">{contractor.avgResponseTime}h</p>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {contractor.tags && contractor.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {contractor.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                {tag}
              </span>
            ))}
            {contractor.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                +{contractor.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Last Worked */}
      {contractor.lastWorked && (
        <div className="text-xs text-gray-500 border-t pt-3">
          <div className="flex items-center">
            <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1" />
            Last worked: {new Date(contractor.lastWorked).toLocaleDateString()}
          </div>
        </div>
      )}

      {/* Notes Preview */}
      {contractor.notes && (
        <div className="text-xs text-gray-500 border-t pt-3 mt-3">
          <p className="truncate">{contractor.notes}</p>
        </div>
      )}
    </motion.div>
  );
};

export default ContractorCard;