import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiX,
  FiSave,
  FiMail,
  FiCheck,
  FiMapPin,
  FiCalendar,
  FiAlertTriangle,
  FiShoppingCart
} = FiIcons;

const WeeklyDigestModal = ({ isOpen, onClose, properties, lowStockItems, shoppingItems }) => {
  const [settings, setSettings] = useState({
    enabled: false,
    frequency: 'weekly',
    day: 'monday',
    email: '',
    includeAll: true,
    selectedProperties: properties.map(p => p.name),
    includeLowStock: true,
    includeShoppingList: true
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePropertyToggle = (propertyName) => {
    setSettings(prev => ({
      ...prev,
      selectedProperties: prev.selectedProperties.includes(propertyName)
        ? prev.selectedProperties.filter(p => p !== propertyName)
        : [...prev.selectedProperties, propertyName]
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Save logic would go here
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  const handleSelectAll = () => {
    setSettings(prev => ({
      ...prev,
      includeAll: true,
      selectedProperties: properties.map(p => p.name)
    }));
  };

  const handleClearAll = () => {
    setSettings(prev => ({
      ...prev,
      includeAll: false,
      selectedProperties: []
    }));
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
                Configure Weekly Digest
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>

            {isSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-green-800 mb-2">
                  Weekly Digest Configured!
                </h3>
                <p className="text-gray-600">
                  Your weekly inventory digest will be sent according to your settings.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSave} className="p-6 space-y-6">
                {/* Enable Weekly Digest */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">Enable Weekly Digest</h3>
                    <p className="text-sm text-gray-500">
                      Receive a summary of inventory status and shopping needs
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enabled}
                      onChange={() => setSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Frequency Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                        Frequency
                      </span>
                    </label>
                    <select
                      value={settings.frequency}
                      onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                        Day of Week
                      </span>
                    </label>
                    <select
                      value={settings.day}
                      onChange={(e) => setSettings(prev => ({ ...prev, day: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                      <option value="saturday">Saturday</option>
                      <option value="sunday">Sunday</option>
                    </select>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center">
                      <SafeIcon icon={FiMail} className="w-4 h-4 mr-1" />
                      Email Address
                    </span>
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email to receive digests"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required={settings.enabled}
                  />
                </div>

                {/* Properties Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <span className="flex items-center">
                        <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-1" />
                        Properties to Include
                      </span>
                    </label>
                    <div className="flex space-x-2 text-xs">
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={handleClearAll}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                    {properties.map(property => (
                      <label key={property.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.selectedProperties.includes(property.name)}
                          onChange={() => handlePropertyToggle(property.name)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{property.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Content Options */}
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Include in Digest</h3>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.includeLowStock}
                      onChange={() => setSettings(prev => ({ ...prev, includeLowStock: !prev.includeLowStock }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiAlertTriangle} className="w-4 h-4 text-amber-500" />
                      <span className="text-sm text-gray-700">Low Stock Items ({lowStockItems.length})</span>
                    </div>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.includeShoppingList}
                      onChange={() => setSettings(prev => ({ ...prev, includeShoppingList: !prev.includeShoppingList }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiShoppingCart} className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-700">Shopping List Items ({shoppingItems.length})</span>
                    </div>
                  </label>
                </div>

                {/* Preview */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                    <SafeIcon icon={FiMail} className="w-4 h-4 mr-2" />
                    Digest Preview
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-500">
                    <p className="mb-2">
                      <strong>Subject:</strong> Weekly Inventory Digest - {new Date().toLocaleDateString()}
                    </p>
                    <p className="mb-2">
                      <strong>Frequency:</strong> {settings.frequency.charAt(0).toUpperCase() + settings.frequency.slice(1)} on {settings.day.charAt(0).toUpperCase() + settings.day.slice(1)}s
                    </p>
                    <p className="mb-2">
                      <strong>Properties:</strong> {settings.includeAll ? 'All Properties' : settings.selectedProperties.join(', ')}
                    </p>
                    <p>
                      <strong>Content:</strong> {[
                        settings.includeLowStock ? 'Low Stock Items' : null,
                        settings.includeShoppingList ? 'Shopping List' : null
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
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
                    disabled={settings.enabled && !settings.email}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <SafeIcon icon={FiSave} className="w-4 h-4" />
                    <span>Save Settings</span>
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

export default WeeklyDigestModal;