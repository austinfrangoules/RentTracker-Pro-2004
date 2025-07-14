import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiMoreVertical,
  FiMapPin,
  FiDollarSign,
  FiPackage
} = FiIcons;

const InventoryTable = ({ items, onEdit }) => {
  const { deleteInventoryItem } = useData();
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteInventoryItem(id);
    }
  };

  const getStockStatus = (item) => {
    if (item.currentStock < item.minStock) {
      return { status: 'Low', color: 'text-red-600', bg: 'bg-red-100' };
    } else if (item.currentStock > item.maxStock * 0.8) {
      return { status: 'High', color: 'text-green-600', bg: 'bg-green-100' };
    } else {
      return { status: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => {
              const stockStatus = getStockStatus(item);
              return (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                        <SafeIcon icon={FiPackage} className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        {item.location && (
                          <div className="text-xs text-gray-500 flex items-center">
                            <SafeIcon icon={FiMapPin} className="w-3 h-3 mr-1" />
                            {item.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.property}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900">
                        {item.currentStock} / {item.minStock}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus.bg} ${stockStatus.color}`}>
                        {stockStatus.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <SafeIcon icon={FiDollarSign} className="w-4 h-4 mr-1 text-gray-400" />
                      {(item.currentStock * item.unitCost).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="relative">
                      <button
                        onClick={() => setActionMenuOpen(actionMenuOpen === item.id ? null : item.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <SafeIcon icon={FiMoreVertical} className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {actionMenuOpen === item.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                          >
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  onEdit(item);
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
                                  handleDelete(item.id);
                                  setActionMenuOpen(null);
                                }}
                                className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                              >
                                <SafeIcon icon={FiTrash2} className="w-4 h-4 inline mr-2" />
                                Delete
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;