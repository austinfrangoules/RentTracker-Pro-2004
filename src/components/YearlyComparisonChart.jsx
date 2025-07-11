import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiInfo } = FiIcons;

const YearlyComparisonChart = ({ transactions, comparisonType, propertyFilter, year }) => {
  const [comparisonData, setComparisonData] = useState([]);
  const [yearlyTotals, setYearlyTotals] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    try {
      // Extract all years from transactions with error handling
      const years = [...new Set(transactions
        .filter(t => {
          try {
            const date = new Date(t.date);
            return !isNaN(date.getTime()); // Filter out invalid dates
          } catch (e) {
            return false;
          }
        })
        .map(t => {
          try {
            return new Date(t.date).getFullYear();
          } catch (e) {
            return null;
          }
        })
        .filter(year => year !== null)
      )].sort();

      setAvailableYears(years.length > 0 ? years : [new Date().getFullYear()]);

      // Filter transactions by property if needed
      const filteredTransactions = propertyFilter === 'all' 
        ? transactions 
        : transactions.filter(t => t.property === propertyFilter);

      if (comparisonType === 'monthly') {
        prepareMonthlyComparison(filteredTransactions, years);
      } else if (comparisonType === 'quarterly') {
        prepareQuarterlyComparison(filteredTransactions, years);
      } else {
        prepareYearlyComparison(filteredTransactions, years);
      }
    } catch (error) {
      console.error("Error setting up yearly comparison:", error);
      setComparisonData([]);
      setYearlyTotals([]);
      setAvailableYears([new Date().getFullYear()]);
    }
  }, [transactions, comparisonType, propertyFilter, year]);

  const prepareMonthlyComparison = (transactions, years) => {
    try {
      // Initialize data structure for all months across years
      const months = Array.from({ length: 12 }, (_, i) => ({
        month: i,
        name: new Date(2000, i, 1).toLocaleString('default', { month: 'short' }),
      }));

      // Reset yearly totals
      setYearlyTotals([]);

      // Calculate data for each month in each year
      years.forEach(year => {
        // Initialize yearly total
        let yearlyIncome = 0;
        let yearlyExpense = 0;

        months.forEach(month => {
          const monthlyTransactions = transactions.filter(t => {
            try {
              const date = new Date(t.date);
              return !isNaN(date.getTime()) && 
                     date.getFullYear() === year && 
                     date.getMonth() === month.month;
            } catch (e) {
              return false;
            }
          });

          const income = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

          const expense = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

          const net = income - expense;

          // Add to yearly totals
          yearlyIncome += income;
          yearlyExpense += expense;

          // Add data to the month object
          month[`income${year}`] = income;
          month[`expense${year}`] = expense;
          month[`net${year}`] = net;
        });

        // Update yearly totals
        setYearlyTotals(prev => [
          ...prev.filter(t => t.year !== year),
          { year, income: yearlyIncome, expense: yearlyExpense, net: yearlyIncome - yearlyExpense }
        ]);
      });

      setComparisonData(months);
    } catch (error) {
      console.error("Error in prepareMonthlyComparison:", error);
      setComparisonData([]);
    }
  };

  const prepareQuarterlyComparison = (transactions, years) => {
    try {
      // Initialize data structure for quarters
      const quarters = [
        { quarter: 'Q1', months: [0, 1, 2] },
        { quarter: 'Q2', months: [3, 4, 5] },
        { quarter: 'Q3', months: [6, 7, 8] },
        { quarter: 'Q4', months: [9, 10, 11] }
      ];

      // Reset yearly totals
      setYearlyTotals([]);

      // Calculate data for each quarter in each year
      years.forEach(year => {
        // Initialize yearly total
        let yearlyIncome = 0;
        let yearlyExpense = 0;

        quarters.forEach(quarter => {
          // Get transactions for this quarter
          const quarterlyTransactions = transactions.filter(t => {
            try {
              const date = new Date(t.date);
              return !isNaN(date.getTime()) && 
                     date.getFullYear() === year && 
                     quarter.months.includes(date.getMonth());
            } catch (e) {
              return false;
            }
          });

          const income = quarterlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

          const expense = quarterlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

          const net = income - expense;

          // Add to yearly totals
          yearlyIncome += income;
          yearlyExpense += expense;

          // Add data to the quarter object
          quarter[`income${year}`] = income;
          quarter[`expense${year}`] = expense;
          quarter[`net${year}`] = net;
        });

        // Update yearly totals
        setYearlyTotals(prev => [
          ...prev.filter(t => t.year !== year),
          { year, income: yearlyIncome, expense: yearlyExpense, net: yearlyIncome - yearlyExpense }
        ]);
      });

      setComparisonData(quarters);
    } catch (error) {
      console.error("Error in prepareQuarterlyComparison:", error);
      setComparisonData([]);
    }
  };

  const prepareYearlyComparison = (transactions, years) => {
    try {
      // Initialize yearly data
      const yearlyData = years.map(year => ({
        year,
        income: 0,
        expense: 0,
        net: 0
      }));

      // Calculate totals for each year
      yearlyData.forEach(yearData => {
        const yearlyTransactions = transactions.filter(t => {
          try {
            const date = new Date(t.date);
            return !isNaN(date.getTime()) && date.getFullYear() === yearData.year;
          } catch (e) {
            return false;
          }
        });

        yearData.income = yearlyTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);

        yearData.expense = yearlyTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        yearData.net = yearData.income - yearData.expense;
      });

      setComparisonData(yearlyData);
      setYearlyTotals(yearlyData);
    } catch (error) {
      console.error("Error in prepareYearlyComparison:", error);
      setComparisonData([]);
      setYearlyTotals([]);
    }
  };

  const renderTooltip = (props) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-lg border border-gray-200">
          <p className="font-medium text-gray-900">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry, index) => {
              // Extract the year from the dataKey if present
              const yearMatch = entry.dataKey && entry.dataKey.match(/\d{4}/);
              const year = yearMatch ? yearMatch[0] : '';
              
              // Get the type (income, expense, net)
              const type = entry.dataKey ? entry.dataKey.replace(year, '') : entry.name;
              
              let color = 'text-blue-600';
              if (type === 'income') color = 'text-green-600';
              if (type === 'expense') color = 'text-red-600';
              
              return (
                <p key={index} className={color} style={{ color: entry.color }}>
                  {year ? `${year} ${type}: ` : `${type}: `}
                  {typeof entry.value === 'number' ? `$${entry.value.toLocaleString()}` : entry.value}
                </p>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  // If no data available
  if (comparisonData.length === 0 || availableYears.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">No financial data available for comparison.</p>
      </div>
    );
  }

  const renderYearlyTotals = () => (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      {yearlyTotals.map(year => (
        <div key={year.year} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{year.year} Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Income:</span>
              <span className="text-green-600 font-medium">${year.income.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Expenses:</span>
              <span className="text-red-600 font-medium">${year.expense.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600 font-medium">Net:</span>
              <span className={`font-medium ${year.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${year.net.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMonthlyOrQuarterlyComparison = () => {
    // For monthly or quarterly comparison, we render a bar chart with grouped bars for each year
    const dataKey = comparisonType === 'monthly' ? 'name' : 'quarter';
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {comparisonType === 'monthly' ? 'Monthly' : 'Quarterly'} Net Income Comparison
          </h3>
          <div className="ml-2 text-gray-500 cursor-pointer group relative">
            <SafeIcon icon={FiInfo} className="w-4 h-4" />
            <div className="hidden group-hover:block absolute z-10 bg-white p-2 rounded shadow-lg text-xs w-48 border border-gray-200 right-0">
              Compare net income across different years
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={dataKey} />
              <YAxis />
              <Tooltip content={renderTooltip} />
              <Legend />
              {availableYears.map((year, index) => (
                <Bar 
                  key={`net${year}`} 
                  dataKey={`net${year}`} 
                  name={`Net ${year}`} 
                  fill={`hsl(${index * 40 + 200}, 70%, 50%)`} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderYearlyComparison = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Yearly Financial Trends</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip content={renderTooltip} />
            <Legend />
            <Line type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="expense" name="Expenses" stroke="#ef4444" strokeWidth={2} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="net" name="Net" stroke="#3b82f6" strokeWidth={2} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Yearly Summary Cards */}
      {renderYearlyTotals()}
      
      {/* Comparison Chart */}
      {comparisonType === 'yearly' 
        ? renderYearlyComparison() 
        : renderMonthlyOrQuarterlyComparison()
      }
    </div>
  );
};

export default YearlyComparisonChart;