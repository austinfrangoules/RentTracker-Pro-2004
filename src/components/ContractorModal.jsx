import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiSave, FiPlus, FiMinus } = FiIcons;

const ContractorModal = ({ isOpen, onClose, contractor, onSave }) => {
  const { addContractor, updateContractor, properties } = useData();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    services: [''],
    locations: [],
    rating: 0,
    status: 'active',
    tags: [''],
    notes: '',
    hourlyRate: '',
    totalJobs: '',
    avgResponseTime: '',
    lastWorked: '',
    emergencyContact: false,
    insurance: false,
    licensed: false
  });
  const [newTag, setNewTag] = useState('');
  const [newService, setNewService] = useState('');

  useEffect(() => {
    if (contractor) {
      setFormData({
        ...contractor,
        services: contractor.services || [''],
        tags: contractor.tags || [''],
        locations: contractor.locations || [],
        hourlyRate: contractor.hourlyRate || '',
        totalJobs: contractor.totalJobs || '',
        avgResponseTime: contractor.avgResponseTime || '',
        lastWorked: contractor.lastWorked || '',
        emergencyContact: contractor.emergencyContact || false,
        insurance: contractor.insurance || false,
        licensed: contractor.licensed || false
      });
    } else {
      setFormData({
        name: '',
        company: '',
        phone: '',
        email: '',
        services: [''],
        locations: [],
        rating: 0,
        status: 'active',
        tags: [''],
        notes: '',
        hourlyRate: '',
        totalJobs: '',
        avgResponseTime: '',
        lastWorked: '',
        emergencyContact: false,
        insurance: false,
        licensed: false
      });
    }
  }, [contractor, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean up data
    const cleanData = {
      ...formData,
      services: formData.services.filter(s => s.trim() !== ''),
      tags: formData.tags.filter(t => t.trim() !== ''),
      hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
      totalJobs: formData.totalJobs ? parseInt(formData.totalJobs) : null,
      avgResponseTime: formData.avgResponseTime ? parseFloat(formData.avgResponseTime) : null
    };
    
    let savedContractor;
    if (contractor) {
      updateContractor(contractor.id, cleanData);
      savedContractor = { ...contractor, ...cleanData };
    } else {
      savedContractor = addContractor(cleanData);
    }
    
    // If onSave callback is provided, call it with the saved contractor
    if (onSave && typeof onSave === 'function') {
      onSave(savedContractor);
    } else {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleServiceChange = (index, value) => {
    const newServices = [...formData.services];
    newServices[index] = value;
    setFormData(prev => ({
      ...prev,
      services: newServices
    }));
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, '']
    }));
  };

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleTagChange = (index, value) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({
      ...prev,
      tags: newTags
    }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleLocationToggle = (locationName) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.includes(locationName)
        ? prev.locations.filter(l => l !== locationName)
        : [...prev.locations, locationName]
    }));
  };

  const commonTags = [
    'Reliable',
    'Emergency',
    'Licensed',
    'Insured',
    'Fast Response',
    'Quality Work',
    'Affordable',
    'Experienced',
    'Professional',
    'Recommended'
  ];

  const commonServices = [
    'Plumbing',
    'Electrical',
    'HVAC',
    'Cleaning',
    'Landscaping',
    'Painting',
    'Handyman',
    'Appliance Repair',
    'Pest Control',
    'Security',
    'Flooring',
    'Roofing',
    'Windows'
  ];

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
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {contractor ? 'Edit Contractor' : 'Add New Contractor'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Basic Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating (1-5)
                      </label>
                      <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        min="0"
                        max="5"
                        step="0.1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Services and Skills */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Services & Skills</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Services Provided
                    </label>
                    <div className="space-y-2">
                      {formData.services.map((service, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={service}
                            onChange={(e) => handleServiceChange(index, e.target.value)}
                            placeholder="Enter service"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          {formData.services.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeService(index)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                            >
                              <SafeIcon icon={FiMinus} className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addService}
                      className="mt-2 flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <SafeIcon icon={FiPlus} className="w-4 h-4" />
                      <span>Add Service</span>
                    </button>

                    {/* Common Services */}
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-2">Quick add:</p>
                      <div className="flex flex-wrap gap-1">
                        {commonServices.map((service) => (
                          <button
                            key={service}
                            type="button"
                            onClick={() => {
                              if (!formData.services.includes(service)) {
                                const newServices = [...formData.services];
                                const emptyIndex = newServices.findIndex(s => s === '');
                                if (emptyIndex >= 0) {
                                  newServices[emptyIndex] = service;
                                } else {
                                  newServices.push(service);
                                }
                                setFormData(prev => ({
                                  ...prev,
                                  services: newServices
                                }));
                              }
                            }}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                          >
                            {service}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Work Locations */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Work Locations
                    </label>
                    <div className="space-y-2">
                      {properties.map((property) => (
                        <label key={property.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.locations.includes(property.name)}
                            onChange={() => handleLocationToggle(property.name)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{property.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Performance & Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Performance & Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hourly Rate ($)
                      </label>
                      <input
                        type="number"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Jobs
                      </label>
                      <input
                        type="number"
                        name="totalJobs"
                        value={formData.totalJobs}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Avg Response Time (hours)
                      </label>
                      <input
                        type="number"
                        name="avgResponseTime"
                        value={formData.avgResponseTime}
                        onChange={handleChange}
                        step="0.1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Worked
                      </label>
                      <input
                        type="date"
                        name="lastWorked"
                        value={formData.lastWorked}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="emergencyContact"
                        checked={formData.emergencyContact}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Available for emergencies</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="insurance"
                        checked={formData.insurance}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Has insurance</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="licensed"
                        checked={formData.licensed}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Licensed professional</span>
                    </label>
                  </div>
                </div>

                {/* Tags and Notes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Tags & Notes</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="space-y-2">
                      {formData.tags.map((tag, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={tag}
                            onChange={(e) => handleTagChange(index, e.target.value)}
                            placeholder="Enter tag"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          {formData.tags.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTag(index)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                            >
                              <SafeIcon icon={FiMinus} className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addTag}
                      className="mt-2 flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <SafeIcon icon={FiPlus} className="w-4 h-4" />
                      <span>Add Tag</span>
                    </button>

                    {/* Common Tags */}
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-2">Quick add:</p>
                      <div className="flex flex-wrap gap-1">
                        {commonTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              if (!formData.tags.includes(tag)) {
                                const newTags = [...formData.tags];
                                const emptyIndex = newTags.findIndex(t => t === '');
                                if (emptyIndex >= 0) {
                                  newTags[emptyIndex] = tag;
                                } else {
                                  newTags.push(tag);
                                }
                                setFormData(prev => ({
                                  ...prev,
                                  tags: newTags
                                }));
                              }
                            }}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Add any additional notes about this contractor..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-6 mt-6 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiSave} className="w-4 h-4" />
                  <span>Save Contractor</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContractorModal;