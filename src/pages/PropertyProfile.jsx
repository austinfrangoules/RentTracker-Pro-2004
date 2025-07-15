```jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import FinancialDetailTable from '../components/FinancialDetailTable';
import FinancialChart from '../components/FinancialChart';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiHome, 
  FiMapPin, 
  FiArrowLeft, 
  FiEdit2, 
  FiTrash2, 
  FiDollarSign, 
  FiTool, 
  FiLink, 
  FiSettings,
  FiTrendingUp,
  FiShare2,
  FiStar,
  FiBed,
  FiBath,
  FiMaximize2
} = FiIcons;

const PropertyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, transactions, deleteProperty } = useData();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock photos array - in real app, these would come from your database
  const photos = [
    property?.image,
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
  ].filter(Boolean);

  // Filter transactions for this property and current year
  const propertyTransactions = transactions.filter(t => {
    const transactionYear = new Date(t.date).getFullYear();
    return t.property === property?.name && transactionYear === new Date().getFullYear();
  });

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const parsedId = parseInt(id);
        const foundProperty = properties.find(p => p.id === parsedId);
        if (!foundProperty) {
          setError('Property not found');
          setLoading(false);
          return;
        }
        setProperty(foundProperty);
      } catch (error) {
        console.error('Error in fetchProperty:', error);
        setError('Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, properties]);

  const handleDeleteProperty = () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      deleteProperty(property.id);
      navigate('/properties');
    }
  };

  // Calculate financial metrics
  const financialMetrics = {
    totalIncome: propertyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: propertyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    get netIncome() {
      return this.totalIncome - this.totalExpenses;
    },
    get profitMargin() {
      return this.totalIncome ? (this.netIncome / this.totalIncome) * 100 : 0;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{error || 'Property not found'}</h2>
          <p className="text-gray-600 mb-4">We couldn't find the property you're looking for.</p>
          <button
            onClick={() => navigate('/properties')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const renderFinancesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h4 className="text-sm text-green-600 mb-1">Total Income</h4>
          <p className="text-2xl font-bold text-green-700">
            ${financialMetrics.totalIncome.toLocaleString()}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h4 className="text-sm text-red-600 mb-1">Total Expenses</h4>
          <p className="text-2xl font-bold text-red-700">
            ${financialMetrics.totalExpenses.toLocaleString()}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h4 className="text-sm text-blue-600 mb-1">Net Income</h4>
          <p className="text-2xl font-bold text-blue-700">
            ${financialMetrics.netIncome.toLocaleString()}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h4 className="text-sm text-purple-600 mb-1">Profit Margin</h4>
          <p className="text-2xl font-bold text-purple-700">
            {financialMetrics.profitMargin.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Financial Trends</h3>
        <div className="h-80">
          <FinancialChart transactions={propertyTransactions} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Transaction History</h3>
        <FinancialDetailTable transactions={propertyTransactions} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between py-4">
        <button
          onClick={() => navigate('/properties')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
          <span>Back to Properties</span>
        </button>
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <SafeIcon icon={FiShare2} className="w-5 h-5" />
          </button>
          <button
            onClick={() => {/* TODO: Edit property */}}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <SafeIcon icon={FiEdit2} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Property Photos Grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[480px] rounded-xl overflow-hidden">
        <div className="col-span-2 row-span-2 relative group">
          <img
            src={photos[0]}
            alt="Main"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-200" />
        </div>
        <div className="relative group">
          <img
            src={photos[1]}
            alt="Second"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-200" />
        </div>
        <div className="relative group">
          <img
            src={photos[2]}
            alt="Third"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-200" />
        </div>
        <div className="relative group">
          <img
            src={photos[3]}
            alt="Fourth"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-200" />
        </div>
        <div className="relative group">
          <img
            src={photos[4]}
            alt="Fifth"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-200" />
        </div>
      </div>

      {/* Property Info */}
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">{property.name}</h1>
              <p className="text-lg text-gray-600 mt-1">{property.address}</p>
            </div>
            <div className="flex items-center space-x-1 text-gray-900">
              <SafeIcon icon={FiStar} className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">4.9</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 mt-6 pb-6 border-b">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiBed} className="w-5 h-5 text-gray-500" />
              <span>3 Bedrooms</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiBath} className="w-5 h-5 text-gray-500" />
              <span>2 Bathrooms</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiMaximize2} className="w-5 h-5 text-gray-500" />
              <span>1,500 sqft</span>
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center p-4">
              <p className="text-2xl font-bold text-gray-900">${property.monthlyRevenue?.toLocaleString()}</p>
              <p className="text-gray-600">Monthly Revenue</p>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Occupancy Rate</span>
                <span className="font-medium">{property.occupancyRate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Average Nightly</span>
                <span className="font-medium">${property.averageNightly}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cleaning Fee</span>
                <span className="font-medium">${property.cleaningFee}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('finances')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'finances'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Finances
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'maintenance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Maintenance
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'links'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            External Links
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold text-gray-900">About this property</h2>
              <p className="text-gray-600">
                Modern and well-maintained property in a prime location. Perfect for short-term rentals
                with all the amenities guests expect. Recently renovated with high-end finishes and
                smart home features.
              </p>
            </div>
          </div>
        )}
        {activeTab === 'finances' && renderFinancesTab()}
        {activeTab === 'maintenance' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Maintenance</h2>
            <p className="text-gray-600 mt-2">
              Track maintenance tasks and manage contractors for this property.
            </p>
          </div>
        )}
        {activeTab === 'links' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900">External Links</h2>
            <p className="text-gray-600 mt-2">
              Manage links to listings, smart home devices, and other external resources.
            </p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
            <p className="text-gray-600 mt-2">
              Configure settings specific to this property.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyProfile;
```