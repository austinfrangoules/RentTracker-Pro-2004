import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import TransactionModal from '../../components/TransactionModal';
import FinancialSpreadsheetView from '../../components/FinancialSpreadsheetView';

const SheetsView = ({ year, selectedProperties }) => {
  const { transactions } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter transactions for current year and selected properties
  const filteredTransactions = transactions.filter(t => {
    try {
      const transactionDate = new Date(t.date);
      if (isNaN(transactionDate.getTime())) {
        console.warn("Invalid date in transaction:", t);
        return false;
      }
      
      const transactionYear = transactionDate.getFullYear();
      const propertyMatch = selectedProperties.includes(t.property);
      
      return transactionYear === parseInt(year) && propertyMatch;
    } catch (error) {
      console.error("Error filtering transaction:", error);
      return false;
    }
  });

  // Determine property filter for spreadsheet view
  const getPropertyFilter = () => {
    if (selectedProperties.length === 0) {
      return 'none';
    } else if (selectedProperties.length === 1) {
      return selectedProperties[0];
    } else {
      return 'multiple';
    }
  };

  return (
    <div className="h-full">
      <FinancialSpreadsheetView 
        transactions={filteredTransactions} 
        year={parseInt(year)} 
        propertyFilter={getPropertyFilter()}
        selectedProperties={selectedProperties}
      />
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default SheetsView;