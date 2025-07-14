import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiBarChart2, FiTrendingUp, FiArrowUpRight, FiArrowDownRight, FiDollarSign,
  FiCalendar, FiFilter, FiPrinter, FiDownload, FiEdit2, FiTrash2
} = FiIcons;

export const FinancialChart = ({ transactions }) => {
  const [chartType, setChartType] = useState('bar');
  
  // Add error handling for empty transactions
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">No transaction data available.</p>
      </div>
    );
  }

  // Group transactions by date and calculate daily income/expenses
  const groupTransactionsByDate = () => {
    try {
      const grouped = transactions.reduce((acc, transaction) => {
        const date = transaction.date;
        if (!acc[date]) {
          acc[date] = { date, income: 0, expenses: 0, net: 0 };
        }
        
        if (transaction.type === 'income') {
          acc[date].income += transaction.amount;
        } else {
          acc[date].expenses += transaction.amount;
        }
        
        acc[date].net = acc[date].income - acc[date].expenses;
        return acc;
      }, {});
      
      return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
      console.error("Error in groupTransactionsByDate:", error);
      return [];
    }
  };

  // Group transactions by month with error handling
  const groupTransactionsByMonth = () => {
    try {
      const grouped = transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.date);
        if (isNaN(date.getTime())) {
          console.warn("Invalid date in transaction:", transaction);
          return acc;
        }
        
        const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (!acc[monthYear]) {
          acc[monthYear] = {
            monthYear,
            month: date.toLocaleString('default', { month: 'short' }),
            year: date.getFullYear(),
            income: 0,
            expenses: 0,
            net: 0
          };
        }
        
        if (transaction.type === 'income') {
          acc[monthYear].income += transaction.amount;
        } else {
          acc[monthYear].expenses += transaction.amount;
        }
        
        acc[monthYear].net = acc[monthYear].income - acc[monthYear].expenses;
        return acc;
      }, {});
      
      return Object.values(grouped).sort((a, b) => {
        const [aYear, aMonth] = a.monthYear.split('-').map(Number);
        const [bYear, bMonth] = b.monthYear.split('-').map(Number);
        return aYear === bYear ? aMonth - bMonth : aYear - bYear;
      });
    } catch (error) {
      console.error("Error in groupTransactionsByMonth:", error);
      return [];
    }
  };

  const dailyData = groupTransactionsByDate();
  const monthlyData = groupTransactionsByMonth();
  
  // Use monthly data for better visualization if we have enough data
  const chartData = monthlyData.length > 1 ? monthlyData : dailyData;
  const xAxisKey = monthlyData.length > 1 ? 'month' : 'date';

  // Format for tooltip
  const formatTooltipValue = (value) => {
    return `$${value.toLocaleString()}`;
  };

  const renderTooltip = (props) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-lg border border-gray-200">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => {
            const valueColor = 
              entry.dataKey === 'income' ? 'text-green-600' : 
              entry.dataKey === 'expenses' ? 'text-red-600' : 'text-blue-600';
            return (
              <p key={`value-${index}`} className={valueColor}>
                {entry.name}: {formatTooltipValue(entry.value)}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setChartType('bar')}
          className={`px-3 py-1 rounded-lg text-sm flex items-center space-x-1 ${
            chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          <SafeIcon icon={FiBarChart2} className="w-4 h-4" />
          <span>Bar</span>
        </button>
        <button
          onClick={() => setChartType('line')}
          className={`px-3 py-1 rounded-lg text-sm flex items-center space-x-1 ${
            chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          <SafeIcon icon={FiTrendingUp} className="w-4 h-4" />
          <span>Line</span>
        </button>
      </div>
      <div className="h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={xAxisKey} 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    if (xAxisKey === 'date') {
                      return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }
                    return value;
                  }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={renderTooltip} />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#10b981" />
                <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
                <Bar dataKey="net" name="Net" fill="#3b82f6" />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={xAxisKey} 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    if (xAxisKey === 'date') {
                      return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }
                    return value;
                  }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={renderTooltip} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  name="Income" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  name="Expenses" 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="net" 
                  name="Net" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">No data available for the chart</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const FinancialSpreadsheet = ({ transactions, onAddTransaction, onEditTransaction }) => {
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
            <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
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
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
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
                    <button className="p-1 text-red-600 hover:bg-red-100 rounded-lg">
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
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

export const PropertyComparisonChart = ({ transactions, properties, year }) => {
  const [chartType, setChartType] = useState('bar');
  const [metricType, setMetricType] = useState('revenue');
  const [propertyData, setPropertyData] = useState([]);
  const [categoryData, setCategoryData] = useState({ income: [], expense: [] });

  useEffect(() => {
    if (!properties || properties.length === 0) return;
    
    try {
      // Filter transactions by year
      const yearTransactions = year === 'all' ? transactions : transactions.filter(t => {
        const date = new Date(t.date);
        return !isNaN(date.getTime()) && date.getFullYear() === year;
      });

      // Process data for each property
      const data = properties.map(property => {
        const propertyTransactions = yearTransactions.filter(t => t.property === property.name);
        
        const income = propertyTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
          
        const expenses = propertyTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
          
        const net = income - expenses;

        // Group income by category
        const incomeByCategory = {};
        propertyTransactions
          .filter(t => t.type === 'income')
          .forEach(t => {
            incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
          });

        // Group expenses by category
        const expensesByCategory = {};
        propertyTransactions
          .filter(t => t.type === 'expense')
          .forEach(t => {
            expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
          });

        return {
          name: property.name,
          id: property.id,
          income,
          expenses,
          net,
          occupancyRate: property.occupancyRate || 0,
          incomeByCategory,
          expensesByCategory
        };
      });

      // Sort data by selected metric
      const sortedData = [...data].sort((a, b) => {
        if (metricType === 'revenue') return b.income - a.income;
        if (metricType === 'expenses') return b.expenses - a.expenses;
        if (metricType === 'profit') return b.net - a.net;
        if (metricType === 'occupancy') return b.occupancyRate - a.occupancyRate;
        return 0;
      });

      setPropertyData(sortedData);

      // Process category data for all properties combined
      const allCategories = { income: {}, expense: {} };
      
      // Collect all categories
      sortedData.forEach(property => {
        // Income categories
        Object.entries(property.incomeByCategory).forEach(([category, amount]) => {
          allCategories.income[category] = (allCategories.income[category] || 0) + amount;
        });
        
        // Expense categories
        Object.entries(property.expensesByCategory).forEach(([category, amount]) => {
          allCategories.expense[category] = (allCategories.expense[category] || 0) + amount;
        });
      });

      // Convert to array format for charts
      const incomeCategories = Object.entries(allCategories.income).map(([name, value]) => ({
        name,
        value,
        type: 'income'
      }));
      
      const expenseCategories = Object.entries(allCategories.expense).map(([name, value]) => ({
        name,
        value,
        type: 'expense'
      }));

      setCategoryData({
        income: incomeCategories.sort((a, b) => b.value - a.value),
        expense: expenseCategories.sort((a, b) => b.value - a.value)
      });
    } catch (error) {
      console.error("Error processing property comparison data:", error);
      setPropertyData([]);
      setCategoryData({ income: [], expense: [] });
    }
  }, [transactions, properties, year, metricType]);

  const renderTooltip = (props) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-lg border border-gray-200">
          <p className="font-medium text-gray-900">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry, index) => {
              let color = 'text-blue-600';
              if (entry.dataKey === 'income' || entry.name === 'income') color = 'text-green-600';
              if (entry.dataKey === 'expenses' || entry.name === 'expense') color = 'text-red-600';
              if (entry.dataKey === 'occupancyRate') color = 'text-purple-600';
              return (
                <p key={index} className={color} style={{ color: entry.color }}>
                  {entry.dataKey === 'occupancyRate' ? 
                    `${entry.name}: ${entry.value}%` : 
                    `${entry.name}: $${entry.value.toLocaleString()}`}
                </p>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderPieTooltip = (props) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 shadow-md rounded-lg border border-gray-200">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className={data.payload.type === 'income' ? 'text-green-600' : 'text-red-600'}>
            ${data.value.toLocaleString()} {' '}
            ({((data.value / data.payload.total) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // No properties selected
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">Please select properties to compare.</p>
      </div>
    );
  }

  // No data available
  if (propertyData.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">No data available for the selected properties.</p>
      </div>
    );
  }

  // Calculate totals for pie charts
  const totalIncome = categoryData.income.reduce((sum, item) => sum + item.value, 0);
  const totalExpenses = categoryData.expense.reduce((sum, item) => sum + item.value, 0);

  // Add total to each category item for percentage calculation
  categoryData.income.forEach(item => item.total = totalIncome);
  categoryData.expense.forEach(item => item.total = totalExpenses);

  // Colors for pie charts
  const INCOME_COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];
  const EXPENSE_COLORS = ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'];
  const COLORS = {
    income: INCOME_COLORS,
    expenses: EXPENSE_COLORS,
    net: '#3b82f6',
    occupancyRate: '#8b5cf6'
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 text-sm rounded-lg flex items-center space-x-1 ${
              chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <SafeIcon icon={FiBarChart2} className="w-4 h-4" />
            <span>Bar Chart</span>
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`px-3 py-1 text-sm rounded-lg flex items-center space-x-1 ${
              chartType === 'pie' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <SafeIcon icon={FiIcons.FiPieChart} className="w-4 h-4" />
            <span>Category Breakdown</span>
          </button>
        </div>
        {chartType === 'bar' && (
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Compare by:</label>
            <select
              value={metricType}
              onChange={(e) => setMetricType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="revenue">Revenue</option>
              <option value="expenses">Expenses</option>
              <option value="profit">Net Profit</option>
              <option value="occupancy">Occupancy Rate</option>
            </select>
          </div>
        )}
      </div>

      {/* Property Comparison Bar Chart */}
      {chartType === 'bar' && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Property Comparison {year !== 'all' ? `(${year})` : ''}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={propertyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 12)}...` : value}
                />
                <YAxis />
                <Tooltip content={renderTooltip} />
                <Legend />
                {metricType === 'revenue' && (
                  <Bar dataKey="income" name="Revenue" fill={COLORS.income[0]} />
                )}
                {metricType === 'expenses' && (
                  <Bar dataKey="expenses" name="Expenses" fill={COLORS.expenses[0]} />
                )}
                {metricType === 'profit' && (
                  <Bar dataKey="net" name="Net Profit" fill={COLORS.net} />
                )}
                {metricType === 'occupancy' && (
                  <Bar dataKey="occupancyRate" name="Occupancy %" fill={COLORS.occupancyRate} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Category Breakdown Pie Charts */}
      {chartType === 'pie' && categoryData.income.length > 0 && categoryData.expense.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Income Categories */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Income Sources {year !== 'all' ? `(${year})` : ''}
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData.income}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {categoryData.income.map((entry, index) => (
                      <Cell 
                        key={`cell-income-${index}`} 
                        fill={INCOME_COLORS[index % INCOME_COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={renderPieTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <p className="text-center font-medium text-green-600">
                Total Income: ${totalIncome.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Expense Categories */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Expense Categories {year !== 'all' ? `(${year})` : ''}
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData.expense}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {categoryData.expense.map((entry, index) => (
                      <Cell 
                        key={`cell-expense-${index}`} 
                        fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={renderPieTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <p className="text-center font-medium text-red-600">
                Total Expenses: ${totalExpenses.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Property Data Table */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Property Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit Margin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {propertyData.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{property.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">${property.income.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">${property.expenses.toLocaleString()}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${property.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${property.net.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {property.income > 0 ? `${((property.net / property.income) * 100).toFixed(1)}%` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">
                    {property.occupancyRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};