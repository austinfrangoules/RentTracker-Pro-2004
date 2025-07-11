import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPrinter, FiDownload } = FiIcons;

const ProfitLossReport = ({ transactions, year, propertyFilter }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [annualData, setAnnualData] = useState({
    incomeByCategory: {},
    expensesByCategory: {},
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0
  });

  useEffect(() => {
    try {
      // Filter transactions by year and property
      const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        if (isNaN(transactionDate.getTime())) {
          console.warn("Invalid date in transaction:", transaction);
          return false;
        }
        
        const transactionYear = transactionDate.getFullYear();
        const propertyMatch = propertyFilter === 'all' || transaction.property === propertyFilter;
        
        return transactionYear === year && propertyMatch;
      });

      // Initialize monthly data structure
      const months = [];
      for (let i = 0; i < 12; i++) {
        months.push({
          month: i,
          name: new Date(year, i, 1).toLocaleString('default', { month: 'long' }),
          income: 0,
          expenses: 0,
          net: 0,
          incomeByCategory: {},
          expensesByCategory: {}
        });
      }

      // Initialize annual data
      const annual = {
        incomeByCategory: {},
        expensesByCategory: {},
        totalIncome: 0,
        totalExpenses: 0,
        netIncome: 0
      };

      // Process transactions
      filteredTransactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        const month = transactionDate.getMonth();
        const { type, category, amount } = transaction;

        // Update monthly data
        if (type === 'income') {
          months[month].income += amount;
          months[month].incomeByCategory[category] = (months[month].incomeByCategory[category] || 0) + amount;
          
          // Update annual income
          annual.totalIncome += amount;
          annual.incomeByCategory[category] = (annual.incomeByCategory[category] || 0) + amount;
        } else {
          months[month].expenses += amount;
          months[month].expensesByCategory[category] = (months[month].expensesByCategory[category] || 0) + amount;
          
          // Update annual expenses
          annual.totalExpenses += amount;
          annual.expensesByCategory[category] = (annual.expensesByCategory[category] || 0) + amount;
        }
        
        // Calculate net
        months[month].net = months[month].income - months[month].expenses;
      });

      // Calculate annual net income
      annual.netIncome = annual.totalIncome - annual.totalExpenses;

      setMonthlyData(months);
      setAnnualData(annual);
    } catch (error) {
      console.error("Error processing profit/loss data:", error);
      setMonthlyData([]);
      setAnnualData({
        incomeByCategory: {},
        expensesByCategory: {},
        totalIncome: 0,
        totalExpenses: 0,
        netIncome: 0
      });
    }
  }, [transactions, year, propertyFilter]);

  // All possible income and expense categories from the data
  const incomeCategories = Object.keys(annualData.incomeByCategory).sort();
  const expenseCategories = Object.keys(annualData.expensesByCategory).sort();

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    try {
      // Basic CSV export
      let csv = 'Month,';
      
      // Add income categories
      incomeCategories.forEach(category => {
        csv += `${category} Income,`;
      });
      csv += 'Total Income,';
      
      // Add expense categories
      expenseCategories.forEach(category => {
        csv += `${category} Expense,`;
      });
      csv += 'Total Expenses,Net Income\n';
      
      // Add data for each month
      monthlyData.forEach(month => {
        csv += `${month.name},`;
        
        // Add income by category
        incomeCategories.forEach(category => {
          csv += `${month.incomeByCategory[category] || 0},`;
        });
        csv += `${month.income},`;
        
        // Add expenses by category
        expenseCategories.forEach(category => {
          csv += `${month.expensesByCategory[category] || 0},`;
        });
        csv += `${month.expenses},${month.net}\n`;
      });
      
      // Add annual totals
      csv += 'Annual,';
      incomeCategories.forEach(category => {
        csv += `${annualData.incomeByCategory[category]},`;
      });
      csv += `${annualData.totalIncome},`;
      expenseCategories.forEach(category => {
        csv += `${annualData.expensesByCategory[category]},`;
      });
      csv += `${annualData.totalExpenses},${annualData.netIncome}\n`;
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `profit_loss_${year}_${propertyFilter === 'all' ? 'all_properties' : propertyFilter}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export data. Please check console for details.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          {year} Profit & Loss {propertyFilter !== 'all' ? `- ${propertyFilter}` : ''}
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={handlePrint}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
          >
            <SafeIcon icon={FiPrinter} className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-700"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Show empty state if no data */}
      {incomeCategories.length === 0 && expenseCategories.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No financial data available for the selected year and property.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                  
                  {/* Income categories */}
                  <th className="px-4 py-3 text-left text-xs font-medium text-green-600 uppercase border-l" colSpan={incomeCategories.length + 1}>
                    Income
                  </th>
                  
                  {/* Expense categories */}
                  <th className="px-4 py-3 text-left text-xs font-medium text-red-600 uppercase border-l" colSpan={expenseCategories.length + 1}>
                    Expenses
                  </th>
                  
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-600 uppercase border-l">Net</th>
                </tr>
                
                <tr className="bg-gray-50 border-t border-gray-200">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500"></th>
                  
                  {/* Income category headers */}
                  {incomeCategories.map(category => (
                    <th key={`income-${category}`} className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-l">
                      {category}
                    </th>
                  ))}
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-l">Total</th>
                  
                  {/* Expense category headers */}
                  {expenseCategories.map(category => (
                    <th key={`expense-${category}`} className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-l">
                      {category}
                    </th>
                  ))}
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-l">Total</th>
                  
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-l"></th>
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Monthly rows */}
                {monthlyData.map(month => (
                  <tr key={month.month} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900 font-medium">{month.name}</td>
                    
                    {/* Income categories values */}
                    {incomeCategories.map(category => (
                      <td key={`${month.month}-income-${category}`} className="px-4 py-2 text-sm text-gray-700 border-l">
                        ${(month.incomeByCategory[category] || 0).toLocaleString()}
                      </td>
                    ))}
                    <td className="px-4 py-2 text-sm text-green-600 font-medium border-l">
                      ${month.income.toLocaleString()}
                    </td>
                    
                    {/* Expense categories values */}
                    {expenseCategories.map(category => (
                      <td key={`${month.month}-expense-${category}`} className="px-4 py-2 text-sm text-gray-700 border-l">
                        ${(month.expensesByCategory[category] || 0).toLocaleString()}
                      </td>
                    ))}
                    <td className="px-4 py-2 text-sm text-red-600 font-medium border-l">
                      ${month.expenses.toLocaleString()}
                    </td>
                    
                    {/* Net */}
                    <td className={`px-4 py-2 text-sm font-medium border-l ${month.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${month.net.toLocaleString()}
                    </td>
                  </tr>
                ))}
                
                {/* Annual totals */}
                <tr className="bg-gray-50 font-medium">
                  <td className="px-4 py-3 text-sm text-gray-900">Annual Total</td>
                  
                  {/* Income category totals */}
                  {incomeCategories.map(category => (
                    <td key={`annual-income-${category}`} className="px-4 py-3 text-sm text-gray-700 border-l">
                      ${(annualData.incomeByCategory[category] || 0).toLocaleString()}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-sm text-green-600 font-medium border-l">
                    ${annualData.totalIncome.toLocaleString()}
                  </td>
                  
                  {/* Expense category totals */}
                  {expenseCategories.map(category => (
                    <td key={`annual-expense-${category}`} className="px-4 py-3 text-sm text-gray-700 border-l">
                      ${(annualData.expensesByCategory[category] || 0).toLocaleString()}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-sm text-red-600 font-medium border-l">
                    ${annualData.totalExpenses.toLocaleString()}
                  </td>
                  
                  {/* Net annual */}
                  <td className={`px-4 py-3 text-sm font-medium border-l ${annualData.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${annualData.netIncome.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Income vs Expense Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gray-50 rounded-lg"
          >
            <h3 className="text-sm font-medium text-gray-700 mb-4">Annual Income & Expense Distribution</h3>
            
            {incomeCategories.length > 0 || expenseCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Income Distribution */}
                {incomeCategories.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-green-600 mb-2">Income Sources</h4>
                    <div className="space-y-2">
                      {incomeCategories.map(category => {
                        const amount = annualData.incomeByCategory[category] || 0;
                        const percentage = annualData.totalIncome ? (amount / annualData.totalIncome * 100).toFixed(1) : 0;
                        
                        return (
                          <div key={`income-dist-${category}`} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{category}</span>
                              <span>${amount.toLocaleString()} ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Expense Distribution */}
                {expenseCategories.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-red-600 mb-2">Expense Categories</h4>
                    <div className="space-y-2">
                      {expenseCategories.map(category => {
                        const amount = annualData.expensesByCategory[category] || 0;
                        const percentage = annualData.totalExpenses ? (amount / annualData.totalExpenses * 100).toFixed(1) : 0;
                        
                        return (
                          <div key={`expense-dist-${category}`} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{category}</span>
                              <span>${amount.toLocaleString()} ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500">No distribution data available</p>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ProfitLossReport;