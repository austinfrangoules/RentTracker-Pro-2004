import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiUpload, FiCalendar, FiDollarSign, FiClock, FiFileText, FiDownload, FiTrash2, FiPlus, FiZap, FiCheck, FiAlertCircle, FiTag, FiChevronDown, FiChevronUp } = FiIcons;

const ServiceHistoryModal = ({ isOpen, onClose, contractor }) => {
  const { properties, updateContractor } = useData();
  const [serviceHistory, setServiceHistory] = useState([]);
  const [newService, setNewService] = useState({
    date: new Date().toISOString().split('T')[0],
    property: '',
    description: '',
    cost: '',
    duration: '',
    invoice: null,
    notes: '',
    category: '',
    urgency: 'normal'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [showAiHelper, setShowAiHelper] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);

  // Service categories for organization
  const serviceCategories = [
    'Plumbing', 'Electrical', 'HVAC', 'Cleaning', 'Maintenance', 'Repairs',
    'Installation', 'Inspection', 'Emergency', 'Other'
  ];

  // Load service history when contractor changes
  useEffect(() => {
    if (contractor?.serviceHistory) {
      setServiceHistory(contractor.serviceHistory);
    } else {
      setServiceHistory([]);
    }
  }, [contractor]);

  const handleFileUpload = async (file) => {
    setUploadedFile(file);
    setIsProcessing(true);
    try {
      // Simulate AI processing of the invoice/receipt
      const aiAnalysis = await analyzeInvoiceWithAI(file);
      setAiSuggestions(aiAnalysis);
      setShowAiHelper(true);
      // Here you would typically upload to your storage solution
      return {
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size
      };
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // AI-powered invoice analysis simulation
  const analyzeInvoiceWithAI = async (file) => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI analysis based on file name and common patterns
    const fileName = file.name.toLowerCase();
    const mockAnalysis = {
      extractedData: {
        date: new Date().toISOString().split('T')[0],
        amount: Math.floor(Math.random() * 500) + 50,
        vendor: contractor?.name || 'Service Provider',
        description: '',
        category: 'Maintenance'
      },
      confidence: 0.85,
      suggestions: []
    };

    // Smart categorization based on file content simulation
    if (fileName.includes('plumb') || fileName.includes('pipe')) {
      mockAnalysis.extractedData.category = 'Plumbing';
      mockAnalysis.extractedData.description = 'Plumbing repair service';
      mockAnalysis.suggestions.push('This appears to be a plumbing service invoice');
    } else if (fileName.includes('electric') || fileName.includes('wire')) {
      mockAnalysis.extractedData.category = 'Electrical';
      mockAnalysis.extractedData.description = 'Electrical work service';
      mockAnalysis.suggestions.push('Electrical service detected');
    } else if (fileName.includes('clean')) {
      mockAnalysis.extractedData.category = 'Cleaning';
      mockAnalysis.extractedData.description = 'Professional cleaning service';
      mockAnalysis.suggestions.push('Cleaning service invoice identified');
    } else {
      mockAnalysis.extractedData.description = 'General maintenance service';
      mockAnalysis.suggestions.push('General service invoice - please verify details');
    }

    return mockAnalysis;
  };

  const applyAiSuggestions = () => {
    if (aiSuggestions) {
      setNewService(prev => ({
        ...prev,
        date: aiSuggestions.extractedData.date,
        cost: aiSuggestions.extractedData.amount.toString(),
        description: aiSuggestions.extractedData.description,
        category: aiSuggestions.extractedData.category
      }));
      setShowAiHelper(false);
    }
  };

  const handleAddService = async () => {
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

    if (uploadedFile) {
      serviceEntry.invoice = await handleFileUpload(uploadedFile);
    }

    const updatedHistory = [serviceEntry, ...serviceHistory];
    setServiceHistory(updatedHistory);

    // Update contractor with new service history
    if (contractor) {
      updateContractor(contractor.id, {
        ...contractor,
        serviceHistory: updatedHistory,
        lastWorked: serviceEntry.date,
        totalJobs: (contractor.totalJobs || 0) + 1
      });
    }

    // Reset form
    setNewService({
      date: new Date().toISOString().split('T')[0],
      property: '',
      description: '',
      cost: '',
      duration: '',
      invoice: null,
      notes: '',
      category: '',
      urgency: 'normal'
    });
    setUploadedFile(null);
    setAiSuggestions(null);
    setShowAiHelper(false);
    setShowAddServiceForm(false);
  };

  const handleDeleteService = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service record?')) {
      const updatedHistory = serviceHistory.filter(s => s.id !== serviceId);
      setServiceHistory(updatedHistory);
      if (contractor) {
        updateContractor(contractor.id, {
          ...contractor,
          serviceHistory: updatedHistory,
          totalJobs: Math.max((contractor.totalJobs || 1) - 1, 0)
        });
      }
    }
  };

  const getTotalCost = () => {
    return serviceHistory.reduce((sum, service) => sum + (service.cost || 0), 0);
  };

  const getServicesByCategory = () => {
    const grouped = serviceHistory.reduce((acc, service) => {
      const category = service.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(service);
      return acc;
    }, {});
    return grouped;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Service History - {contractor?.name}
                </h2>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>Total Services: {serviceHistory.length}</span>
                  <span>Total Cost: ${getTotalCost().toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* AI Helper Banner */}
              {showAiHelper && aiSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiZap} className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium text-blue-800">AI Analysis Complete</h3>
                        <p className="text-sm text-blue-600 mt-1">
                          Confidence: {(aiSuggestions.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={applyAiSuggestions}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Apply Suggestions
                      </button>
                      <button
                        onClick={() => setShowAiHelper(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <SafeIcon icon={FiX} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-blue-700">
                      <strong>Detected:</strong> {aiSuggestions.extractedData.description}
                    </p>
                    <p className="text-sm text-blue-700">
                      <strong>Amount:</strong> ${aiSuggestions.extractedData.amount}
                    </p>
                    <p className="text-sm text-blue-700">
                      <strong>Category:</strong> {aiSuggestions.extractedData.category}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Add New Service Button & Collapsible Form */}
              <div className="bg-gray-50 rounded-lg border border-gray-200">
                <button 
                  onClick={() => setShowAddServiceForm(!showAddServiceForm)}
                  className="w-full flex items-center justify-between p-4 text-left font-medium text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2 text-blue-600" />
                    <span>Add New Service Record</span>
                  </div>
                  <SafeIcon 
                    icon={showAddServiceForm ? FiChevronUp : FiChevronDown} 
                    className="w-5 h-5 text-gray-500" 
                  />
                </button>
                
                <AnimatePresence>
                  {showAddServiceForm && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 space-y-4 border-t border-gray-200">
                        {isProcessing && (
                          <div className="flex items-center justify-end space-x-2 text-blue-600">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm">AI analyzing invoice...</span>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Date *
                            </label>
                            <input
                              type="date"
                              value={newService.date}
                              onChange={(e) => setNewService(prev => ({ ...prev, date: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Property *
                            </label>
                            <select
                              value={newService.property}
                              onChange={(e) => setNewService(prev => ({ ...prev, property: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select Property</option>
                              {properties.map(property => (
                                <option key={property.id} value={property.name}>
                                  {property.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Category
                            </label>
                            <select
                              value={newService.category}
                              onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select Category</option>
                              {serviceCategories.map(category => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Service Description *
                            </label>
                            <input
                              type="text"
                              value={newService.description}
                              onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="What service was performed?"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Urgency
                            </label>
                            <select
                              value={newService.urgency}
                              onChange={(e) => setNewService(prev => ({ ...prev, urgency: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="low">Low</option>
                              <option value="normal">Normal</option>
                              <option value="high">High</option>
                              <option value="emergency">Emergency</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Cost ($) *
                            </label>
                            <input
                              type="number"
                              value={newService.cost}
                              onChange={(e) => setNewService(prev => ({ ...prev, cost: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="0.00"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Duration (hours)
                            </label>
                            <input
                              type="number"
                              value={newService.duration}
                              onChange={(e) => setNewService(prev => ({ ...prev, duration: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="0.0"
                              step="0.5"
                            />
                          </div>
                          <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Upload Invoice/Receipt
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                              <div className="space-y-1 text-center">
                                <SafeIcon icon={FiUpload} className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                    <span>Upload a file</span>
                                    <input
                                      type="file"
                                      className="sr-only"
                                      accept=".pdf,.jpg,.jpeg,.png"
                                      onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                          setUploadedFile(e.target.files[0]);
                                          handleFileUpload(e.target.files[0]);
                                        }
                                      }}
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  PDF, PNG, JPG up to 10MB
                                </p>
                                {uploadedFile && (
                                  <div className="mt-2 flex items-center justify-center space-x-2 text-sm text-green-600">
                                    <SafeIcon icon={FiCheck} className="w-4 h-4" />
                                    <span>{uploadedFile.name}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Notes
                            </label>
                            <textarea
                              value={newService.notes}
                              onChange={(e) => setNewService(prev => ({ ...prev, notes: e.target.value }))}
                              rows="3"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Any additional notes about this service..."
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={handleAddService}
                            disabled={isProcessing}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                          >
                            <SafeIcon icon={FiPlus} className="w-4 h-4" />
                            <span>Add Service Record</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Service History List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-800">Service History</h3>
                  {Object.keys(getServicesByCategory()).length > 1 && (
                    <div className="text-sm text-gray-500">
                      Organized by category
                    </div>
                  )}
                </div>

                {Object.keys(getServicesByCategory()).length > 0 ? (
                  Object.entries(getServicesByCategory()).map(([category, services]) => (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiTag} className="w-4 h-4 text-gray-500" />
                        <h4 className="font-medium text-gray-700">{category}</h4>
                        <span className="text-sm text-gray-500">({services.length})</span>
                      </div>
                      <div className="space-y-3 ml-6">
                        {services.map((service) => (
                          <div
                            key={service.id}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
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
                              <div className="flex items-center space-x-3">
                                <span className="text-lg font-medium text-green-600">
                                  ${service.cost.toFixed(2)}
                                </span>
                                <button
                                  onClick={() => handleDeleteService(service.id)}
                                  className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
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
                                    Download Invoice
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
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <SafeIcon icon={FiFileText} className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No service history recorded yet</p>
                    <p className="text-sm mt-1">Add your first service record using the form above</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ServiceHistoryModal;