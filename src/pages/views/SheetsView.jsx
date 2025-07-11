import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import TransactionModal from '../../components/TransactionModal';
import FinancialSpreadsheetView from '../../components/FinancialSpreadsheetView';

const SheetsView = ({ year, propertyFilter }) => {
  const { transactions } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter transactions for current year and property
  const filteredTransactions = transactions.filter(t => {
    try {
      const transactionDate = new Date(t.date);
      if (isNaN(transactionDate.getTime())) {
        console.warn("Invalid date in transaction:", t);
        return false;
      }
      const transactionYear = transactionDate.getFullYear();
      const propertyMatch = propertyFilter === 'all' || t.property === propertyFilter;
      return transactionYear === parseInt(year) && propertyMatch;
    } catch (error) {
      console.error("Error filtering transaction:", error);
      return false;
    }
  });

  return (
    <div className="h-full">
      <FinancialSpreadsheetView 
        transactions={filteredTransactions} 
        year={parseInt(year)} 
        propertyFilter={propertyFilter} 
      />
      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default SheetsView;