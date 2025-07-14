```jsx
import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowUp, FiArrowDown, FiDollarSign } = FiIcons;

const KPIComparisonTable = ({ data, properties, selectedProperties, year }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'grossIncome',
    direction: 'desc'
  });

  const calculatePropertyKPIs = (propertyName) => {
    const propertyData = data.filter(d => 
      d.property === propertyName && 
      new Date(d.date).getFullYear() === year
    );

    const grossIncome = propertyData
      .filter(d => d.type === 'income')
      .reduce((sum, d) => sum + d.amount, 0);

    const totalExpenses = propertyData
      .filter(d => d.type === 'expense')
      .reduce((sum, d) => sum + d.amount, 0);

    const netIncome = grossIncome - totalExpenses;
    const rentPercentage = grossIncome ? (netIncome / grossIncome) * 100 : 0;

    // Calculate monthly averages
    const monthlyNet = netIncome / 12;

    return {
      property: propertyName,
      grossIncome,
      totalExpenses,
      netIncome,
      monthlyNet,
      rentPercentage
    };
  };

  const propertyKPIs = selectedProperties
    .map(property => calculatePropertyKPIs(property))
    .sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key] - b[sortConfig.key];
      }
      return b[sortConfig.key] - a[sortConfig.key];
    });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const SortIndicator = ({ column }) => {
    if (sortConfig.key !== column) return null;
    return (
      <SafeIcon
        icon={sortConfig.direction === 'asc' ? FiArrowUp : FiArrowDown}
        className="w-4 h-4 ml-1"
      />
    );
  };

  // Calculate portfolio totals
  const portfolioTotals = propertyKPIs.reduce((totals, kpi) => ({
    grossIncome: totals.grossIncome + kpi.grossIncome,
    totalExpenses: totals.totalExpenses + kpi.totalExpenses,
    netIncome: totals.netIncome + kpi.netIncome,
    monthlyNet: totals.monthlyNet + kpi.monthlyNet,
    rentPercentage: totals.rentPercentage + (kpi.rentPercentage / propertyKPIs.length)
  }), {
    grossIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    monthlyNet: 0,
    rentPercentage: 0
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('grossIncome')}
              >
                <div className="flex items-center">
                  Gross Income
                  <SortIndicator column="grossIncome" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('totalExpenses')}
              >
                <div className="flex items-center">
                  Total Expenses
                  <SortIndicator column="totalExpenses" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('monthlyNet')}
              >
                <div className="flex items-center">
                  Avg Monthly Net
                  <SortIndicator column="monthlyNet" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('netIncome')}
              >
                <div className="flex items-center">
                  YTD Net Income
                  <SortIndicator column="netIncome" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('rentPercentage')}
              >
                <div className="flex items-center">
                  Rent %
                  <SortIndicator column="rentPercentage" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {propertyKPIs.map((kpi) => (
              <tr key={kpi.property} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {kpi.property}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center text-green-600">
                    <SafeIcon icon={FiDollarSign} className="w-4 h-4 mr-1" />
                    {kpi.grossIncome.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center text-red-600">
                    <SafeIcon icon={FiDollarSign} className="w-4 h-4 mr-1" />
                    {kpi.totalExpenses.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <SafeIcon icon={FiDollarSign} className="w-4 h-4 mr-1" />
                    {kpi.monthlyNet.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <SafeIcon icon={FiDollarSign} className="w-4 h-4 mr-1" />
                    {kpi.netIncome.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`font-medium ${
                    kpi.rentPercentage >= 50 ? 'text-green-600' : 
                    kpi.rentPercentage >= 30 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {kpi.rentPercentage.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
            {/* Portfolio Totals Row */}
            <tr className="bg-gray-50 font-medium">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                Portfolio Total
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                <div className="flex items-center">
                  <SafeIcon icon={FiDollarSign} className="w-4 h-4 mr-1" />
                  {portfolioTotals.grossIncome.toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                <div className="flex items-center">
                  <SafeIcon icon={FiDollarSign} className="w-4 h-4 mr-1" />
                  {portfolioTotals.totalExpenses.toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex items-center">
                  <SafeIcon icon={FiDollarSign} className="w-4 h-4 mr-1" />
                  {portfolioTotals.monthlyNet.toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex items-center">
                  <SafeIcon icon={FiDollarSign} className="w-4 h-4 mr-1" />
                  {portfolioTotals.netIncome.toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className={`font-medium ${
                  portfolioTotals.rentPercentage >= 50 ? 'text-green-600' : 
                  portfolioTotals.rentPercentage >= 30 ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {portfolioTotals.rentPercentage.toFixed(1)}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KPIComparisonTable;
```