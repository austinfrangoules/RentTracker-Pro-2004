```jsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import MetricCard from '../components/MetricCard';
import RecentTransactions from '../components/RecentTransactions';
import PropertyOverview from '../components/PropertyOverview';
import InventoryAlerts from '../components/InventoryAlerts';
import MultiPropertyFilter from '../components/MultiPropertyFilter';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiDollarSign,
  FiTrendingUp,
  FiHome,
  FiCalendar,
  FiAlertCircle,
  FiRefreshCw
} = FiIcons;

const Dashboard = () => {
  const { properties, transactions, inventory, bookings } = useData();
  const [selectedProperties, setSelectedProperties] = useState(properties.map(p => p.name));
  const [timeRange, setTimeRange] = useState('month'); // 'month', 'quarter', 'year'

  // Filtered data based on selected properties
  const filteredData = useMemo(() => {
    const filteredTransactions = transactions.filter(t => 
      selectedProperties.includes(t.property)
    );

    const filteredBookings = bookings.filter(b => {
      const property = properties.find(p => p.id === b.propertyId);
      return property && selectedProperties.includes(property.name);
    });

    const filteredInventory = inventory.filter(i =>
      selectedProperties.includes(i.property)
    );

    // Calculate metrics
    const totalRevenue = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netIncome = totalRevenue - totalExpenses;

    const averageOccupancy = selectedProperties.length > 0
      ? properties
          .filter(p => selectedProperties.includes(p.name))
          .reduce((sum, p) => sum + p.occupancyRate, 0) / selectedProperties.length
      : 0;

    const lowStockItems = filteredInventory.filter(item => 
      item.currentStock < item.minStock
    );

    const confirmedBookings = filteredBookings.filter(b => 
      b.status === 'confirmed'
    ).length;

    const totalProfit = properties
      .filter(p => selectedProperties.includes(p.name))
      .reduce((sum, p) => sum + (p.profit || 0), 0);

    return {
      totalRevenue,
      totalExpenses,
      netIncome,
      averageOccupancy,
      lowStockItems,
      confirmedBookings,
      totalProfit,
      filteredTransactions,
      filteredBookings,
      filteredInventory
    };
  }, [selectedProperties, properties, transactions, inventory, bookings]);

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'month':
        return 'This Month';
      case 'quarter':
        return 'This Quarter';
      case 'year':
        return 'This Year';
      default:
        return 'This Month';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {selectedProperties.length === properties.length
              ? 'Viewing all properties'
              : selectedProperties.length === 1
              ? `Viewing ${selectedProperties[0]}`
              : `Viewing ${selectedProperties.length} properties`}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          {/* Property Filter */}
          <MultiPropertyFilter
            properties={properties}
            selectedProperties={selectedProperties}
            onSelectionChange={setSelectedProperties}
          />

          {/* Refresh Button */}
          <button 
            onClick={() => {
              // Add refresh logic here
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh Data"
          >
            <SafeIcon icon={FiRefreshCw} className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Warning if no properties selected */}
      {selectedProperties.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-yellow-600 mr-2" />
            <p className="text-yellow-700">
              No properties selected. Please select at least one property to view metrics.
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title={`Revenue (${getTimeRangeLabel()})`}
          value={`$${filteredData.totalRevenue.toLocaleString()}`}
          icon={FiDollarSign}
          trend="+12% from last period"
          trendUp={true}
          color="green"
        />
        
        <MetricCard
          title="Monthly Profit"
          value={`$${filteredData.totalProfit.toLocaleString()}`}
          icon={FiTrendingUp}
          trend="+8% from last month"
          trendUp={true}
          color="blue"
        />
        
        <MetricCard
          title="Avg Occupancy"
          value={`${filteredData.averageOccupancy.toFixed(1)}%`}
          icon={FiHome}
          trend="+5% from last month"
          trendUp={true}
          color="purple"
        />
        
        <MetricCard
          title="Active Bookings"
          value={filteredData.confirmedBookings}
          icon={FiCalendar}
          trend={`${filteredData.confirmedBookings} confirmed`}
          trendUp={true}
          color="blue"
        />
        
        <MetricCard
          title="Inventory Alerts"
          value={filteredData.lowStockItems.length}
          icon={FiAlertCircle}
          trend={filteredData.lowStockItems.length > 0 ? "Needs attention" : "All good"}
          trendUp={filteredData.lowStockItems.length === 0}
          color="red"
        />
      </div>

      {/* Main Content Grid */}
      {selectedProperties.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PropertyOverview
              selectedProperties={selectedProperties}
              timeRange={timeRange}
            />
            <RecentTransactions
              transactions={filteredData.filteredTransactions}
              properties={selectedProperties}
            />
          </div>
          <div className="space-y-6">
            <InventoryAlerts
              inventory={filteredData.filteredInventory}
              properties={selectedProperties}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
```