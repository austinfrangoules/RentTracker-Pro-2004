```jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUpload,
  FiDownload,
  FiSearch,
  FiHome,
  FiTool,
  FiSun,
  FiDroplet,
  FiGrid,
  FiLayers,
  FiCpu,
  FiFile,
  FiX
} = FiIcons;

const SystemSection = ({ title, icon, children, isOpen, onToggle }) => (
  <div className="border border-gray-200 rounded-lg mb-4">
    <button
      onClick={onToggle}
      className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 rounded-t-lg hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center space-x-2">
        <SafeIcon icon={icon} className="w-5 h-5 text-gray-600" />
        <span className="font-medium text-gray-800">{title}</span>
      </div>
      <SafeIcon
        icon={isOpen ? FiChevronUp : FiChevronDown}
        className="w-5 h-5 text-gray-500"
      />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="p-4 border-t border-gray-200">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const ConditionBadge = ({ condition }) => {
  const colors = {
    Excellent: 'bg-green-100 text-green-800',
    Good: 'bg-blue-100 text-blue-800',
    Fair: 'bg-yellow-100 text-yellow-800',
    Poor: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[condition]}`}>
      {condition}
    </span>
  );
};

const FileAttachment = ({ file, onDelete }) => (
  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-2">
      <SafeIcon icon={FiFile} className="w-4 h-4 text-gray-500" />
      <span className="text-sm text-gray-700">{file.name}</span>
    </div>
    <div className="flex items-center space-x-2">
      <button
        onClick={() => window.open(file.url, '_blank')}
        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
        title="Download"
      >
        <SafeIcon icon={FiDownload} className="w-4 h-4" />
      </button>
      <button
        onClick={onDelete}
        className="p-1 text-red-600 hover:bg-red-50 rounded"
        title="Delete"
      >
        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const PropertySystems = ({ propertyId }) => {
  const { properties, updateProperty } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [openSections, setOpenSections] = useState(['appliances']);
  const [editingItem, setEditingItem] = useState(null);
  
  const property = properties.find(p => p.id === propertyId);
  const systems = property?.systems || {
    appliances: [],
    hvac: [],
    waterHeaters: [],
    roof: {},
    paintColors: [],
    flooring: [],
    countertops: [],
    customFields: []
  };

  const toggleSection = (section) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleUpdateSystems = (updates) => {
    updateProperty(propertyId, {
      ...property,
      systems: {
        ...systems,
        ...updates
      }
    });
  };

  const handleFileUpload = async (files, category, itemId) => {
    // File upload logic would go here
    // For now, we'll just simulate it
    const fileUrls = Array.from(files).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      uploadDate: new Date().toISOString()
    }));

    const updatedSystems = { ...systems };
    if (itemId) {
      const categoryItems = updatedSystems[category];
      const itemIndex = categoryItems.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        categoryItems[itemIndex].attachments = [
          ...(categoryItems[itemIndex].attachments || []),
          ...fileUrls
        ];
      }
    } else {
      updatedSystems[category].attachments = [
        ...(updatedSystems[category].attachments || []),
        ...fileUrls
      ];
    }

    handleUpdateSystems(updatedSystems);
  };

  const renderApplianceForm = (appliance = {}) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select
          value={appliance.type || ''}
          onChange={(e) => {/* Handle change */}}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Type</option>
          <option value="refrigerator">Refrigerator</option>
          <option value="oven">Oven</option>
          <option value="dishwasher">Dishwasher</option>
          <option value="washer">Washer</option>
          <option value="dryer">Dryer</option>
          <option value="microwave">Microwave</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Brand & Model</label>
        <input
          type="text"
          value={appliance.model || ''}
          onChange={(e) => {/* Handle change */}}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Samsung RF28R7551SR"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
        <input
          type="text"
          value={appliance.serialNumber || ''}
          onChange={(e) => {/* Handle change */}}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Optional"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
        <input
          type="date"
          value={appliance.purchaseDate || ''}
          onChange={(e) => {/* Handle change */}}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
        <select
          value={appliance.condition || ''}
          onChange={(e) => {/* Handle change */}}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Condition</option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={appliance.notes || ''}
          onChange={(e) => {/* Handle change */}}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Any additional information..."
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
        <div className="space-y-2">
          {appliance.attachments?.map((file, index) => (
            <FileAttachment
              key={index}
              file={file}
              onDelete={() => {/* Handle delete */}}
            />
          ))}
          <div className="flex items-center justify-center w-full">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue-600 rounded-lg tracking-wide uppercase border border-blue-600 border-dashed cursor-pointer hover:bg-blue-50 transition-colors">
              <SafeIcon icon={FiUpload} className="w-8 h-8" />
              <span className="mt-2 text-sm">Upload files</span>
              <input type='file' className="hidden" multiple onChange={(e) => handleFileUpload(e.target.files, 'appliances', appliance.id)} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <SafeIcon
          icon={FiSearch}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search systems & components..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Systems Sections */}
      <SystemSection
        title="Appliances"
        icon={FiCpu}
        isOpen={openSections.includes('appliances')}
        onToggle={() => toggleSection('appliances')}
      >
        {systems.appliances.map((appliance) => (
          <div key={appliance.id} className="mb-4 p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-800">{appliance.type}</h4>
                <p className="text-sm text-gray-600">{appliance.model}</p>
              </div>
              <ConditionBadge condition={appliance.condition} />
            </div>
            {/* Appliance details */}
          </div>
        ))}
        <button
          onClick={() => setEditingItem({ type: 'appliances' })}
          className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Add Appliance
        </button>
      </SystemSection>

      <SystemSection
        title="HVAC Systems"
        icon={FiSun}
        isOpen={openSections.includes('hvac')}
        onToggle={() => toggleSection('hvac')}
      >
        {/* HVAC systems content */}
      </SystemSection>

      <SystemSection
        title="Water Heaters"
        icon={FiDroplet}
        isOpen={openSections.includes('waterHeaters')}
        onToggle={() => toggleSection('waterHeaters')}
      >
        {/* Water heaters content */}
      </SystemSection>

      <SystemSection
        title="Roof"
        icon={FiHome}
        isOpen={openSections.includes('roof')}
        onToggle={() => toggleSection('roof')}
      >
        {/* Roof details */}
      </SystemSection>

      <SystemSection
        title="Paint Colors"
        icon={FiGrid}
        isOpen={openSections.includes('paintColors')}
        onToggle={() => toggleSection('paintColors')}
      >
        {/* Paint colors by room */}
      </SystemSection>

      <SystemSection
        title="Flooring"
        icon={FiLayers}
        isOpen={openSections.includes('flooring')}
        onToggle={() => toggleSection('flooring')}
      >
        {/* Flooring details */}
      </SystemSection>

      <SystemSection
        title="Countertops"
        icon={FiGrid}
        isOpen={openSections.includes('countertops')}
        onToggle={() => toggleSection('countertops')}
      >
        {/* Countertops details */}
      </SystemSection>

      <SystemSection
        title="Custom Fields & Notes"
        icon={FiTool}
        isOpen={openSections.includes('customFields')}
        onToggle={() => toggleSection('customFields')}
      >
        {/* Custom fields and notes */}
      </SystemSection>
    </div>
  );
};

export default PropertySystems;
```