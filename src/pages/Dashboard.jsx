import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import MetricCard from '../components/MetricCard';
import RecentTransactions from '../components/RecentTransactions';
import PropertyOverview from '../components/PropertyOverview';
import InventoryAlerts from '../components/InventoryAlerts';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDollarSign, FiTrendingUp, FiHome, FiCalendar, FiAlertCircle } = FiIcons;

const Dashboard = () => {
  const { properties, transactions, inventory, bookings } = useData();

  const totalRevenue = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalRevenue - totalExpenses;

  const averageOccupancy = properties.reduce((sum, p) => sum + p.occupancyRate, 0) / properties.length;

  const lowStockItems = inventory.filter(item => item.currentStock < item.minStock);

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;

  const totalProfit = properties.reduce((sum, p) => sum + (p.profit || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Enhanced Metrics Grid matching your spreadsheet data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={FiDollarSign}
          trend="+12%"
          trendUp={true}
          color="green"
        />
        <MetricCard
          title="Monthly Profit"
          value={`$${totalProfit.toLocaleString()}`}
          icon={FiTrendingUp}
          trend="+8%"
          trendUp={true}
          color="blue"
        />
        <MetricCard
          title="Avg Occupancy"
          value={`${averageOccupancy.toFixed(1)}%`}
          icon={FiHome}
          trend="+5%"
          trendUp={true}
          color="purple"
        />
        <MetricCard
          title="Total Bookings"
          value={totalBookings}
          icon={FiCalendar}
          trend={`${confirmedBookings} confirmed`}
          trendUp={true}
          color="blue"
        />
        <MetricCard
          title="Inventory Alerts"
          value={lowStockItems.length}
          icon={FiAlertCircle}
          trend={lowStockItems.length > 0 ? "Needs attention" : "All good"}
          trendUp={lowStockItems.length === 0}
          color="red"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PropertyOverview />
          <RecentTransactions />
        </div>
        
        <div className="space-y-6">
          <InventoryAlerts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;