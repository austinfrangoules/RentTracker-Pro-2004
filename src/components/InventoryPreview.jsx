import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiPackage, 
  FiAlertTriangle, 
  FiArrowRight, 
  FiClock,
  FiCheckCircle
} = FiIcons;

const InventoryPreview = ({ inventory, propertyName }) => {
  // Filter inventory for this property
  const propertyInventory = inventory.filter(item => item.property === propertyName);
  
  // Get low stock items
  const lowStockItems = propertyInventory.filter(item => item.currentStock < item.minStock);
  
  // Get recently restocked items (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentlyRestocked = propertyInventory
    .filter(item => {
      const restockDate = new Date(item.lastRestocked);
      return restockDate > thirtyDaysAgo;
    })
    .sort((a, b) => new Date(b.lastRestocked) - new Date(a.lastRestocked))
    .slice(0, 3); // Show only last 3 items

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-800">Inventory Status</h3>
        <Link
          to={`/inventory?property=${encodeURIComponent(propertyName)}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          View Full Inventory
          <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className={`rounded-lg p-4 ${
          lowStockItems.length > 0 ? 'bg-red-50' : 'bg-green-50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              lowStockItems.length > 0 ? 'bg-red-100' : 'bg-green-100'
            }`}>
              <SafeIcon 
                icon={lowStockItems.length > 0 ? FiAlertTriangle : FiCheckCircle} 
                className={`w-5 h-5 ${
                  lowStockItems.length > 0 ? 'text-red-600' : 'text-green-600'
                }`} 
              />
            </div>
            <div>
              <h4 className={`font-medium ${
                lowStockItems.length > 0 ? 'text-red-800' : 'text-green-800'
              }`}>
                {lowStockItems.length > 0 ? 'Low Stock Alert' : 'Stock Levels Good'}
              </h4>
              <p className={
                lowStockItems.length > 0 ? 'text-red-600' : 'text-green-600'
              }>
                {lowStockItems.length > 0 
                  ? `${lowStockItems.length} item${lowStockItems.length !== 1 ? 's' : ''} below minimum`
                  : 'All items above minimum levels'
                }
              </p>
            </div>
          </div>
          
          {lowStockItems.length > 0 && (
            <div className="mt-3 space-y-2">
              {lowStockItems.slice(0, 3).map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-red-700">{item.name}</span>
                  <span className="text-red-600 font-medium">
                    {item.currentStock} / {item.minStock}
                  </span>
                </div>
              ))}
              {lowStockItems.length > 3 && (
                <div className="text-sm text-red-600">
                  +{lowStockItems.length - 3} more items
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recently Restocked */}
        <div className="rounded-lg p-4 bg-blue-50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <SafeIcon icon={FiClock} className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-800">Recently Restocked</h4>
              <p className="text-blue-600">
                {recentlyRestocked.length > 0 
                  ? `${recentlyRestocked.length} item${recentlyRestocked.length !== 1 ? 's' : ''} in last 30 days`
                  : 'No recent restocks'
                }
              </p>
            </div>
          </div>

          {recentlyRestocked.length > 0 ? (
            <div className="space-y-2">
              {recentlyRestocked.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-blue-700">{item.name}</span>
                  <span className="text-blue-600">
                    {new Date(item.lastRestocked).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-blue-600">
              No items have been restocked in the last 30 days
            </p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-sm text-gray-600">Total Items</p>
          <p className="text-xl font-bold text-gray-800">{propertyInventory.length}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-sm text-gray-600">Categories</p>
          <p className="text-xl font-bold text-gray-800">
            {new Set(propertyInventory.map(item => item.category)).size}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-sm text-gray-600">Total Value</p>
          <p className="text-xl font-bold text-gray-800">
            ${propertyInventory.reduce((sum, item) => 
              sum + (item.currentStock * item.unitCost), 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InventoryPreview;