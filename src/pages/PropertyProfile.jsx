import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import InventoryPreview from '../components/InventoryPreview';
import * as FiIcons from 'react-icons/fi';

const { 
  FiHome, 
  FiDollarSign, 
  FiPackage, 
  FiTool, 
  FiArrowLeft, 
  FiMapPin, 
  FiCalendar, 
  FiUsers,
  FiTrendingUp
} = FiIcons;

const PropertyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, inventory, transactions, bookings } = useData();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        // First get basic property data from context
        const parsedId = parseInt(id);
        const foundProperty = properties.find(p => p.id === parsedId);
        
        if (!foundProperty) {
          setError('Property not found');
          setLoading(false);
          return;
        }
        
        setProperty(foundProperty);
        setLoading(false);
      } catch (error) {
        console.error('Error in fetchProperty:', error);
        setError('Failed to load property');
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [id, properties]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Property not found'}</h2>
        <p className="text-gray-600 mb-6">The property you're looking for could not be found or loaded.</p>
        <button 
          onClick={() => navigate('/properties')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Properties
        </button>
      </div>
    );
  }

  // Filter data for this property
  const propertyInventory = inventory.filter(item => item.property === property.name);
  const propertyTransactions = transactions.filter(t => t.property === property.name);
  const propertyBookings = bookings.filter(b => b.propertyId === property.id);

  // Calculate key metrics
  const totalRevenue = propertyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = propertyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netIncome = totalRevenue - totalExpenses;

  const upcomingBookings = propertyBookings
    .filter(b => new Date(b.checkIn) > new Date())
    .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/properties')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
            <p className="text-gray-600 mt-1">{property.address}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            property.status === 'occupied' ? 'bg-yellow-100 text-yellow-800' : 
            property.status === 'vacant' ? 'bg-green-100 text-green-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {property.status}
          </span>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <SafeIcon icon={FiHome} className="w-4 h-4" />
              <span>Overview</span>
            </button>
            
            <button
              onClick={() => setActiveTab('finances')}
              className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'finances' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <SafeIcon icon={FiDollarSign} className="w-4 h-4" />
              <span>Finances</span>
            </button>
            
            <button
              onClick={() => setActiveTab('maintenance')}
              className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'maintenance' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <SafeIcon icon={FiTool} className="w-4 h-4" />
              <span>Maintenance</span>
            </button>
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
                {/* Property Details */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Property Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiMapPin} className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium text-gray-800">{property.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Next Checkout</p>
                        <p className="font-medium text-gray-800">
                          {property.nextCheckout 
                            ? new Date(property.nextCheckout).toLocaleDateString() 
                            : 'None scheduled'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiUsers} className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Total Bookings</p>
                        <p className="font-medium text-gray-800">{property.totalBookings || 0}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Standard Fees</p>
                        <p className="font-medium text-gray-800">
                          Cleaning: ${property.cleaningFee || 0} | Pet: ${property.petFee || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Performance Metrics */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Occupancy Rate</span>
                        <span className="text-sm font-medium text-blue-600">{property.occupancyRate || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${property.occupancyRate || 0}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Monthly Revenue</p>
                        <p className="text-lg font-bold text-green-600">${property.monthlyRevenue?.toLocaleString() || 0}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Monthly Profit</p>
                        <p className="text-lg font-bold text-blue-600">${property.profit?.toLocaleString() || 0}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Avg. Nightly</p>
                        <p className="text-lg font-bold text-gray-800">${property.averageNightly || 0}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Monthly Expenses</p>
                        <p className="text-lg font-bold text-red-600">${property.expenses?.toLocaleString() || 0}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">YTD Performance</p>
                        <p className="font-medium text-gray-800">
                          Net Income: <span className={netIncome >= 0 ? 'text-green-600' : 'text-red-600'}>
                            ${netIncome.toLocaleString()}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory Preview */}
              <InventoryPreview 
                inventory={inventory}
                propertyName={property.name}
              />
            </div>
          )}
          
          {activeTab === 'finances' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-800">Financial Overview</h3>
              {/* Financial content would go here */}
              <p className="text-gray-600">Financial data and charts for {property.name} will be displayed here.</p>
            </div>
          )}
          
          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-800">Maintenance Records</h3>
              {/* Maintenance content would go here */}
              <p className="text-gray-600">Maintenance history and upcoming tasks for {property.name} will be displayed here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyProfile;