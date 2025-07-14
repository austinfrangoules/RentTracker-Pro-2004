import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiAlertTriangle, FiPackage, FiShoppingCart } = FiIcons;

const InventoryAlerts = () => {
  const { inventory, shoppingList } = useData();
  const lowStockItems = inventory.filter(item => item.currentStock < item.minStock);
  const upcomingRestocks = inventory.filter(item => {
    const lastRestock = new Date(item.lastRestocked);
    const daysSinceRestock = (Date.now() - lastRestock.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceRestock > 25; // Items restocked more than 25 days ago
  });

  // Shopping list active items
  const activeShoppingItems = shoppingList ? shoppingList.filter(item => item.status === 'active') : [];
  const highPriorityShoppingItems = activeShoppingItems.filter(item => item.priority === 'high');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Inventory Alerts</h2>
      
      <div className="space-y-4">
        {lowStockItems.length > 0 && (
          <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-red-600" />
              <h3 className="font-medium text-red-800">Low Stock Items</h3>
            </div>
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-red-700">{item.name}</span>
                  <span className="text-red-600 font-medium">
                    {item.currentStock} / {item.minStock}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-red-200">
              <Link 
                to="/inventory" 
                className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center"
              >
                <SafeIcon icon={FiShoppingCart} className="w-4 h-4 mr-1" />
                Add to shopping list
              </Link>
            </div>
          </div>
        )}

        {highPriorityShoppingItems.length > 0 && (
          <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiShoppingCart} className="w-5 h-5 text-orange-600" />
              <h3 className="font-medium text-orange-800">Shopping List - High Priority</h3>
            </div>
            <div className="space-y-2">
              {highPriorityShoppingItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <span className="text-orange-700">{item.name}</span>
                    {item.dueDate && (
                      <span className="ml-2 text-xs text-orange-600">
                        Due: {new Date(item.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <span className="text-orange-600 font-medium">
                    {item.quantity} {item.unit}
                  </span>
                </div>
              ))}
              {highPriorityShoppingItems.length > 3 && (
                <div className="text-xs text-orange-600">
                  +{highPriorityShoppingItems.length - 3} more items
                </div>
              )}
            </div>
            <div className="mt-3 pt-2 border-t border-orange-200">
              <Link 
                to="/inventory" 
                className="text-sm text-orange-600 hover:text-orange-800 font-medium"
              >
                View shopping list
              </Link>
            </div>
          </div>
        )}
        
        {upcomingRestocks.length > 0 && (
          <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiPackage} className="w-5 h-5 text-yellow-600" />
              <h3 className="font-medium text-yellow-800">Restock Soon</h3>
            </div>
            <div className="space-y-2">
              {upcomingRestocks.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-yellow-700">{item.name}</span>
                  <span className="text-yellow-600 font-medium">
                    {Math.floor((Date.now() - new Date(item.lastRestocked).getTime()) / (1000 * 60 * 60 * 24))} days ago
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {lowStockItems.length === 0 && upcomingRestocks.length === 0 && highPriorityShoppingItems.length === 0 && (
          <div className="text-center py-8">
            <div className="text-green-500 text-4xl mb-2">✓</div>
            <p className="text-gray-600">All inventory levels look good!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default InventoryAlerts;