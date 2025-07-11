import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit2, FiExternalLink, FiArrowUp, FiArrowDown } = FiIcons;

const FinancialDetailTable = ({ transactions }) => {
  const [groupedData, setGroupedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });

  useEffect(() => {
    try {
      // Group transactions by month and category
      const grouped = {};

      transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        if (isNaN(date.getTime())) {
          console.warn("Invalid date in transaction:", transaction);
          return; // Skip this transaction
        }
        
        const year = date.getFullYear();
        const month = date.getMonth();
        const monthYearKey = `${year}-${month.toString().padStart(2, '0')}`;
        
        if (!grouped[monthYearKey]) {
          grouped[monthYearKey] = {
            monthYear: monthYearKey,
            date: new Date(year, month, 1),
            displayDate: new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            categories: {},
            totalIncome: 0,
            totalExpense: 0
          };
        }

        // Group by category
        const category = transaction.category || 'Uncategorized';
        if (!grouped[monthYearKey].categories[category]) {
          grouped[monthYearKey].categories[category] = {
            items: [],
            total: 0,
            type: transaction.type
          };
        }

        grouped[monthYearKey].categories[category].items.push(transaction);
        grouped[monthYearKey].categories[category].total += transaction.amount;

        // Update monthly totals
        if (transaction.type === 'income') {
          grouped[monthYearKey].totalIncome += transaction.amount;
        } else {
          grouped[monthYearKey].totalExpense += transaction.amount;
        }
      });

      // Convert to array and sort
      let dataArray = Object.values(grouped);
      
      // Sort data
      dataArray = sortData(dataArray, sortConfig.key, sortConfig.direction);
      
      setGroupedData(dataArray);
    } catch (error) {
      console.error("Error grouping financial data:", error);
      setGroupedData([]);
    }
  }, [transactions, sortConfig]);

  const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      try {
        if (key === 'date') {
          return direction === 'asc' 
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date);
        }
        if (key === 'totalIncome') {
          return direction === 'asc'
            ? a.totalIncome - b.totalIncome
            : b.totalIncome - a.totalIncome;
        }
        if (key === 'totalExpense') {
          return direction === 'asc'
            ? a.totalExpense - b.totalExpense
            : b.totalExpense - a.totalExpense;
        }
        if (key === 'netIncome') {
          const aNet = a.totalIncome - a.totalExpense;
          const bNet = b.totalIncome - b.totalExpense;
          return direction === 'asc' ? aNet - bNet : bNet - aNet;
        }
        return 0;
      } catch (error) {
        console.error("Error sorting data:", error);
        return 0;
      }
    });
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <FiArrowUp className="w-4 h-4" /> : <FiArrowDown className="w-4 h-4" />;
  };

  // If no data, show message
  if (groupedData.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">No financial data available for the selected filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('date')}
            >
              <div className="flex items-center space-x-1">
                <span>Month/Year</span>
                {getSortIcon('date')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('totalIncome')}
            >
              <div className="flex items-center space-x-1">
                <span>Income</span>
                {getSortIcon('totalIncome')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('totalExpense')}
            >
              <div className="flex items-center space-x-1">
                <span>Expenses</span>
                {getSortIcon('totalExpense')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('netIncome')}
            >
              <div className="flex items-center space-x-1">
                <span>Net</span>
                {getSortIcon('netIncome')}
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {groupedData.map((month) => (
            <React.Fragment key={month.monthYear}>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {month.displayDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                  ${month.totalIncome.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                  ${month.totalExpense.toLocaleString()}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${(month.totalIncome - month.totalExpense) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${(month.totalIncome - month.totalExpense).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-500 hover:text-blue-700">
                    <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              
              {/* Category rows - nested beneath each month */}
              {Object.entries(month.categories).map(([category, data]) => (
                <tr key={`${month.monthYear}-${category}`} className="hover:bg-gray-50">
                  <td className="pl-10 pr-6 py-3 whitespace-nowrap text-sm text-gray-700">
                    {category}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm">
                    {data.type === 'income' && <span className="text-green-600">${data.total.toLocaleString()}</span>}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm">
                    {data.type === 'expense' && <span className="text-red-600">${data.total.toLocaleString()}</span>}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm"></td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-xs text-gray-500">
                      {data.items.length} transaction{data.items.length !== 1 ? 's' : ''}
                    </span>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialDetailTable;