import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiCheckCircle,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiMoreVertical,
  FiCalendar,
  FiMapPin
} = FiIcons;

const ShoppingList = ({ items, onEdit }) => {
  const { archiveShoppingItem, deleteShoppingItem } = useData();
  const [menuOpen, setMenuOpen] = useState(null);

  const handleMarkAsPurchased = (id) => {
    archiveShoppingItem(id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteShoppingItem(id);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                  {item.priority} priority
                </span>
              </div>
              
              <p className="text-gray-600 mb-2">
                Quantity: {item.quantity} {item.unit}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {item.properties.map((property, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                  >
                    <SafeIcon icon={FiMapPin} className="w-3 h-3 mr-1" />
                    {property}
                  </span>
                ))}
              </div>

              {item.dueDate && (
                <div className="text-sm text-gray-500 mb-2">
                  <SafeIcon icon={FiCalendar} className="w-4 h-4 inline mr-1" />
                  Due: {new Date(item.dueDate).toLocaleDateString()}
                </div>
              )}

              {item.notes && (
                <p className="text-sm text-gray-600 mb-3">{item.notes}</p>
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
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleMarkAsPurchased(item.id)}
                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                title="Mark as purchased"
              >
                <SafeIcon icon={FiCheckCircle} className="w-5 h-5" />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(menuOpen === item.id ? null : item.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <SafeIcon icon={FiMoreVertical} className="w-4 h-4" />
                </button>
                
                <AnimatePresence>
                  {menuOpen === item.id && (
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
                            setMenuOpen(null);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <SafeIcon icon={FiEdit2} className="w-4 h-4 inline mr-2" />
                          Edit Item
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(item.id);
                            setMenuOpen(null);
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
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ShoppingList;