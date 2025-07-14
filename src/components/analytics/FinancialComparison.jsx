```jsx
import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBarChart2, FiTrendingUp } = FiIcons;

const FinancialComparison = ({ data, years, properties, selectedProperties }) => {
  const [chartType, setChartType] = useState('bar');
  const [comparisonType, setComparisonType] = useState('monthly');

  // Process data for visualization
  const processData = () => {
    if (comparisonType === 'monthly') {
      // Group by month for selected years and properties
      const monthlyData = [];
      for (let i = 0; i < 12; i++) {
        const monthData = {
          month: new Date(2000, i).toLocaleString('default', { month: 'short' })
        };
        
        years.forEach(year => {
          selectedProperties.forEach(property => {
            const key = `${property}_${year}`;
            monthData[key] = data
              .filter(d => new Date(d.date).getFullYear() === year 
                && new Date(d.date).getMonth() === i 
                && d.property === property)
              .reduce((sum, d) => sum + (d.type === 'income' ? d.amount : -d.amount), 0);
          });
        });
        monthlyData.push(monthData);
      }
      return monthlyData;
    } else {
      // Annual comparison
      return years.map(year => {
        const yearData = { year };
        selectedProperties.forEach(property => {
          yearData[`${property}_income`] = data
            .filter(d => new Date(d.date).getFullYear() === year 
              && d.property === property 
              && d.type === 'income')
            .reduce((sum, d) => sum + d.amount, 0);
          
          yearData[`${property}_expenses`] = data
            .filter(d => new Date(d.date).getFullYear() === year 
              && d.property === property 
              && d.type === 'expense')
            .reduce((sum, d) => sum + d.amount, 0);
          
          yearData[`${property}_net`] = yearData[`${property}_income`] - yearData[`${property}_expenses`];
        });
        return yearData;
      });
    }
  };

  const renderTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
          <p className="font-medium text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => {
              const [property, year] = entry.name.split('_');
              const value = entry.value;
              const prevYearValue = payload.find(p => 
                p.name === `${property}_${parseInt(year) - 1}`
              )?.value;
              
              const delta = prevYearValue ? value - prevYearValue : null;
              
              return (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">
                    {property} ({year}):
                  </span>
                  <div className="text-right">
                    <span className="font-medium">${value.toLocaleString()}</span>
                    {delta && (
                      <span className={`ml-2 text-xs ${delta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ({delta > 0 ? '+' : ''}{delta.toLocaleString()})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const chartData = processData();
  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-800">
          Financial Comparison
        </h3>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 rounded-lg text-sm flex items-center space-x-1 ${
                chartType === 'bar' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
              }`}
            >
              <SafeIcon icon={FiBarChart2} className="w-4 h-4" />
              <span>Bar</span>
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 rounded-lg text-sm flex items-center space-x-1 ${
                chartType === 'line' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
              }`}
            >
              <SafeIcon icon={FiTrendingUp} className="w-4 h-4" />
              <span>Line</span>
            </button>
          </div>
          <select
            value={comparisonType}
            onChange={(e) => setComparisonType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="monthly">Monthly Comparison</option>
            <option value="yearly">Yearly Comparison</option>
          </select>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={comparisonType === 'monthly' ? 'month' : 'year'} 
                tick={{ fontSize: 12 }} 
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip content={renderTooltip} />
              <Legend />
              {selectedProperties.map((property, index) => 
                years.map(year => (
                  <Bar
                    key={`${property}_${year}`}
                    dataKey={`${property}_${year}`}
                    name={`${property} (${year})`}
                    fill={COLORS[index % COLORS.length]}
                    opacity={0.8 + (0.2 * (years.indexOf(year) / years.length))}
                  />
                ))
              )}
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={comparisonType === 'monthly' ? 'month' : 'year'} 
                tick={{ fontSize: 12 }} 
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip content={renderTooltip} />
              <Legend />
              {selectedProperties.map((property, index) => 
                years.map(year => (
                  <Line
                    key={`${property}_${year}`}
                    type="monotone"
                    dataKey={`${property}_${year}`}
                    name={`${property} (${year})`}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    opacity={0.8 + (0.2 * (years.indexOf(year) / years.length))}
                  />
                ))
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialComparison;
```