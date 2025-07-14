import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiChevronDown, FiCheck, FiX } = FiIcons;

const MultiPropertyFilter = ({ properties, selectedProperties, onSelectionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectAll = () => {
    if (selectedProperties.length === properties.length) {
      // If all are selected, deselect all
      onSelectionChange([]);
    } else {
      // Select all properties
      onSelectionChange(properties.map(p => p.name));
    }
  };

  const handlePropertyToggle = (propertyName) => {
    if (selectedProperties.includes(propertyName)) {
      onSelectionChange(selectedProperties.filter(name => name !== propertyName));
    } else {
      onSelectionChange([...selectedProperties, propertyName]);
    }
  };

  const getDisplayText = () => {
    if (selectedProperties.length === 0) {
      return 'No properties selected';
    } else if (selectedProperties.length === properties.length) {
      return 'All Properties';
    } else if (selectedProperties.length === 1) {
      return selectedProperties[0];
    } else {
      return `${selectedProperties.length} properties selected`;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white min-w-[200px]"
      >
        <span className="truncate">{getDisplayText()}</span>
        <SafeIcon 
          icon={FiChevronDown} 
          className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            <div className="p-2">
              {/* Select All Option */}
              <div
                onClick={handleSelectAll}
                className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
              >
                <span className="font-medium text-gray-700">
                  {selectedProperties.length === properties.length ? 'Deselect All' : 'Select All'}
                </span>
                {selectedProperties.length === properties.length && (
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-blue-600" />
                )}
              </div>
              
              <hr className="my-1" />
              
              {/* Individual Properties */}
              {properties.map((property) => (
                <div
                  key={property.id}
                  onClick={() => handlePropertyToggle(property.name)}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <span className="text-gray-700">{property.name}</span>
                  {selectedProperties.includes(property.name) && (
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              ))}
              
              {properties.length === 0 && (
                <div className="p-2 text-gray-500 text-sm">
                  No properties available
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Selected properties chips */}
      {selectedProperties.length > 1 && selectedProperties.length < properties.length && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedProperties.map((propertyName) => (
            <div
              key={propertyName}
              className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
            >
              <span>{propertyName}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePropertyToggle(propertyName);
                }}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <SafeIcon icon={FiX} className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiPropertyFilter;