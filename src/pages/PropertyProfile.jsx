```jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import PropertySystems from '../components/PropertySystems';
import * as FiIcons from 'react-icons/fi';

const {
  FiArrowLeft,
  FiEdit2,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiHome,
  FiTrendingUp,
  FiUsers,
  FiPackage,
  FiBarChart3,
  FiTool
} = FiIcons;

const PropertyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, transactions, bookings, inventory } = useData();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchProperty = () => {
      setLoading(true);
      try {
        const parsedId = parseInt(id);
        const foundProperty = properties.find(p => p.id === parsedId);
        if (!foundProperty) {
          console.error('Property not found');
          setProperty(null);
        } else {
          setProperty(foundProperty);
        }
      } catch (error) {
        console.error('Error finding property:', error);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, properties]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <h2 className="text-lg font-medium text-red-800">Property Not Found</h2>
          <p className="text-red-600 mt-2">The property you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/properties')}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  // Filter data for this property
  const propertyTransactions = transactions.filter(t => t.property === property.name);
  const propertyBookings = bookings.filter(b => b.propertyId === property.id);
  const propertyInventory = inventory.filter(i => i.property === property.name);

  // Calculate financial metrics
  const totalIncome = propertyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = propertyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const netIncome = totalIncome - totalExpenses;

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'occupied':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'vacant':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FiHome },
    { id: 'financials', name: 'Financials', icon: FiDollarSign },
    { id: 'bookings', name: 'Bookings', icon: FiCalendar },
    { id: 'inventory', name: 'Inventory', icon: FiPackage },
    { id: 'systems', name: 'Systems & Specs', icon: FiTool }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/properties')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
              <p className="text-gray-600 flex items-center mt-1">
                <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-1" />
                {property.address}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(property.status)}`}>
              {property.status}
            </span>
            <button
              onClick={() => navigate(`/properties`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <SafeIcon icon={FiEdit2} className="w-4 h-4" />
              <span>Edit Property</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-green-800">Monthly Revenue</p>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiDollarSign} className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-green-700 mt-2">
              ${property.monthlyRevenue?.toLocaleString() || 0}
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-800">Occupancy Rate</p>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiUsers} className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-700 mt-2">
              {property.occupancyRate || 0}%
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-purple-800">Total Bookings</p>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiCalendar} className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-purple-700 mt-2">
              {propertyBookings.length}
            </p>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-yellow-800">Net Income</p>
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-yellow-700 mt-2">
              ${netIncome.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Property Image */}
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Property Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Nightly Rate:</span>
                      <span className="font-medium">${property.averageNightly || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cleaning Fee:</span>
                      <span className="font-medium">${property.cleaningFee || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pet Fee:</span>
                      <span className="font-medium">${property.petFee || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Bookings:</span>
                      <span className="font-medium">{property.totalBookings || 0}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Profit:</span>
                      <span className={`font-medium ${property.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${property.profit?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Expenses:</span>
                      <span className="font-medium text-red-600">${property.expenses || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Occupancy Rate:</span>
                      <span className="font-medium">{property.occupancyRate || 0}%</span>
                    </div>
                    {property.nextCheckout && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next Checkout:</span>
                        <span className="font-medium">
                          {new Date(property.nextCheckout).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'systems' && (
            <PropertySystems propertyId={property.id} />
          )}

          {/* Other tab content remains the same */}
        </div>
      </div>
    </div>
  );
};

export default PropertyProfile;
```