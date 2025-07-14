import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiX,
  FiSave,
  FiCalendar,
  FiMapPin,
  FiLink,
  FiAlertTriangle,
  FiPackage,
  FiPlus,
  FiMinus,
  FiCamera,
  FiBarcode,
  FiSearch
} = FiIcons;

const ShoppingListModal = ({ isOpen, onClose, item, inventory }) => {
  const { properties, addShoppingItem, updateShoppingItem } = useData();
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    unit: 'units',
    properties: [],
    priority: 'medium',
    notes: '',
    productUrl: '',
    dueDate: '',
    status: 'active'
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      resetForm();
    }
  }, [item]);

  const resetForm = () => {
    setFormData({
      name: '',
      quantity: 1,
      unit: 'units',
      properties: [],
      priority: 'medium',
      notes: '',
      productUrl: '',
      dueDate: '',
      status: 'active'
    });
    setSearchResults([]);
    setIsSearching(false);
    setCameraActive(false);
    setShowBarcodeScanner(false);
    setScannedBarcode(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Make sure at least one property is selected
    if (formData.properties.length === 0) {
      alert("Please select at least one property");
      return;
    }
    
    if (item) {
      await updateShoppingItem(item.id, formData);
    } else {
      await addShoppingItem({
        ...formData,
        createdAt: new Date().toISOString()
      });
    }
    
    onClose();
  };

  const handlePropertyToggle = (propertyName) => {
    setFormData(prev => ({
      ...prev,
      properties: prev.properties.includes(propertyName)
        ? prev.properties.filter(p => p !== propertyName)
        : [...prev.properties, propertyName]
    }));
  };

  const handleAllPropertiesToggle = () => {
    setFormData(prev => ({
      ...prev,
      properties: prev.properties.length === properties.length ? [] : properties.map(p => p.name)
    }));
  };

  // Search inventory as user types
  const handleNameChange = (value) => {
    setFormData(prev => ({ ...prev, name: value }));
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (value.length >= 2) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(() => {
        const results = inventory.filter(item => 
          item.name.toLowerCase().includes(value.toLowerCase()) ||
          item.category.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5);
        
        setSearchResults(results);
        setIsSearching(false);
      }, 300);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectInventoryItem = (inventoryItem) => {
    setFormData(prev => ({
      ...prev,
      name: inventoryItem.name,
      unit: inventoryItem.unit || 'units',
      productUrl: inventoryItem.productUrl || '',
      properties: [inventoryItem.property]
    }));
    setSearchResults([]);
  };

  // Simulate barcode scanning
  const handleBarcodeScanned = () => {
    // Simulate a successful scan with a random product
    const randomIndex = Math.floor(Math.random() * inventory.length);
    const randomItem = inventory[randomIndex];
    
    setScannedBarcode("123456789012");
    setShowBarcodeScanner(false);
    
    setFormData(prev => ({
      ...prev,
      name: randomItem.name,
      unit: randomItem.unit || 'units',
      productUrl: randomItem.productUrl || '',
      properties: [randomItem.property]
    }));
    
    setTimeout(() => {
      setScannedBarcode(null);
    }, 3000);
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
                {item ? 'Edit Shopping Item' : 'Add Shopping Item'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Barcode Scanner Result */}
              {scannedBarcode && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-100 p-2 rounded-full">
                      <SafeIcon icon={FiBarcode} className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-green-800">Product found!</div>
                      <div className="text-xs text-green-600">Barcode: {scannedBarcode}</div>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setScannedBarcode(null)}
                    className="text-green-700 hover:text-green-900"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Quick Scan Buttons (Mobile Only) */}
              {isMobile && !item && (
                <div className="flex space-x-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setShowBarcodeScanner(true)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-purple-50 text-purple-700 px-3 py-2 rounded-lg border border-purple-200 hover:bg-purple-100"
                  >
                    <SafeIcon icon={FiBarcode} className="w-4 h-4" />
                    <span>Scan Barcode</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCameraActive(true)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-200 hover:bg-blue-100"
                  >
                    <SafeIcon icon={FiCamera} className="w-4 h-4" />
                    <span>Take Photo</span>
                  </button>
                </div>
              )}

              {/* Barcode Scanner Simulation */}
              {showBarcodeScanner && (
                <div className="p-4 bg-black rounded-lg text-center relative">
                  <div className="w-full h-40 bg-gray-800 flex items-center justify-center mb-2 rounded">
                    <div className="w-3/4 h-1 bg-red-500 absolute animate-pulse"></div>
                    <div className="text-white">Scanning...</div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowBarcodeScanner(false)}
                      className="flex-1 px-3 py-2 bg-gray-600 text-white rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleBarcodeScanned}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded"
                    >
                      Simulate Scan
                    </button>
                  </div>
                </div>
              )}

              {/* Camera Simulation */}
              {cameraActive && (
                <div className="p-4 bg-black rounded-lg text-center">
                  <div className="w-full h-40 bg-gray-800 flex items-center justify-center mb-2 rounded">
                    <div className="text-white">Camera preview</div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setCameraActive(false)}
                      className="flex-1 px-3 py-2 bg-gray-600 text-white rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // Simulate taking a photo
                        setCameraActive(false);
                        // Show success message
                        alert("Photo captured! You can now add details.");
                      }}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded"
                    >
                      Capture
                    </button>
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <div className="relative">
                    <div className="flex">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        placeholder="Start typing to search existing items..."
                      />
                      {isSearching && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Search Results */}
                    {searchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <div className="p-2 text-xs text-gray-500 bg-gray-50 border-b border-gray-200">
                          Matching inventory items
                        </div>
                        {searchResults.map((result) => (
                          <button
                            key={result.id}
                            type="button"
                            onClick={() => handleSelectInventoryItem(result)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center border-b border-gray-100 last:border-0"
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                              <SafeIcon icon={FiPackage} className="w-4 h-4 text-gray-500" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{result.name}</div>
                              <div className="text-xs text-gray-500">
                                {result.property} • {result.category} • {result.currentStock} in stock
                              </div>
                            </div>
                            <div className="ml-auto">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                result.currentStock < result.minStock
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {result.currentStock < result.minStock ? 'Low Stock' : 'In Stock'}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <div className="flex">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ 
                          ...prev, 
                          quantity: Math.max(1, parseInt(prev.quantity) - 1) 
                        }))}
                        className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200"
                      >
                        <SafeIcon icon={FiMinus} className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          quantity: parseInt(e.target.value) || 1 
                        }))}
                        min="1"
                        required
                        className="w-full px-4 py-2 border-t border-b border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ 
                          ...prev, 
                          quantity: parseInt(prev.quantity) + 1 
                        }))}
                        className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-r-lg hover:bg-gray-200"
                      >
                        <SafeIcon icon={FiPlus} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="units">Units</option>
                      <option value="boxes">Boxes</option>
                      <option value="packs">Packs</option>
                      <option value="pieces">Pieces</option>
                      <option value="sets">Sets</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Properties Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Properties *
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleAllPropertiesToggle}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.properties.length === properties.length
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                        : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    All Properties
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    {properties.map(property => (
                      <button
                        key={property.id}
                        type="button"
                        onClick={() => handlePropertyToggle(property.name)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.properties.includes(property.name)
                            ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                            : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                        }`}
                      >
                        {property.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Priority and Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Product URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product URL
                </label>
                <input
                  type="url"
                  value={formData.productUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, productUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any additional notes..."
                />
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
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiSave} className="w-4 h-4" />
                  <span>Save Item</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingListModal;