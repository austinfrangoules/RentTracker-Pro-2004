import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import PropertyNotes from '../components/PropertyNotes';
import PropertyExternalLinks from '../components/PropertyExternalLinks';
import PropertySystems from '../components/PropertySystems';
import InventoryPreview from '../components/InventoryPreview';
import FinancialChart from '../components/FinancialChart';
import * as FiIcons from 'react-icons/fi';

const {
  FiArrowLeft,
  FiFileText,
  FiHome,
  FiDollarSign,
  FiPackage,
  FiLink,
  FiTool,
  FiCalendar,
  FiEdit2,
  FiTrash2
} = FiIcons;

const PropertyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, transactions, inventory, deleteProperty, updateProperty } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [propertyNotes, setPropertyNotes] = useState({
    generalNotes: '',
    reminders: []
  });
  const [propertyLinks, setPropertyLinks] = useState([]);

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
        
        // Initialize notes if they don't exist
        setPropertyNotes(foundProperty.notes || {
          generalNotes: '',
          reminders: []
        });
        
        // Initialize links if they don't exist
        setPropertyLinks(foundProperty.links || []);
        
        setLoading(false);
      } catch (error) {
        console.error('Error in fetchProperty:', error);
        setError('Failed to load property');
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [id, properties]);

  const handleGoBack = () => {
    navigate('/properties');
  };

  const handleUpdateNotes = (updatedNotes) => {
    setPropertyNotes(updatedNotes);
    
    // Update the property with the new notes
    if (property) {
      const updatedProperty = {
        ...property,
        notes: updatedNotes
      };
      updateProperty(property.id, updatedProperty);
    }
  };

  const handleUpdateLinks = (updatedLinks) => {
    setPropertyLinks(updatedLinks);
    
    // Update the property with the new links
    if (property) {
      const updatedProperty = {
        ...property,
        links: updatedLinks
      };
      updateProperty(property.id, updatedProperty);
    }
  };
  
  const handleDeleteProperty = () => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      deleteProperty(property.id);
      navigate('/properties');
    }
  };

  const propertyTransactions = transactions.filter(t => property && t.property === property.name);
  const propertyInventory = inventory.filter(i => property && i.property === property.name);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">{error || 'Property not found'}</h3>
        <p className="text-gray-500 mb-6">
          We couldn't find the property you're looking for.
        </p>
        <button 
          onClick={handleGoBack}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Back to Properties
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleGoBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
            <p className="text-gray-600 mt-1">{property.address}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/properties/${id}/edit`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiEdit2} className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDeleteProperty}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Property Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiHome} className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold text-gray-800">Status:</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  property.status === 'occupied' ? 'bg-yellow-100 text-yellow-800' : 
                  property.status === 'vacant' ? 'bg-green-100 text-green-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </span>
              </div>
              {property.nextCheckout && (
                <p className="text-sm text-gray-600 mt-1">
                  <SafeIcon icon={FiCalendar} className="w-4 h-4 inline mr-1" />
                  Next checkout: {new Date(property.nextCheckout).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-xl font-bold text-green-600">${property.monthlyRevenue?.toLocaleString() || 0}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Occupancy Rate</p>
              <p className="text-xl font-bold text-blue-600">{property.occupancyRate || 0}%</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiHome} className="w-4 h-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('finances')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'finances' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiDollarSign} className="w-4 h-4 inline mr-2" />
            Finances
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'inventory' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiPackage} className="w-4 h-4 inline mr-2" />
            Inventory
          </button>
          <button
            onClick={() => setActiveTab('systems')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'systems' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiTool} className="w-4 h-4 inline mr-2" />
            Systems
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'notes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiFileText} className="w-4 h-4 inline mr-2" />
            Notes
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'links' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiLink} className="w-4 h-4 inline mr-2" />
            Links
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Address</p>
                  <p className="text-gray-800">{property.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <p className="text-gray-800 capitalize">{property.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
                  <p className="text-gray-800">${property.monthlyRevenue?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Monthly Expenses</p>
                  <p className="text-gray-800">${property.expenses?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average Nightly Rate</p>
                  <p className="text-gray-800">${property.averageNightly?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                  <p className="text-gray-800">{property.totalBookings || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Cleaning Fee</p>
                  <p className="text-gray-800">${property.cleaningFee?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pet Fee</p>
                  <p className="text-gray-800">${property.petFee?.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Financial Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-green-700">${property.monthlyRevenue?.toLocaleString() || 0}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600 mb-1">Monthly Expenses</p>
                  <p className="text-2xl font-bold text-red-700">${property.expenses?.toLocaleString() || 0}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">Monthly Profit</p>
                  <p className="text-2xl font-bold text-blue-700">${property.profit?.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Occupancy</h2>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Occupancy Rate</span>
                    <span className="text-sm font-medium text-gray-800">{property.occupancyRate || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${property.occupancyRate || 0}%` }}
                    />
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Avg. Nightly Rate</p>
                  <p className="text-xl font-bold text-gray-800">${property.averageNightly || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'finances' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Financial Transactions</h2>
              <FinancialChart transactions={propertyTransactions} />
            </div>
          </div>
        )}
        
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <InventoryPreview inventory={propertyInventory} propertyName={property.name} />
          </div>
        )}
        
        {activeTab === 'systems' && (
          <div className="space-y-6">
            <PropertySystems propertyId={property.id} />
          </div>
        )}
        
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <PropertyNotes notes={propertyNotes} onUpdateNotes={handleUpdateNotes} />
          </div>
        )}
        
        {activeTab === 'links' && (
          <div className="space-y-6">
            <PropertyExternalLinks 
              propertyId={property.id} 
              links={propertyLinks} 
              onUpdateLinks={handleUpdateLinks} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyProfile;