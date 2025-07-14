import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import InventoryModal from '../components/InventoryModal';
import ShoppingListModal from '../components/ShoppingListModal';
import WeeklyDigestModal from '../components/WeeklyDigestModal';
import QuickAddBar from '../components/QuickAddBar';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiPlus,
  FiFilter,
  FiSearch,
  FiMapPin,
  FiX,
  FiPackage,
  FiShoppingCart,
  FiList,
  FiGrid,
  FiSettings,
  FiMail,
  FiZap,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiAlertTriangle,
  FiCheckCircle,
  FiMoreVertical,
  FiCalendar,
  FiDollarSign
} = FiIcons;

const Inventory = () => {
  const { inventory, properties, shoppingList, deleteInventoryItem, archiveShoppingItem } = useData();
  
  const [activeTab, setActiveTab] = useState('inventory');
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isShoppingModalOpen, setIsShoppingModalOpen] = useState(false);
  const [isWeeklyDigestModalOpen, setIsWeeklyDigestModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  // Filter inventory items
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProperty = propertyFilter === 'all' || item.property === propertyFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    let matchesStock = true;
    if (stockFilter === 'low') {
      matchesStock = item.currentStock < item.minStock;
    } else if (stockFilter === 'good') {
      matchesStock = item.currentStock >= item.minStock;
    }
    
    return matchesSearch && matchesProperty && matchesCategory && matchesStock;
  });

  // Filter shopping list
  const activeShoppingItems = shoppingList.filter(item => item.status === 'active');
  const filteredShoppingList = activeShoppingItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProperty = propertyFilter === 'all' || 
      item.properties.some(prop => prop === propertyFilter);
    return matchesSearch && matchesProperty;
  });

  // Get unique categories
  const categories = [...new Set(inventory.map(item => item.category))];
  
  // Get low stock items
  const lowStockItems = inventory.filter(item => item.currentStock < item.minStock);

  const handleAddInventory = () => {
    setSelectedItem(null);
    setIsInventoryModalOpen(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setIsInventoryModalOpen(true);
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteInventoryItem(id);
    }
  };

  const handleAddShopping = () => {
    setSelectedItem(null);
    setIsShoppingModalOpen(true);
  };

  const handleMarkAsPurchased = (id) => {
    archiveShoppingItem(id);
  };

  const getStockStatus = (item) => {
    if (item.currentStock < item.minStock) {
      return { status: 'low', color: 'text-red-600', bg: 'bg-red-100' };
    } else if (item.currentStock > item.maxStock * 0.8) {
      return { status: 'high', color: 'text-green-600', bg: 'bg-green-100' };
    } else {
      return { status: 'good', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    }
  };

  const InventoryCard = ({ item }) => {
    const stockStatus = getStockStatus(item);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.category}</p>
            <p className="text-sm text-gray-500">{item.property}</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setActionMenuOpen(actionMenuOpen === item.id ? null : item.id)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <SafeIcon icon={FiMoreVertical} className="w-4 h-4" />
            </button>
            {actionMenuOpen === item.id && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={() => {
                      handleEditItem(item);
                      setActionMenuOpen(null);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <SafeIcon icon={FiEdit2} className="w-4 h-4 inline mr-2" />
                    Edit Item
                  </button>
                  {item.productUrl && (
                    <a
                      href={item.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => setActionMenuOpen(null)}
                    >
                      <SafeIcon icon={FiExternalLink} className="w-4 h-4 inline mr-2" />
                      View Product
                    </a>
                  )}
                  <button
                    onClick={() => {
                      handleDeleteItem(item.id);
                      setActionMenuOpen(null);
                    }}
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4 inline mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Stock Level</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
              {item.currentStock} / {item.minStock} min
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                item.currentStock < item.minStock
                  ? 'bg-red-500'
                  : item.currentStock > item.maxStock * 0.8
                  ? 'bg-green-500'
                  : 'bg-yellow-500'
              }`}
              style={{
                width: `${Math.min((item.currentStock / item.maxStock) * 100, 100)}%`
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Cost:</span>
              <span className="ml-1 font-medium">${item.unitCost}</span>
            </div>
            <div>
              <span className="text-gray-500">Value:</span>
              <span className="ml-1 font-medium">${(item.currentStock * item.unitCost).toFixed(2)}</span>
            </div>
          </div>

          {item.location && (
            <div className="text-sm text-gray-600">
              <SafeIcon icon={FiMapPin} className="w-4 h-4 inline mr-1" />
              {item.location}
            </div>
          )}

          {item.lastRestocked && (
            <div className="text-xs text-gray-500">
              Last restocked: {new Date(item.lastRestocked).toLocaleDateString()}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const ShoppingCard = ({ item }) => {
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'high': return 'bg-red-100 text-red-800 border-red-200';
        case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'low': return 'bg-green-100 text-green-800 border-green-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">{item.name}</h3>
            <p className="text-sm text-gray-600">
              {item.quantity} {item.unit}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {item.properties.map((property, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {property}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
              {item.priority}
            </span>
            <button
              onClick={() => handleMarkAsPurchased(item.id)}
              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
              title="Mark as purchased"
            >
              <SafeIcon icon={FiCheckCircle} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {item.notes && (
          <p className="text-sm text-gray-600 mb-3">{item.notes}</p>
        )}

        {item.dueDate && (
          <div className="text-sm text-gray-500 mb-3">
            <SafeIcon icon={FiCalendar} className="w-4 h-4 inline mr-1" />
            Due: {new Date(item.dueDate).toLocaleDateString()}
          </div>
        )}

        {item.productUrl && (
          <a
            href={item.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <SafeIcon icon={FiExternalLink} className="w-4 h-4 mr-1" />
            View Product
          </a>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Track supplies and manage shopping lists</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsWeeklyDigestModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <SafeIcon icon={FiMail} className="w-4 h-4" />
            <span>Weekly Digest</span>
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={activeTab === 'inventory' ? handleAddInventory : handleAddShopping}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            <span>Add {activeTab === 'inventory' ? 'Item' : 'Shopping Item'}</span>
          </motion.button>
        </div>
      </div>

      {/* Quick Add Bar (Mobile) */}
      <QuickAddBar
        properties={properties}
        categories={categories}
        onAddInventory={handleAddInventory}
        onAddShopping={handleAddShopping}
      />

      {/* Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-red-600" />
            <h3 className="font-medium text-red-800">Low Stock Alert</h3>
          </div>
          <p className="text-red-700 mt-1">
            {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''} running low on stock
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'inventory'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiPackage} className="w-4 h-4 inline mr-2" />
            Inventory ({inventory.length})
          </button>
          <button
            onClick={() => setActiveTab('shopping')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'shopping'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiShoppingCart} className="w-4 h-4 inline mr-2" />
            Shopping List ({activeShoppingItems.length})
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search items..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Property Filter */}
          <select
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Properties</option>
            {properties.map((property) => (
              <option key={property.id} value={property.name}>
                {property.name}
              </option>
            ))}
          </select>

          {activeTab === 'inventory' && (
            <>
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Stock Filter */}
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Stock Levels</option>
                <option value="low">Low Stock</option>
                <option value="good">Good Stock</option>
              </select>
            </>
          )}

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <SafeIcon icon={FiGrid} className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <SafeIcon icon={FiList} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'inventory' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.map((item) => (
              <InventoryCard key={item.id} item={item} />
            ))}
            {filteredInventory.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No inventory items found</h3>
                <p className="text-gray-500 mb-6">
                  {inventory.length === 0
                    ? 'Add your first inventory item to get started'
                    : 'Try adjusting your search or filters'}
                </p>
                <button
                  onClick={handleAddInventory}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Add Inventory Item
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShoppingList.map((item) => (
              <ShoppingCard key={item.id} item={item} />
            ))}
            {filteredShoppingList.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No shopping items found</h3>
                <p className="text-gray-500 mb-6">
                  {activeShoppingItems.length === 0
                    ? 'Add your first shopping item to get started'
                    : 'Try adjusting your search or filters'}
                </p>
                <button
                  onClick={handleAddShopping}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Add Shopping Item
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <InventoryModal
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        item={selectedItem}
        properties={properties}
      />

      <ShoppingListModal
        isOpen={isShoppingModalOpen}
        onClose={() => setIsShoppingModalOpen(false)}
        item={selectedItem}
        inventory={inventory}
      />

      <WeeklyDigestModal
        isOpen={isWeeklyDigestModalOpen}
        onClose={() => setIsWeeklyDigestModalOpen(false)}
        properties={properties}
        lowStockItems={lowStockItems}
        shoppingItems={activeShoppingItems}
      />
    </div>
  );
};

export default Inventory;