```jsx
import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPieChart, FiBarChart2 } = FiIcons;

const IncomeSourceBreakdown = ({ data, selectedProperties, year }) => {
  const [viewType, setViewType] = useState('pie');
  const [timeframe, setTimeframe] = useState('yearly');

  const platforms = ['Airbnb', 'VRBO', 'Booking.com', 'Direct', 'Other'];
  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];

  const processData = () => {
    if (timeframe === 'yearly') {
      // Aggregate yearly data by platform
      const platformData = platforms.map(platform => {
        const total = data
          .filter(d => 
            new Date(d.date).getFullYear() === year &&
            selectedProperties.includes(d.property) &&
            d.platform === platform &&
            d.type === 'income'
          )
          .reduce((sum, d) => sum + d.amount, 0);

        return {
          name: platform,
          value: total
        };
      });

      return platformData.filter(d => d.value > 0);
    } else {
      // Monthly breakdown by platform
      const monthlyData = [];
      for (let i = 0; i < 12; i++) {
        const monthData = {
          month: new Date(2000, i).toLocaleString('default', { month: 'short' })
        };

        platforms.forEach(platform => {
          monthData[platform] = data
            .filter(d => 
              new Date(d.date).getFullYear() === year &&
              new Date(d.date).getMonth() === i &&
              selectedProperties.includes(d.property) &&
              d.platform === platform &&
              d.type === 'income'
            )
            .reduce((sum, d) => sum + d.amount, 0);
        });

        monthlyData.push(monthData);
      }

      return monthlyData;
    }
  };

  const chartData = processData();
  const total = timeframe === 'yearly' 
    ? chartData.reduce((sum, d) => sum + d.value, 0)
    : chartData.reduce((sum, month) => 
        sum + platforms.reduce((platformSum, platform) => 
          platformSum + (month[platform] || 0), 0), 0);

  const renderPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-medium text-gray-800">{data.name}</p>
          <p className="text-gray-600">${data.value.toLocaleString()}</p>
          <p className="text-sm text-gray-500">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800">
            Income Source Breakdown
          </h3>
          <p className="text-sm text-gray-500">
            Total Revenue: ${total.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewType('pie')}
              className={`px-3 py-1 rounded-lg text-sm flex items-center space-x-1 ${
                viewType === 'pie' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
              }`}
            >
              <SafeIcon icon={FiPieChart} className="w-4 h-4" />
              <span>Pie</span>
            </button>
            <button
              onClick={() => setViewType('bar')}
              className={`px-3 py-1 rounded-lg text-sm flex items-center space-x-1 ${
                viewType === 'bar' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
              }`}
            >
              <SafeIcon icon={FiBarChart2} className="w-4 h-4" />
              <span>Trend</span>
            </button>
          </div>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="yearly">Yearly Total</option>
            <option value="monthly">Monthly Breakdown</option>
          </select>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {viewType === 'pie' && timeframe === 'yearly' ? (
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={renderPieTooltip} />
              <Legend />
            </PieChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={timeframe === 'yearly' ? 'name' : 'month'} 
                tick={{ fontSize: 12 }} 
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip />
              <Legend />
              {timeframe === 'monthly' && platforms.map((platform, index) => (
                <Bar
                  key={platform}
                  dataKey={platform}
                  stackId="a"
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
              {timeframe === 'yearly' && (
                <Bar dataKey="value" fill="#3B82F6" />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeSourceBreakdown;
```