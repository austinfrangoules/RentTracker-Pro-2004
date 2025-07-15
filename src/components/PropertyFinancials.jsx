```jsx
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDollarSign, FiArrowUpRight, FiArrowDownRight, FiTrendingUp, FiArrowRight } = FiIcons;

const PropertyFinancials = ({ property }) => {
  const navigate = useNavigate();
  const { transactions } = useData();
  
  const financialMetrics = useMemo(() => {
    // Get current date info
    const now = new Date();
    const currentYear = now.getFullYear();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    const lastMonthStart = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const yearStart = new Date(currentYear, 0, 1);

    // Filter transactions for this property
    const propertyTransactions = transactions.filter(t => t.property === property.name);

    // Calculate last month's metrics
    const lastMonthTransactions = propertyTransactions.filter(t => {
      const date = new Date(t.date);
      return date >= lastMonthStart && date <= lastMonthEnd;
    });

    const lastMonthGross = lastMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthExpenses = lastMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthNet = lastMonthGross - lastMonthExpenses;

    // Calculate YTD metrics
    const ytdTransactions = propertyTransactions.filter(t => {
      const date = new Date(t.date);
      return date >= yearStart && date <= now;
    });

    const ytdGross = ytdTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const ytdExpenses = ytdTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const ytdNet = ytdGross - ytdExpenses;

    return {
      lastMonth: {
        gross: lastMonthGross,
        expenses: lastMonthExpenses,
        net: lastMonthNet
      },
      ytd: {
        gross: ytdGross,
        expenses: ytdExpenses,
        net: ytdNet
      }
    };
  }, [transactions, property.name]);

  const handleViewFullFinancials = () => {
    navigate(`/finances?property=${encodeURIComponent(property.name)}`);
  };

  const MetricCard = ({ title, value, icon, type = 'neutral' }) => {
    const getColorClass = () => {
      switch (type) {
        case 'positive':
          return 'text-green-600';
        case 'negative':
          return 'text-red-600';
        default:
          return 'text-gray-900';
      }
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{title}</span>
          <SafeIcon icon={icon} className={`w-5 h-5 ${getColorClass()}`} />
        </div>
        <p className={`text-2xl font-bold ${getColorClass()}`}>
          ${Math.abs(value).toLocaleString()}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Last Month's Metrics */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Last Month's Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Gross Income"
            value={financialMetrics.lastMonth.gross}
            icon={FiArrowUpRight}
            type="positive"
          />
          <MetricCard
            title="Total Expenses"
            value={financialMetrics.lastMonth.expenses}
            icon={FiArrowDownRight}
            type="negative"
          />
          <MetricCard
            title="Net Profit"
            value={financialMetrics.lastMonth.net}
            icon={FiTrendingUp}
            type={financialMetrics.lastMonth.net >= 0 ? 'positive' : 'negative'}
          />
        </div>
      </div>

      {/* Year-to-Date Metrics */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Year-to-Date Totals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="YTD Gross Income"
            value={financialMetrics.ytd.gross}
            icon={FiDollarSign}
            type="positive"
          />
          <MetricCard
            title="YTD Expenses"
            value={financialMetrics.ytd.expenses}
            icon={FiDollarSign}
            type="negative"
          />
          <MetricCard
            title="YTD Net Profit"
            value={financialMetrics.ytd.net}
            icon={FiDollarSign}
            type={financialMetrics.ytd.net >= 0 ? 'positive' : 'negative'}
          />
        </div>
      </div>

      {/* View Full Financials Button */}
      <div className="flex justify-end">
        <button
          onClick={handleViewFullFinancials}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Full Financials
          <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default PropertyFinancials;
```