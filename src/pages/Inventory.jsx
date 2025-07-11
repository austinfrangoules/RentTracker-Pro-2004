import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import InventoryTable from '../components/InventoryTable';
import InventoryModal from '../components/InventoryModal';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiFilter } = FiIcons;

const Inventory = () => {
  const { inventory } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const getStockStatus = (item) => {
    if (item.currentStock < item.minStock) return 'low';
    if (item.currentStock > item.maxStock * 0.8) return 'high';
    return 'medium';
  };

  const filteredInventory = inventory.filter(item => {
    if (filter === 'all') return true;
    return getStockStatus(item) === filter;
  });

  const lowStockCount = inventory.filter(item => getStockStatus(item) === 'low').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          {lowStockCount > 0 && (
            <p className="text-red-600 mt-1">
              {lowStockCount} item{lowStockCount > 1 ? 's' : ''} running low
            </p>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddItem}
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>Add Item</span>
        </motion.button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Stock Overview</h2>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Items</option>
              <option value="low">Low Stock</option>
              <option value="medium">Medium Stock</option>
              <option value="high">High Stock</option>
            </select>
          </div>
        </div>

        <InventoryTable
          inventory={filteredInventory}
          onEdit={handleEditItem}
        />
      </div>

      <InventoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
      />
    </div>
  );
};

export default Inventory;