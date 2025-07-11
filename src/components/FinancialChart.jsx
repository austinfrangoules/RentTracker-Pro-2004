import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBarChart2, FiTrendingUp } = FiIcons;

const FinancialChart = ({ transactions }) => {
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
            const valueColor = entry.dataKey === 'income' ? 'text-green-600' : 
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
                <Bar 
                  dataKey="income" 
                  name="Income" 
                  fill="#10b981" 
                />
                <Bar 
                  dataKey="expenses" 
                  name="Expenses" 
                  fill="#ef4444" 
                />
                <Bar 
                  dataKey="net" 
                  name="Net" 
                  fill="#3b82f6" 
                />
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

export default FinancialChart;