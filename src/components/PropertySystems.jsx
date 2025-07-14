import React, { useState, useEffect, useRef } from 'react';
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
  FiX,
  FiCheck,
  FiSave
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
    'Excellent': 'bg-green-100 text-green-800',
    'Good': 'bg-blue-100 text-blue-800',
    'Fair': 'bg-yellow-100 text-yellow-800',
    'Poor': 'bg-red-100 text-red-800'
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
  const [isAddingItem, setIsAddingItem] = useState(null);
  const fileInputRef = useRef(null);
  
  const property = properties.find(p => p.id === propertyId);
  const systems = property?.systems || {
    appliances: [],
    hvac: [],
    waterHeaters: [],
    roof: {},
    paintColors: [],
    flooring: [],
    countertops: [],
    customFields: [],
    attachments: []
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
      systems: { ...systems, ...updates }
    });
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Simulate file uploads
    const fileUrls = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      uploadDate: new Date().toISOString(),
      size: file.size
    }));
    
    handleUpdateSystems({
      attachments: [...(systems.attachments || []), ...fileUrls]
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteFile = (index) => {
    const updatedAttachments = [...(systems.attachments || [])];
    updatedAttachments.splice(index, 1);
    handleUpdateSystems({ attachments: updatedAttachments });
  };

  // Appliance Handlers
  const handleAddAppliance = () => {
    setEditingItem(null);
    setIsAddingItem('appliance');
  };

  const handleSaveAppliance = (appliance) => {
    const updatedAppliances = [...(systems.appliances || [])];
    
    if (editingItem !== null) {
      updatedAppliances[editingItem] = appliance;
    } else {
      updatedAppliances.push({
        ...appliance,
        id: Date.now()
      });
    }
    
    handleUpdateSystems({ appliances: updatedAppliances });
    setIsAddingItem(null);
    setEditingItem(null);
  };

  const handleEditAppliance = (index) => {
    setEditingItem(index);
    setIsAddingItem('appliance');
  };

  const handleDeleteAppliance = (index) => {
    if (window.confirm('Are you sure you want to delete this appliance?')) {
      const updatedAppliances = [...systems.appliances];
      updatedAppliances.splice(index, 1);
      handleUpdateSystems({ appliances: updatedAppliances });
    }
  };

  // HVAC Handlers
  const handleAddHvac = () => {
    if ((systems.hvac || []).length >= 2) {
      alert('Maximum of 2 HVAC systems allowed per property');
      return;
    }
    setEditingItem(null);
    setIsAddingItem('hvac');
  };

  const handleSaveHvac = (hvac) => {
    const updatedHvac = [...(systems.hvac || [])];
    
    if (editingItem !== null) {
      updatedHvac[editingItem] = hvac;
    } else {
      updatedHvac.push({
        ...hvac,
        id: Date.now()
      });
    }
    
    handleUpdateSystems({ hvac: updatedHvac });
    setIsAddingItem(null);
    setEditingItem(null);
  };

  const handleEditHvac = (index) => {
    setEditingItem(index);
    setIsAddingItem('hvac');
  };

  const handleDeleteHvac = (index) => {
    if (window.confirm('Are you sure you want to delete this HVAC system?')) {
      const updatedHvac = [...systems.hvac];
      updatedHvac.splice(index, 1);
      handleUpdateSystems({ hvac: updatedHvac });
    }
  };

  // Water Heater Handlers
  const handleAddWaterHeater = () => {
    setEditingItem(null);
    setIsAddingItem('waterHeater');
  };

  const handleSaveWaterHeater = (waterHeater) => {
    const updatedWaterHeaters = [...(systems.waterHeaters || [])];
    
    if (editingItem !== null) {
      updatedWaterHeaters[editingItem] = waterHeater;
    } else {
      updatedWaterHeaters.push({
        ...waterHeater,
        id: Date.now()
      });
    }
    
    handleUpdateSystems({ waterHeaters: updatedWaterHeaters });
    setIsAddingItem(null);
    setEditingItem(null);
  };

  const handleEditWaterHeater = (index) => {
    setEditingItem(index);
    setIsAddingItem('waterHeater');
  };

  const handleDeleteWaterHeater = (index) => {
    if (window.confirm('Are you sure you want to delete this water heater?')) {
      const updatedWaterHeaters = [...systems.waterHeaters];
      updatedWaterHeaters.splice(index, 1);
      handleUpdateSystems({ waterHeaters: updatedWaterHeaters });
    }
  };

  // Roof Handlers
  const handleSaveRoof = (roof) => {
    handleUpdateSystems({ roof });
    setIsAddingItem(null);
  };

  const handleEditRoof = () => {
    setIsAddingItem('roof');
  };

  // Paint Colors Handlers
  const handleAddPaint = () => {
    setEditingItem(null);
    setIsAddingItem('paint');
  };

  const handleSavePaint = (paint) => {
    const updatedPaints = [...(systems.paintColors || [])];
    
    if (editingItem !== null) {
      updatedPaints[editingItem] = paint;
    } else {
      updatedPaints.push({
        ...paint,
        id: Date.now()
      });
    }
    
    handleUpdateSystems({ paintColors: updatedPaints });
    setIsAddingItem(null);
    setEditingItem(null);
  };

  const handleEditPaint = (index) => {
    setEditingItem(index);
    setIsAddingItem('paint');
  };

  const handleDeletePaint = (index) => {
    if (window.confirm('Are you sure you want to delete this paint entry?')) {
      const updatedPaints = [...systems.paintColors];
      updatedPaints.splice(index, 1);
      handleUpdateSystems({ paintColors: updatedPaints });
    }
  };

  // Flooring Handlers
  const handleAddFlooring = () => {
    setEditingItem(null);
    setIsAddingItem('flooring');
  };

  const handleSaveFlooring = (flooring) => {
    const updatedFlooring = [...(systems.flooring || [])];
    
    if (editingItem !== null) {
      updatedFlooring[editingItem] = flooring;
    } else {
      updatedFlooring.push({
        ...flooring,
        id: Date.now()
      });
    }
    
    handleUpdateSystems({ flooring: updatedFlooring });
    setIsAddingItem(null);
    setEditingItem(null);
  };

  const handleEditFlooring = (index) => {
    setEditingItem(index);
    setIsAddingItem('flooring');
  };

  const handleDeleteFlooring = (index) => {
    if (window.confirm('Are you sure you want to delete this flooring entry?')) {
      const updatedFlooring = [...systems.flooring];
      updatedFlooring.splice(index, 1);
      handleUpdateSystems({ flooring: updatedFlooring });
    }
  };

  // Countertops Handlers
  const handleAddCountertop = () => {
    setEditingItem(null);
    setIsAddingItem('countertop');
  };

  const handleSaveCountertop = (countertop) => {
    const updatedCountertops = [...(systems.countertops || [])];
    
    if (editingItem !== null) {
      updatedCountertops[editingItem] = countertop;
    } else {
      updatedCountertops.push({
        ...countertop,
        id: Date.now()
      });
    }
    
    handleUpdateSystems({ countertops: updatedCountertops });
    setIsAddingItem(null);
    setEditingItem(null);
  };

  const handleEditCountertop = (index) => {
    setEditingItem(index);
    setIsAddingItem('countertop');
  };

  const handleDeleteCountertop = (index) => {
    if (window.confirm('Are you sure you want to delete this countertop entry?')) {
      const updatedCountertops = [...systems.countertops];
      updatedCountertops.splice(index, 1);
      handleUpdateSystems({ countertops: updatedCountertops });
    }
  };

  // Custom Field Handlers
  const handleAddCustomField = () => {
    setEditingItem(null);
    setIsAddingItem('customField');
  };

  const handleSaveCustomField = (field) => {
    const updatedFields = [...(systems.customFields || [])];
    
    if (editingItem !== null) {
      updatedFields[editingItem] = field;
    } else {
      updatedFields.push({
        ...field,
        id: Date.now()
      });
    }
    
    handleUpdateSystems({ customFields: updatedFields });
    setIsAddingItem(null);
    setEditingItem(null);
  };

  const handleEditCustomField = (index) => {
    setEditingItem(index);
    setIsAddingItem('customField');
  };

  const handleDeleteCustomField = (index) => {
    if (window.confirm('Are you sure you want to delete this custom field?')) {
      const updatedFields = [...systems.customFields];
      updatedFields.splice(index, 1);
      handleUpdateSystems({ customFields: updatedFields });
    }
  };

  // Form Components
  const ApplianceForm = ({ onSave, onCancel, appliance = {} }) => {
    const [formData, setFormData] = useState({
      type: appliance.type || '',
      brand: appliance.brand || '',
      model: appliance.model || '',
      serialNumber: appliance.serialNumber || '',
      installDate: appliance.installDate || '',
      condition: appliance.condition || 'Good',
      notes: appliance.notes || ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Type</option>
              <option value="refrigerator">Refrigerator</option>
              <option value="oven">Oven</option>
              <option value="dishwasher">Dishwasher</option>
              <option value="washer">Washer</option>
              <option value="dryer">Dryer</option>
              <option value="microwave">Microwave</option>
              <option value="water_heater">Water Heater</option>
              <option value="hvac">HVAC</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand & Model</label>
            <input 
              type="text" 
              name="brand" 
              value={formData.brand} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Samsung"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model Number</label>
            <input 
              type="text" 
              name="model" 
              value={formData.model} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., RF28R7551SR"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
            <input 
              type="text" 
              name="serialNumber" 
              value={formData.serialNumber} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Optional"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Install Date</label>
            <input 
              type="date" 
              name="installDate" 
              value={formData.installDate} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select 
              name="condition" 
              value={formData.condition} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional information..."
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    );
  };

  const HvacForm = ({ onSave, onCancel, hvac = {} }) => {
    const [formData, setFormData] = useState({
      type: hvac.type || '',
      brand: hvac.brand || '',
      model: hvac.model || '',
      installYear: hvac.installYear || '',
      lastServiced: hvac.lastServiced || '',
      condition: hvac.condition || 'Good',
      notes: hvac.notes || ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">System Type</label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Type</option>
              <option value="central">Central AC/Heat</option>
              <option value="mini-split">Mini Split</option>
              <option value="window">Window Unit</option>
              <option value="heat-pump">Heat Pump</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input 
              type="text" 
              name="brand" 
              value={formData.brand} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Carrier, Trane, etc."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model Number</label>
            <input 
              type="text" 
              name="model" 
              value={formData.model} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Model number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Install Year</label>
            <input 
              type="number" 
              name="installYear" 
              value={formData.installYear} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2019"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Serviced Date</label>
            <input 
              type="date" 
              name="lastServiced" 
              value={formData.lastServiced} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select 
              name="condition" 
              value={formData.condition} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Maintenance history, issues, etc."
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    );
  };

  const WaterHeaterForm = ({ onSave, onCancel, waterHeater = {} }) => {
    const [formData, setFormData] = useState({
      type: waterHeater.type || 'tank',
      capacity: waterHeater.capacity || '',
      brand: waterHeater.brand || '',
      model: waterHeater.model || '',
      installYear: waterHeater.installYear || '',
      condition: waterHeater.condition || 'Good',
      notes: waterHeater.notes || ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="tank">Tank</option>
              <option value="tankless">Tankless</option>
              <option value="hybrid">Hybrid/Heat Pump</option>
              <option value="solar">Solar</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (gallons)</label>
            <input 
              type="number" 
              name="capacity" 
              value={formData.capacity} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 40"
              min="0"
              step="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input 
              type="text" 
              name="brand" 
              value={formData.brand} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Rheem, AO Smith"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model Number</label>
            <input 
              type="text" 
              name="model" 
              value={formData.model} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Model number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Install Year</label>
            <input 
              type="number" 
              name="installYear" 
              value={formData.installYear} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2019"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select 
              name="condition" 
              value={formData.condition} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Maintenance notes, warranty info, etc."
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    );
  };

  const RoofForm = ({ onSave, onCancel, roof = {} }) => {
    const [formData, setFormData] = useState({
      material: roof.material || '',
      installYear: roof.installYear || '',
      hasWarranty: roof.hasWarranty || false,
      warrantyEnd: roof.warrantyEnd || '',
      condition: roof.condition || 'Good',
      notes: roof.notes || ''
    });

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
            <select 
              name="material" 
              value={formData.material} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Material</option>
              <option value="asphalt">Asphalt Shingles</option>
              <option value="metal">Metal</option>
              <option value="tile">Tile</option>
              <option value="slate">Slate</option>
              <option value="wood">Wood Shake</option>
              <option value="tpo">TPO/Flat</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Install Year</label>
            <input 
              type="number" 
              name="installYear" 
              value={formData.installYear} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2015"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select 
              name="condition" 
              value={formData.condition} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="hasWarranty"
              name="hasWarranty" 
              checked={formData.hasWarranty} 
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="hasWarranty" className="ml-2 block text-sm text-gray-700">
              Has Warranty
            </label>
          </div>
          
          {formData.hasWarranty && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warranty End Date</label>
              <input 
                type="date" 
                name="warrantyEnd" 
                value={formData.warrantyEnd} 
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Warranty details, repairs, etc."
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    );
  };

  const PaintForm = ({ onSave, onCancel, paint = {} }) => {
    const [formData, setFormData] = useState({
      room: paint.room || '',
      brand: paint.brand || '',
      color: paint.color || '',
      sheen: paint.sheen || '',
      date: paint.date || '',
      notes: paint.notes || ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
            <input 
              type="text" 
              name="room" 
              value={formData.room} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Living Room, Kitchen"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input 
              type="text" 
              name="brand" 
              value={formData.brand} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Sherwin Williams, Behr"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color Name/Code</label>
            <input 
              type="text" 
              name="color" 
              value={formData.color} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Naval SW 6244"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sheen</label>
            <select 
              name="sheen" 
              value={formData.sheen} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Sheen</option>
              <option value="flat">Flat</option>
              <option value="eggshell">Eggshell</option>
              <option value="satin">Satin</option>
              <option value="semi-gloss">Semi-Gloss</option>
              <option value="gloss">Gloss</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Painted</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Additional details, primer used, etc."
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    );
  };

  const FlooringForm = ({ onSave, onCancel, flooring = {} }) => {
    const [formData, setFormData] = useState({
      room: flooring.room || '',
      type: flooring.type || '',
      brand: flooring.brand || '',
      installYear: flooring.installYear || '',
      notes: flooring.notes || ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
            <input 
              type="text" 
              name="room" 
              value={formData.room} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Living Room, Kitchen"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              <option value="lvp">Luxury Vinyl Plank</option>
              <option value="hardwood">Hardwood</option>
              <option value="laminate">Laminate</option>
              <option value="tile">Tile</option>
              <option value="carpet">Carpet</option>
              <option value="concrete">Concrete</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand/Source</label>
            <input 
              type="text" 
              name="brand" 
              value={formData.brand} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Shaw, Home Depot"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Install Year</label>
            <input 
              type="number" 
              name="installYear" 
              value={formData.installYear} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2019"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Color, pattern, additional details, etc."
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    );
  };

  const CountertopForm = ({ onSave, onCancel, countertop = {} }) => {
    const [formData, setFormData] = useState({
      room: countertop.room || '',
      material: countertop.material || '',
      color: countertop.color || '',
      supplier: countertop.supplier || '',
      installYear: countertop.installYear || '',
      notes: countertop.notes || ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
            <input 
              type="text" 
              name="room" 
              value={formData.room} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Kitchen, Bathroom"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
            <select 
              name="material" 
              value={formData.material} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Material</option>
              <option value="granite">Granite</option>
              <option value="quartz">Quartz</option>
              <option value="marble">Marble</option>
              <option value="butcher-block">Butcher Block</option>
              <option value="laminate">Laminate</option>
              <option value="solid-surface">Solid Surface</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color/Pattern</label>
            <input 
              type="text" 
              name="color" 
              value={formData.color} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Calacatta Gold, Black Pearl"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
            <input 
              type="text" 
              name="supplier" 
              value={formData.supplier} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Stone World, Home Depot"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Install Year</label>
            <input 
              type="number" 
              name="installYear" 
              value={formData.installYear} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2019"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Edge style, sealer used, etc."
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    );
  };

  const CustomFieldForm = ({ onSave, onCancel, field = {} }) => {
    const [formData, setFormData] = useState({
      title: field.title || '',
      notes: field.notes || '',
      date: field.date || ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Deck Replacement, Fence Installation"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Add details, specifications, etc."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
        {systems.appliances && systems.appliances.length > 0 ? (
          <div className="space-y-4">
            {systems.appliances.map((appliance, index) => (
              <div
                key={appliance.id || index}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-800 capitalize">{appliance.type.replace('_', ' ')}</h4>
                    {appliance.brand && appliance.model && (
                      <p className="text-sm text-gray-600">{appliance.brand} - {appliance.model}</p>
                    )}
                  </div>
                  <ConditionBadge condition={appliance.condition} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                  {appliance.serialNumber && (
                    <div>
                      <span className="text-gray-500">Serial #:</span> {appliance.serialNumber}
                    </div>
                  )}
                  {appliance.installDate && (
                    <div>
                      <span className="text-gray-500">Installed:</span> {new Date(appliance.installDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                {appliance.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">{appliance.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    onClick={() => handleEditAppliance(index)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAppliance(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No appliance information added yet.</p>
        )}
        
        {isAddingItem === 'appliance' ? (
          <ApplianceForm
            onSave={handleSaveAppliance}
            onCancel={() => {
              setIsAddingItem(null);
              setEditingItem(null);
            }}
            appliance={editingItem !== null ? systems.appliances[editingItem] : {}}
          />
        ) : (
          <button
            onClick={handleAddAppliance}
            className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" /> Add Appliance
          </button>
        )}
      </SystemSection>

      <SystemSection
        title="HVAC Systems"
        icon={FiSun}
        isOpen={openSections.includes('hvac')}
        onToggle={() => toggleSection('hvac')}
      >
        {systems.hvac && systems.hvac.length > 0 ? (
          <div className="space-y-4">
            {systems.hvac.map((hvac, index) => (
              <div
                key={hvac.id || index}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-800 capitalize">{hvac.type.replace('-', ' ')}</h4>
                    {hvac.brand && (
                      <p className="text-sm text-gray-600">{hvac.brand} {hvac.model && `- ${hvac.model}`}</p>
                    )}
                  </div>
                  <ConditionBadge condition={hvac.condition} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                  {hvac.installYear && (
                    <div>
                      <span className="text-gray-500">Installed:</span> {hvac.installYear}
                    </div>
                  )}
                  {hvac.lastServiced && (
                    <div>
                      <span className="text-gray-500">Last Serviced:</span> {new Date(hvac.lastServiced).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                {hvac.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">{hvac.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    onClick={() => handleEditHvac(index)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteHvac(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No HVAC system information added yet.</p>
        )}
        
        {isAddingItem === 'hvac' ? (
          <HvacForm
            onSave={handleSaveHvac}
            onCancel={() => {
              setIsAddingItem(null);
              setEditingItem(null);
            }}
            hvac={editingItem !== null ? systems.hvac[editingItem] : {}}
          />
        ) : (
          <button
            onClick={handleAddHvac}
            className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" /> Add HVAC System
          </button>
        )}
      </SystemSection>

      <SystemSection
        title="Water Heaters"
        icon={FiDroplet}
        isOpen={openSections.includes('waterHeaters')}
        onToggle={() => toggleSection('waterHeaters')}
      >
        {systems.waterHeaters && systems.waterHeaters.length > 0 ? (
          <div className="space-y-4">
            {systems.waterHeaters.map((waterHeater, index) => (
              <div
                key={waterHeater.id || index}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-800 capitalize">{waterHeater.type} Water Heater</h4>
                    {waterHeater.brand && (
                      <p className="text-sm text-gray-600">
                        {waterHeater.brand} {waterHeater.model && `- ${waterHeater.model}`}
                        {waterHeater.capacity && ` (${waterHeater.capacity} gallons)`}
                      </p>
                    )}
                  </div>
                  <ConditionBadge condition={waterHeater.condition} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                  {waterHeater.installYear && (
                    <div>
                      <span className="text-gray-500">Installed:</span> {waterHeater.installYear}
                    </div>
                  )}
                </div>
                
                {waterHeater.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">{waterHeater.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    onClick={() => handleEditWaterHeater(index)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteWaterHeater(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No water heater information added yet.</p>
        )}
        
        {isAddingItem === 'waterHeater' ? (
          <WaterHeaterForm
            onSave={handleSaveWaterHeater}
            onCancel={() => {
              setIsAddingItem(null);
              setEditingItem(null);
            }}
            waterHeater={editingItem !== null ? systems.waterHeaters[editingItem] : {}}
          />
        ) : (
          <button
            onClick={handleAddWaterHeater}
            className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" /> Add Water Heater
          </button>
        )}
      </SystemSection>

      <SystemSection
        title="Roof"
        icon={FiHome}
        isOpen={openSections.includes('roof')}
        onToggle={() => toggleSection('roof')}
      >
        {systems.roof && Object.keys(systems.roof).length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-800 capitalize">
                {systems.roof.material && systems.roof.material.replace('-', ' ')} Roof
              </h4>
              {systems.roof.condition && <ConditionBadge condition={systems.roof.condition} />}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              {systems.roof.installYear && (
                <div>
                  <span className="text-gray-500">Installed:</span> {systems.roof.installYear}
                </div>
              )}
              {systems.roof.hasWarranty && (
                <div>
                  <span className="text-gray-500">Warranty Until:</span> {
                    systems.roof.warrantyEnd 
                      ? new Date(systems.roof.warrantyEnd).toLocaleDateString() 
                      : 'Yes (end date not specified)'
                  }
                </div>
              )}
            </div>
            
            {systems.roof.notes && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600">{systems.roof.notes}</p>
              </div>
            )}
            
            <div className="flex justify-end mt-3">
              <button
                onClick={handleEditRoof}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiEdit2} className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No roof information added yet.</p>
        )}
        
        {isAddingItem === 'roof' ? (
          <RoofForm
            onSave={handleSaveRoof}
            onCancel={() => setIsAddingItem(null)}
            roof={systems.roof || {}}
          />
        ) : (
          <button
            onClick={handleEditRoof}
            className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
          >
            {Object.keys(systems.roof || {}).length > 0 ? (
              <>
                <SafeIcon icon={FiEdit2} className="w-4 h-4 mr-2" /> Edit Roof Information
              </>
            ) : (
              <>
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" /> Add Roof Information
              </>
            )}
          </button>
        )}
      </SystemSection>

      <SystemSection
        title="Paint Colors"
        icon={FiGrid}
        isOpen={openSections.includes('paintColors')}
        onToggle={() => toggleSection('paintColors')}
      >
        {systems.paintColors && systems.paintColors.length > 0 ? (
          <div className="space-y-4">
            {systems.paintColors.map((paint, index) => (
              <div
                key={paint.id || index}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{paint.room}</h4>
                  {paint.date && (
                    <span className="text-xs text-gray-500">
                      {new Date(paint.date).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  {paint.brand && (
                    <div>
                      <span className="text-gray-500">Brand:</span> {paint.brand}
                    </div>
                  )}
                  {paint.color && (
                    <div>
                      <span className="text-gray-500">Color:</span> {paint.color}
                    </div>
                  )}
                  {paint.sheen && (
                    <div>
                      <span className="text-gray-500">Sheen:</span> {paint.sheen}
                    </div>
                  )}
                </div>
                
                {paint.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">{paint.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    onClick={() => handleEditPaint(index)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePaint(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No paint color information added yet.</p>
        )}
        
        {isAddingItem === 'paint' ? (
          <PaintForm
            onSave={handleSavePaint}
            onCancel={() => {
              setIsAddingItem(null);
              setEditingItem(null);
            }}
            paint={editingItem !== null ? systems.paintColors[editingItem] : {}}
          />
        ) : (
          <button
            onClick={handleAddPaint}
            className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" /> Add Paint Colors
          </button>
        )}
      </SystemSection>

      <SystemSection
        title="Flooring"
        icon={FiLayers}
        isOpen={openSections.includes('flooring')}
        onToggle={() => toggleSection('flooring')}
      >
        {systems.flooring && systems.flooring.length > 0 ? (
          <div className="space-y-4">
            {systems.flooring.map((flooring, index) => (
              <div
                key={flooring.id || index}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{flooring.room}</h4>
                  {flooring.installYear && (
                    <span className="text-xs text-gray-500">
                      Installed: {flooring.installYear}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  {flooring.type && (
                    <div>
                      <span className="text-gray-500">Type:</span> {flooring.type.replace('-', ' ')}
                    </div>
                  )}
                  {flooring.brand && (
                    <div>
                      <span className="text-gray-500">Brand/Source:</span> {flooring.brand}
                    </div>
                  )}
                </div>
                
                {flooring.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">{flooring.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    onClick={() => handleEditFlooring(index)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFlooring(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No flooring information added yet.</p>
        )}
        
        {isAddingItem === 'flooring' ? (
          <FlooringForm
            onSave={handleSaveFlooring}
            onCancel={() => {
              setIsAddingItem(null);
              setEditingItem(null);
            }}
            flooring={editingItem !== null ? systems.flooring[editingItem] : {}}
          />
        ) : (
          <button
            onClick={handleAddFlooring}
            className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" /> Add Flooring
          </button>
        )}
      </SystemSection>

      <SystemSection
        title="Countertops"
        icon={FiGrid}
        isOpen={openSections.includes('countertops')}
        onToggle={() => toggleSection('countertops')}
      >
        {systems.countertops && systems.countertops.length > 0 ? (
          <div className="space-y-4">
            {systems.countertops.map((countertop, index) => (
              <div
                key={countertop.id || index}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{countertop.room}</h4>
                  {countertop.installYear && (
                    <span className="text-xs text-gray-500">
                      Installed: {countertop.installYear}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  {countertop.material && (
                    <div>
                      <span className="text-gray-500">Material:</span> {countertop.material.replace('-', ' ')}
                    </div>
                  )}
                  {countertop.color && (
                    <div>
                      <span className="text-gray-500">Color/Pattern:</span> {countertop.color}
                    </div>
                  )}
                  {countertop.supplier && (
                    <div>
                      <span className="text-gray-500">Supplier:</span> {countertop.supplier}
                    </div>
                  )}
                </div>
                
                {countertop.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">{countertop.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    onClick={() => handleEditCountertop(index)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCountertop(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No countertop information added yet.</p>
        )}
        
        {isAddingItem === 'countertop' ? (
          <CountertopForm
            onSave={handleSaveCountertop}
            onCancel={() => {
              setIsAddingItem(null);
              setEditingItem(null);
            }}
            countertop={editingItem !== null ? systems.countertops[editingItem] : {}}
          />
        ) : (
          <button
            onClick={handleAddCountertop}
            className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" /> Add Countertop
          </button>
        )}
      </SystemSection>

      <SystemSection
        title="Custom Fields & Notes"
        icon={FiTool}
        isOpen={openSections.includes('customFields')}
        onToggle={() => toggleSection('customFields')}
      >
        {systems.customFields && systems.customFields.length > 0 ? (
          <div className="space-y-4">
            {systems.customFields.map((field, index) => (
              <div
                key={field.id || index}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{field.title}</h4>
                  {field.date && (
                    <span className="text-xs text-gray-500">
                      {new Date(field.date).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                {field.notes && (
                  <div className="text-sm text-gray-600">
                    <p>{field.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    onClick={() => handleEditCustomField(index)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCustomField(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No custom fields added yet.</p>
        )}
        
        {isAddingItem === 'customField' ? (
          <CustomFieldForm
            onSave={handleSaveCustomField}
            onCancel={() => {
              setIsAddingItem(null);
              setEditingItem(null);
            }}
            field={editingItem !== null ? systems.customFields[editingItem] : {}}
          />
        ) : (
          <button
            onClick={handleAddCustomField}
            className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" /> Add Custom Field
          </button>
        )}
      </SystemSection>

      {/* Document Uploads Section */}
      <SystemSection
        title="Documents & Attachments"
        icon={FiFile}
        isOpen={openSections.includes('attachments')}
        onToggle={() => toggleSection('attachments')}
      >
        <div className="space-y-4">
          {systems.attachments && systems.attachments.length > 0 ? (
            <div className="space-y-2">
              {systems.attachments.map((file, index) => (
                <FileAttachment
                  key={index}
                  file={file}
                  onDelete={() => handleDeleteFile(index)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No documents uploaded yet.</p>
          )}
          
          <div className="mt-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              multiple
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex flex-col items-center justify-center"
            >
              <SafeIcon icon={FiUpload} className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">Upload Documents</span>
              <span className="text-xs text-gray-500 mt-1">
                Manuals, Warranties, Receipts, etc.
              </span>
            </button>
          </div>
        </div>
      </SystemSection>
    </div>
  );
};

export default PropertySystems;
