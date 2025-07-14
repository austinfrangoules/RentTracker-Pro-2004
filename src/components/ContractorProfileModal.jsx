import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiX, FiEdit2, FiPhone, FiMail, FiMapPin, FiCalendar, 
  FiDollarSign, FiClock, FiFileText, FiDownload, FiTrash2,
  FiPlus, FiTag, FiCheckCircle, FiAlertTriangle
} = FiIcons;

const ContractorProfileModal = ({ isOpen, onClose, contractor, onEdit }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const { properties, updateContractor } = useData();
  
  // Format service history to show date, property, description, cost
  const serviceHistory = contractor?.serviceHistory || [];
  
  // Calculate totals for service history
  const totalSpent = serviceHistory.reduce((sum, service) => sum + (service.cost || 0), 0);
  const averageCost = serviceHistory.length > 0 ? totalSpent / serviceHistory.length : 0;
  
  // Sort service history by date (newest first)
  const sortedHistory = [...serviceHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Group services by year
  const groupedByYear = sortedHistory.reduce((acc, service) => {
    const year = new Date(service.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(service);
    return acc;
  }, {});

  // New service state
  const [newService, setNewService] = useState({
    date: new Date().toISOString().split('T')[0],
    property: '',
    description: '',
    cost: '',
    duration: '',
    notes: '',
    urgency: 'normal'
  });

  const resetNewService = () => {
    setNewService({
      date: new Date().toISOString().split('T')[0],
      property: '',
      description: '',
      cost: '',
      duration: '',
      notes: '',
      urgency: 'normal'
    });
  };

  const handleAddService = () => {
    if (!newService.property || !newService.description || !newService.cost) {
      alert('Please fill in all required fields');
      return;
    }

    const serviceEntry = {
      ...newService,
      id: Date.now(),
      date: new Date(newService.date).toISOString(),
      cost: parseFloat(newService.cost),
      duration: parseFloat(newService.duration) || 0,
      addedAt: new Date().toISOString()
    };

    const updatedHistory = [serviceEntry, ...serviceHistory];

    // Update contractor with new service history
    if (contractor) {
      updateContractor(contractor.id, {
        ...contractor,
        serviceHistory: updatedHistory,
        lastWorked: serviceEntry.date,
        totalJobs: (contractor.totalJobs || 0) + 1
      });
    }

    // Reset form and close modal
    resetNewService();
    setIsAddServiceModalOpen(false);
  };

  const handleDeleteService = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service record?')) {
      const updatedHistory = serviceHistory.filter(s => s.id !== serviceId);
      updateContractor(contractor.id, {
        ...contractor,
        serviceHistory: updatedHistory,
        totalJobs: Math.max((contractor.totalJobs || 1) - 1, 0)
      });
    }
  };

  if (!contractor) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b flex items-center justify-between p-6">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-800">{contractor.name}</h2>
                <p className="text-gray-600">{contractor.company || 'Independent Contractor'}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => onEdit(contractor)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Edit Contractor"
                >
                  <SafeIcon icon={FiEdit2} className="w-5 h-5" />
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === 'info' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Contractor Info
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === 'history' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Service History
                </button>
              </nav>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {activeTab === 'info' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Contact Information */}
                  <div className="md:col-span-1 space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        {contractor.phone && (
                          <div className="flex items-center">
                            <SafeIcon icon={FiPhone} className="w-5 h-5 text-gray-500 mr-3" />
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <a href={`tel:${contractor.phone}`} className="text-blue-600 hover:underline">
                                {contractor.phone}
                              </a>
                            </div>
                          </div>
                        )}
                        
                        {contractor.email && (
                          <div className="flex items-center">
                            <SafeIcon icon={FiMail} className="w-5 h-5 text-gray-500 mr-3" />
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <a href={`mailto:${contractor.email}`} className="text-blue-600 hover:underline">
                                {contractor.email}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Work Locations */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Work Locations</h3>
                      <div className="space-y-2">
                        {contractor.locations?.map((location, index) => (
                          <div key={index} className="flex items-center">
                            <SafeIcon icon={FiMapPin} className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-gray-700">{location}</span>
                          </div>
                        ))}
                        {(!contractor.locations || contractor.locations.length === 0) && (
                          <p className="text-gray-500 text-sm italic">No locations specified</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Performance Metrics */}
                    {(contractor.totalJobs || contractor.avgResponseTime || contractor.hourlyRate) && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Performance</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {contractor.totalJobs && (
                            <div>
                              <p className="text-sm text-gray-500">Total Jobs</p>
                              <p className="font-medium text-gray-800">{contractor.totalJobs}</p>
                            </div>
                          )}
                          
                          {contractor.hourlyRate && (
                            <div>
                              <p className="text-sm text-gray-500">Hourly Rate</p>
                              <p className="font-medium text-gray-800">${contractor.hourlyRate}</p>
                            </div>
                          )}
                          
                          {contractor.avgResponseTime && (
                            <div>
                              <p className="text-sm text-gray-500">Avg Response</p>
                              <p className="font-medium text-gray-800">{contractor.avgResponseTime} hrs</p>
                            </div>
                          )}
                          
                          {contractor.lastWorked && (
                            <div>
                              <p className="text-sm text-gray-500">Last Service</p>
                              <p className="font-medium text-gray-800">
                                {new Date(contractor.lastWorked).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Services and Details */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Services */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Services Provided</h3>
                      <div className="flex flex-wrap gap-2">
                        {contractor.services?.map((service, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {service}
                          </span>
                        ))}
                        {(!contractor.services || contractor.services.length === 0) && (
                          <p className="text-gray-500 text-sm italic">No services specified</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {contractor.tags?.map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                        {(!contractor.tags || contractor.tags.length === 0) && (
                          <p className="text-gray-500 text-sm italic">No tags specified</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Qualifications */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Qualifications</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className={`flex items-center p-3 rounded-lg ${contractor.licensed ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <SafeIcon 
                            icon={contractor.licensed ? FiCheckCircle : FiX} 
                            className={`w-5 h-5 mr-2 ${contractor.licensed ? 'text-green-600' : 'text-gray-400'}`} 
                          />
                          <div>
                            <p className={`text-sm font-medium ${contractor.licensed ? 'text-green-800' : 'text-gray-600'}`}>
                              {contractor.licensed ? 'Licensed' : 'Not Licensed'}
                            </p>
                          </div>
                        </div>
                        
                        <div className={`flex items-center p-3 rounded-lg ${contractor.insurance ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <SafeIcon 
                            icon={contractor.insurance ? FiCheckCircle : FiX} 
                            className={`w-5 h-5 mr-2 ${contractor.insurance ? 'text-green-600' : 'text-gray-400'}`} 
                          />
                          <div>
                            <p className={`text-sm font-medium ${contractor.insurance ? 'text-green-800' : 'text-gray-600'}`}>
                              {contractor.insurance ? 'Insured' : 'Not Insured'}
                            </p>
                          </div>
                        </div>
                        
                        <div className={`flex items-center p-3 rounded-lg ${contractor.emergencyContact ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <SafeIcon 
                            icon={contractor.emergencyContact ? FiCheckCircle : FiX} 
                            className={`w-5 h-5 mr-2 ${contractor.emergencyContact ? 'text-green-600' : 'text-gray-400'}`} 
                          />
                          <div>
                            <p className={`text-sm font-medium ${contractor.emergencyContact ? 'text-green-800' : 'text-gray-600'}`}>
                              {contractor.emergencyContact ? 'Emergency Contact' : 'No Emergency Service'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Notes */}
                    {contractor.notes && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Notes</h3>
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-gray-700 whitespace-pre-line">{contractor.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'history' && (
                <div className="space-y-6">
                  {/* Service History Header with Add Service Button */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-800">Service History</h3>
                    <button
                      onClick={() => setIsAddServiceModalOpen(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                    >
                      <SafeIcon icon={FiPlus} className="w-4 h-4" />
                      <span>Add Service</span>
                    </button>
                  </div>

                  {/* Service History Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-800 mb-1">Total Services</h3>
                      <p className="text-2xl font-bold text-blue-900">{serviceHistory.length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-green-800 mb-1">Total Spent</h3>
                      <p className="text-2xl font-bold text-green-900">${totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-purple-800 mb-1">Average Cost</h3>
                      <p className="text-2xl font-bold text-purple-900">${averageCost.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                    </div>
                  </div>
                  
                  {/* Service History List */}
                  {serviceHistory.length > 0 ? (
                    <div className="space-y-6">
                      {Object.entries(groupedByYear).map(([year, services]) => (
                        <div key={year} className="space-y-3">
                          <h3 className="text-lg font-medium text-gray-800 flex items-center">
                            <SafeIcon icon={FiCalendar} className="w-5 h-5 mr-2 text-gray-600" />
                            {year} ({services.length} service{services.length !== 1 ? 's' : ''})
                          </h3>
                          
                          <div className="space-y-3">
                            {services.map((service) => (
                              <div key={service.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                  <div className="space-y-2 flex-1">
                                    <div className="flex items-center space-x-3">
                                      <SafeIcon icon={FiCalendar} className="w-4 h-4 text-gray-400" />
                                      <span className="text-sm text-gray-600">
                                        {new Date(service.date).toLocaleDateString()}
                                      </span>
                                      {service.urgency && service.urgency !== 'normal' && (
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          service.urgency === 'emergency' 
                                            ? 'bg-red-100 text-red-800' 
                                            : service.urgency === 'high' 
                                              ? 'bg-orange-100 text-orange-800' 
                                              : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                          {service.urgency}
                                        </span>
                                      )}
                                    </div>
                                    <h4 className="font-medium text-gray-800">{service.description}</h4>
                                    <p className="text-sm text-gray-600">{service.property}</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg font-medium text-green-600">
                                      ${service.cost?.toFixed(2) || '0.00'}
                                    </span>
                                    <button
                                      onClick={() => handleDeleteService(service.id)}
                                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                                      title="Delete service record"
                                    >
                                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    {service.duration > 0 && (
                                      <span className="flex items-center">
                                        <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                                        {service.duration} hours
                                      </span>
                                    )}
                                    {service.invoice && (
                                      <a 
                                        href={service.invoice.url} 
                                        download={service.invoice.name}
                                        className="flex items-center text-blue-600 hover:text-blue-800"
                                      >
                                        <SafeIcon icon={FiDownload} className="w-4 h-4 mr-1" />
                                        Invoice
                                      </a>
                                    )}
                                  </div>
                                </div>
                                
                                {service.notes && (
                                  <div className="mt-3 pt-3 border-t border-gray-100">
                                    <p className="text-sm text-gray-600">
                                      <SafeIcon icon={FiFileText} className="w-4 h-4 inline mr-1" />
                                      {service.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                      <SafeIcon icon={FiAlertTriangle} className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No service history</h3>
                      <p className="text-gray-500 mb-4">
                        This contractor doesn't have any recorded service history yet.
                      </p>
                      <button
                        onClick={() => setIsAddServiceModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors mx-auto"
                      >
                        <SafeIcon icon={FiPlus} className="w-4 h-4" />
                        <span>Add First Service</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Add Service Modal */}
            {isAddServiceModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Add Service Record</h3>
                    <button 
                      onClick={() => setIsAddServiceModalOpen(false)} 
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <SafeIcon icon={FiX} className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date *
                      </label>
                      <input 
                        type="date" 
                        value={newService.date} 
                        onChange={(e) => setNewService({...newService, date: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                        required
                      />
                    </div>
                    
                    {/* Property */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Property *
                      </label>
                      <select 
                        value={newService.property} 
                        onChange={(e) => setNewService({...newService, property: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                        required
                      >
                        <option value="">Select Property</option>
                        {properties.map(property => (
                          <option key={property.id} value={property.name}>
                            {property.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Description *
                      </label>
                      <input 
                        type="text" 
                        value={newService.description} 
                        onChange={(e) => setNewService({...newService, description: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                        placeholder="What service was performed?"
                        required
                      />
                    </div>
                    
                    {/* Cost */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cost ($) *
                      </label>
                      <input 
                        type="number" 
                        value={newService.cost} 
                        onChange={(e) => setNewService({...newService, cost: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    
                    {/* Duration (optional) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (hours)
                      </label>
                      <input 
                        type="number" 
                        value={newService.duration} 
                        onChange={(e) => setNewService({...newService, duration: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                        placeholder="0"
                        step="0.5"
                        min="0"
                      />
                    </div>
                    
                    {/* Notes (optional) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea 
                        value={newService.notes} 
                        onChange={(e) => setNewService({...newService, notes: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                        placeholder="Any additional details about the service..."
                        rows="3"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button 
                      type="button" 
                      onClick={() => setIsAddServiceModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      onClick={handleAddService}
                      className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add Service
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContractorProfileModal;