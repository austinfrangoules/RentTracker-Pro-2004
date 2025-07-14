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

  const propertyTransactions = transactions.filter(t => t.property === property.name);
  const propertyBookings = bookings.filter(b => b.propertyId === property.id);
  const propertyInventory = inventory.filter(i => i.property === property.name);

  const totalIncome = propertyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = propertyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netIncome = totalIncome - totalExpenses;

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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/properties')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(property.status)}`}>{property.status}</span>
            <button onClick={() => navigate(`/properties`)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <SafeIcon icon={FiEdit2} className="w-4 h-4" />
              <span>Edit Property</span>
            </button>
          </div>
        </div>

        {/* Remaining sections untouched */}
      </div>

      {/* Tabs */}
      {/* ... keep tabs + tab contents here unchanged ... */}

    </div>
  );
};

export default PropertyProfile;
