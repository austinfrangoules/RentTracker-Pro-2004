import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import ReceiptUpload from './ReceiptUpload';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiSearch, FiFilter, FiEdit2, FiTrash2, FiImage, FiExternalLink, FiTool } = FiIcons;

const PurchaseOrderManagement = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProperty, setFilterProperty] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const { properties, addTransaction } = useData();

  // Mock data - replace with actual data loading
  useEffect(() => {
    const mockOrders = [
      {
        id: 1,
        propertyName: 'Oceanview Apartment',
        itemName: 'Paint and Brushes',
        category: 'Maintenance',
        vendor: 'Home Depot',
        quantity: 1,
        unitPrice: 85.99,
        totalPrice: 85.99,
        purchaseDate: '2024-01-15',
        productUrl: 'https://homedepot.com/product/123',
        receiptUrl: null,
        notes: 'Touch-up paint for living room walls',
        tags: ['paint', 'maintenance', 'urgent'],
        addedToExpenses: false
      },
      {
        id: 2,
        propertyName: 'Mountain Cabin',
        itemName: 'Plumbing Supplies',
        category: 'Repairs',
        vendor: 'Lowes',
        quantity: 3,
        unitPrice: 45.50,
        totalPrice: 136.50,
        purchaseDate: '2024-01-12',
        productUrl: 'https://lowes.com/product/456',
        receiptUrl: '/receipts/receipt-2.jpg',
        notes: 'Emergency pipe repair supplies',
        tags: ['plumbing', 'emergency', 'repairs'],
        addedToExpenses: true
      }
    ];
    setPurchaseOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  // Filter orders based on search and filters
  useEffect(() => {
    let filtered = purchaseOrders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterProperty !== 'all') {
      filtered = filtered.filter(order => order.propertyName === filterProperty);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(order => order.category === filterCategory);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, filterProperty, filterCategory, purchaseOrders]);

  const handleAddToExpenses = (order) => {
    const transactionData = {
      date: order.purchaseDate,
      type: 'expense',
      category: order.category,
      amount: order.totalPrice,
      description: `${order.itemName} - ${order.vendor}`,
      property: order.propertyName,
      receiptUrl: order.receiptUrl,
      purchaseOrderId: order.id
    };

    addTransaction(transactionData);

    // Update the order to mark as added to expenses
    setPurchaseOrders(prev =>
      prev.map(po =>
        po.id === order.id ? { ...po, addedToExpenses: true } : po
      )
    );
  };

  const handleReceiptProcessed = (receiptData) => {
    // Process AI-analyzed receipt data
    const newOrder = {
      id: Date.now(),
      propertyName: 'Oceanview Apartment', // Default or selected property
      itemName: receiptData.vendor + ' Purchase',
      category: receiptData.category,
      vendor: receiptData.vendor,
      quantity: 1,
      unitPrice: receiptData.amount,
      totalPrice: receiptData.amount,
      purchaseDate: receiptData.date,
      productUrl: '',
      receiptUrl: receiptData.receipts[0],
      notes: 'Added via AI receipt processing',
      tags: ['ai-processed'],
      addedToExpenses: false
    };

    setPurchaseOrders(prev => [...prev, newOrder]);
  };

  const categories = ['Maintenance', 'Repairs', 'Supplies', 'Tools', 'Materials'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Purchase Orders & Receipts</h2>
          <p className="text-gray-600">Track maintenance and repair purchases</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsReceiptModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiImage} className="w-4 h-4" />
            <span>Upload Receipt</span>
          </button>
          <button
            onClick={() => {/* Open add purchase order modal */}}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Add Purchase Order</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search items, vendors, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Properties</option>
            {properties.map(property => (
              <option key={property.id} value={property.name}>{property.name}</option>
            ))}
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            <SafeIcon icon={FiFilter} className="w-4 h-4 mr-2" />
            {filteredOrders.length} of {purchaseOrders.length} orders
          </div>
        </div>
      </div>

      {/* Purchase Orders List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.itemName}</div>
                      <div className="text-sm text-gray-500">{order.notes}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {order.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.propertyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.category === 'Maintenance' ? 'bg-blue-100 text-blue-800' :
                      order.category === 'Repairs' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.vendor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.addedToExpenses ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Added to Expenses
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddToExpenses(order)}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      >
                        <SafeIcon icon={FiTool} className="w-3 h-3 mr-1" />
                        Add to Expenses
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      {order.receiptUrl && (
                        <button
                          onClick={() => window.open(order.receiptUrl, '_blank')}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Receipt"
                        >
                          <SafeIcon icon={FiImage} className="w-4 h-4" />
                        </button>
                      )}
                      {order.productUrl && (
                        <button
                          onClick={() => window.open(order.productUrl, '_blank')}
                          className="text-green-600 hover:text-green-800"
                          title="View Product"
                        >
                          <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {/* Handle delete */}}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <SafeIcon icon={FiTool} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No purchase orders found</h3>
            <p className="text-gray-500 mb-4">Start by uploading a receipt or adding a purchase order</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsReceiptModalOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Upload Receipt
              </button>
              <button
                onClick={() => {/* Open add modal */}}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Purchase Order
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Receipt Upload Modal */}
      <ReceiptUpload
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        onReceiptProcessed={handleReceiptProcessed}
        existingReceipts={purchaseOrders.filter(po => po.receiptUrl).map(po => po.receiptUrl)}
      />
    </div>
  );
};

export default PurchaseOrderManagement;