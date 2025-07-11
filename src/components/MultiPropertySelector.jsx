import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiChevronDown, FiHome, FiX } = FiIcons;

const MultiPropertySelector = ({ properties, selectedProperties, onSelectionChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelection, setTempSelection] = useState(selectedProperties);

  useEffect(() => {
    setTempSelection(selectedProperties);
  }, [selectedProperties]);

  const handleToggleProperty = (propertyName) => {
    setTempSelection(prev => {
      if (prev.includes(propertyName)) {
        return prev.filter(p => p !== propertyName);
      } else {
        return [...prev, propertyName];
      }
    });
  };

  const handleSelectAll = () => {
    const allPropertyNames = properties.map(p => p.name);
    setTempSelection(allPropertyNames);
  };

  const handleSelectNone = () => {
    setTempSelection([]);
  };

  const handleApply = () => {
    onSelectionChange(tempSelection);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempSelection(selectedProperties);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedProperties.length === 0) return 'Select Properties';
    if (selectedProperties.length === 1) return selectedProperties[0];
    if (selectedProperties.length === properties.length) return 'All Properties';
    return `${selectedProperties.length} Properties Selected`;
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
      >
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiHome} className="w-4 h-4 text-gray-500" />
          <span className="text-gray-900">{getDisplayText()}</span>
        </div>
        <SafeIcon 
          icon={FiChevronDown} 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden"
          >
            {/* Header with controls */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Select Properties</span>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={FiX} className="w-4 h-4" />
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSelectAll}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Select All
                </button>
                <button
                  onClick={handleSelectNone}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Select None
                </button>
              </div>
            </div>

            {/* Property list */}
            <div className="max-h-48 overflow-y-auto">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleToggleProperty(property.name)}
                >
                  <div className="flex items-center flex-1">
                    <div className={`w-4 h-4 border-2 rounded flex items-center justify-center mr-3 ${
                      tempSelection.includes(property.name)
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {tempSelection.includes(property.name) && (
                        <SafeIcon icon={FiCheck} className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{property.name}</p>
                      <p className="text-xs text-gray-500">{property.address}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer with apply/cancel */}
            <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Apply ({tempSelection.length})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleCancel}
        />
      )}
    </div>
  );
};

export default MultiPropertySelector;