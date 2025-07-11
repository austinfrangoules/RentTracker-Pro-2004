import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiEdit2, FiTrash2, FiDollarSign, FiCalendar, FiFilter, FiDownload } = FiIcons;

const FinancialSpreadsheet = ({ transactions, onAddTransaction, onEditTransaction }) => {
  const [groupedTransactions, setGroupedTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const { properties } = useData();

  useEffect(() => {
    organizeTransactions();
  }, [transactions, filter, propertyFilter, dateRange]);

  const organizeTransactions = () => {
    let filteredData = [...transactions];

    // Apply property filter
    if (propertyFilter !== 'all') {
      filteredData = filteredData.filter(t => t.property === propertyFilter);
    }

    // Apply type filter
    if (filter !== 'all') {
      filteredData = filteredData.filter(t => t.type === filter);
    }

    // Apply date range filter
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      filteredData = filteredData.filter(t => new Date(t.date) >= fromDate);
    }
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      filteredData = filteredData.filter(t => new Date(t.date) <= toDate);
    }

    // Sort by date (newest first)
    filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));

    setGroupedTransactions(filteredData);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getTypeClass = (type) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  const totalIncome = groupedTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = groupedTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netAmount = totalIncome - totalExpenses;

  const handleExportCSV = () => {
    // Create CSV content
    let csvContent = "Date,Type,Category,Description,Property,Amount\n";
    
    groupedTransactions.forEach(t => {
      const row = [
        t.date,
        t.type,
        t.category,
        `"${t.description.replace(/"/g, '""')}"`,
        t.property,
        t.amount
      ].join(',');
      csvContent += row + '\n';
    });

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'financial_transactions.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 md:mb-0">Financial Transactions</h2>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onAddTransaction}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-1"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
          
          <button
            onClick={handleExportCSV}
            className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-1"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600">Net Amount</p>
              <p className={`text-xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${netAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600">Total Income</p>
              <p className="text-xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-100 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-red-600">Total Expenses</p>
              <p className="text-xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Transaction Count</p>
              <p className="text-xl font-bold text-gray-700">{groupedTransactions.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiFilter} className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiFilter} className="w-4 h-4 text-gray-500" />
          <select
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Properties</option>
            {properties.map((property) => (
              <option key={property.id} value={property.name}>{property.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiCalendar} className="w-4 h-4 text-gray-500" />
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="From Date"
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="To Date"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {groupedTransactions.map((transaction) => (
              <motion.tr 
                key={transaction.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                  {transaction.category}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">
                  {transaction.description}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                  {transaction.property}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={getTypeClass(transaction.type)}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => onEditTransaction(transaction)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg"
                    >
                      <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-1 text-red-600 hover:bg-red-100 rounded-lg"
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
      
      {groupedTransactions.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No transactions found with the selected filters.</p>
          <button 
            onClick={onAddTransaction}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Add Your First Transaction
          </button>
        </div>
      )}
    </div>
  );
};

export default FinancialSpreadsheet;