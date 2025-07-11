import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowUpRight, FiArrowDownRight } = FiIcons;

const RecentTransactions = () => {
  const { transactions } = useData();
  const recentTransactions = transactions.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Transactions</h2>
      
      <div className="space-y-4">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <SafeIcon 
                  icon={transaction.type === 'income' ? FiArrowUpRight : FiArrowDownRight}
                  className={`w-5 h-5 ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{transaction.description}</h3>
                <p className="text-sm text-gray-600">{transaction.category} • {transaction.property}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentTransactions;