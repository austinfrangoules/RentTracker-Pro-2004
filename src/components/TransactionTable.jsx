import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit2, FiTrash2, FiArrowUpRight, FiArrowDownRight } = FiIcons;

const TransactionTable = ({ transactions, onEdit }) => {
  const { deleteTransaction } = useData();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Property</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction) => (
            <motion.tr
              key={transaction.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-3 px-4 text-gray-600">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={transaction.type === 'income' ? FiArrowUpRight : FiArrowDownRight} className={`w-4 h-4 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`} />
                  <span className={`capitalize ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-800">{transaction.description}</td>
              <td className="py-3 px-4 text-gray-600">{transaction.category}</td>
              <td className="py-3 px-4 text-gray-600">{transaction.property}</td>
              <td className="py-3 px-4">
                <span className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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
  );
};

export default TransactionTable;