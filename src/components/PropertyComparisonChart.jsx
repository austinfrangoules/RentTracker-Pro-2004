import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPieChart, FiBarChart2 } = FiIcons;

const PropertyComparisonChart = ({ transactions, properties, year }) => {
  const [chartType, setChartType] = useState('bar');
  const [metricType, setMetricType] = useState('revenue');
  const [propertyData, setPropertyData] = useState([]);
  const [categoryData, setCategoryData] = useState({
    income: [],
    expense: []
  });

  useEffect(() => {
    if (!properties || properties.length === 0) return;

    try {
      // Filter transactions by year
      const yearTransactions = year === 'all' 
        ? transactions 
        : transactions.filter(t => {
            const date = new Date(t.date);
            return !isNaN(date.getTime()) && date.getFullYear() === year;
          });

      // Process data for each property
      const data = properties.map(property => {
        const propertyTransactions = yearTransactions.filter(t => 
          t.property === property.name
        );

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
      const allCategories = {
        income: {},
        expense: {}
      };

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
            ${data.value.toLocaleString()}
            {' '}
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
            <SafeIcon icon={FiPieChart} className="w-4 h-4" />
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
              <BarChart data={propertyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                    {property.income > 0 ? 
                      `${((property.net / property.income) * 100).toFixed(1)}%` : 
                      'N/A'}
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

export default PropertyComparisonChart;