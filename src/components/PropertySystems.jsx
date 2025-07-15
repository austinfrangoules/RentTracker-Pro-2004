```jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { HVACForm, WaterHeaterForm, RoofForm, PaintColorForm, FlooringForm, CountertopForm, CustomFieldForm } from './SystemForms';

const {
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiMinus,
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
          <div className="p-4 border-t border-gray-200">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const PropertySystems = ({ propertyId }) => {
  const [openSections, setOpenSections] = useState(['appliances']);
  const [systems, setSystems] = useState({
    hvac: {
      type: '',
      modelNumber: '',
      installDate: '',
      lastServiceDate: ''
    },
    waterHeaters: [],
    roof: {
      material: '',
      installYear: ''
    },
    paintColors: [],
    flooring: [],
    countertops: [],
    customFields: []
  });

  const toggleSection = (section) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleHVACUpdate = (updates) => {
    setSystems(prev => ({ ...prev, hvac: updates }));
  };

  const handleWaterHeaterUpdate = (updates) => {
    setSystems(prev => ({ ...prev, waterHeaters: updates }));
  };

  const handleRoofUpdate = (updates) => {
    setSystems(prev => ({ ...prev, roof: updates }));
  };

  const handlePaintColorUpdate = (index, updates) => {
    setSystems(prev => ({
      ...prev,
      paintColors: prev.paintColors.map((color, i) =>
        i === index ? updates : color
      )
    }));
  };

  const handleAddPaintColor = () => {
    setSystems(prev => ({
      ...prev,
      paintColors: [...prev.paintColors, { room: '', color: '', sheen: '' }]
    }));
  };

  const handleRemovePaintColor = (index) => {
    setSystems(prev => ({
      ...prev,
      paintColors: prev.paintColors.filter((_, i) => i !== index)
    }));
  };

  const handleFlooringUpdate = (updates) => {
    setSystems(prev => ({ ...prev, flooring: updates }));
  };

  const handleCountertopUpdate = (updates) => {
    setSystems(prev => ({ ...prev, countertops: updates }));
  };

  const handleAddCustomField = () => {
    setSystems(prev => ({
      ...prev,
      customFields: [...prev.customFields, { title: '', notes: '', date: '' }]
    }));
  };

  const handleCustomFieldUpdate = (index, updates) => {
    setSystems(prev => ({
      ...prev,
      customFields: prev.customFields.map((field, i) =>
        i === index ? updates : field
      )
    }));
  };

  const handleRemoveCustomField = (index) => {
    setSystems(prev => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-4">
      {/* HVAC Systems */}
      <SystemSection
        title="HVAC Systems"
        icon={FiSun}
        isOpen={openSections.includes('hvac')}
        onToggle={() => toggleSection('hvac')}
      >
        <HVACForm system={systems.hvac} onChange={handleHVACUpdate} />
      </SystemSection>

      {/* Water Heaters */}
      <SystemSection
        title="Water Heaters"
        icon={FiDroplet}
        isOpen={openSections.includes('waterHeaters')}
        onToggle={() => toggleSection('waterHeaters')}
      >
        <WaterHeaterForm
          heater={systems.waterHeaters[0] || {}}
          onChange={handleWaterHeaterUpdate}
        />
      </SystemSection>

      {/* Roof */}
      <SystemSection
        title="Roof"
        icon={FiHome}
        isOpen={openSections.includes('roof')}
        onToggle={() => toggleSection('roof')}
      >
        <RoofForm roof={systems.roof} onChange={handleRoofUpdate} />
      </SystemSection>

      {/* Paint Colors */}
      <SystemSection
        title="Paint Colors"
        icon={FiGrid}
        isOpen={openSections.includes('paintColors')}
        onToggle={() => toggleSection('paintColors')}
      >
        <div className="space-y-4">
          {systems.paintColors.map((paint, index) => (
            <PaintColorForm
              key={index}
              paint={paint}
              onChange={(updates) => handlePaintColorUpdate(index, updates)}
              onRemove={() => handleRemovePaintColor(index)}
            />
          ))}
          <button
            onClick={handleAddPaintColor}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Add Paint Color</span>
          </button>
        </div>
      </SystemSection>

      {/* Flooring */}
      <SystemSection
        title="Flooring"
        icon={FiLayers}
        isOpen={openSections.includes('flooring')}
        onToggle={() => toggleSection('flooring')}
      >
        <FlooringForm flooring={systems.flooring} onChange={handleFlooringUpdate} />
      </SystemSection>

      {/* Countertops */}
      <SystemSection
        title="Countertops"
        icon={FiGrid}
        isOpen={openSections.includes('countertops')}
        onToggle={() => toggleSection('countertops')}
      >
        <CountertopForm
          countertop={systems.countertops}
          onChange={handleCountertopUpdate}
        />
      </SystemSection>

      {/* Custom Fields */}
      <SystemSection
        title="Custom Fields & Notes"
        icon={FiTool}
        isOpen={openSections.includes('customFields')}
        onToggle={() => toggleSection('customFields')}
      >
        <div className="space-y-4">
          {systems.customFields.map((field, index) => (
            <CustomFieldForm
              key={index}
              field={field}
              onChange={(updates) => handleCustomFieldUpdate(index, updates)}
              onRemove={() => handleRemoveCustomField(index)}
            />
          ))}
          <button
            onClick={handleAddCustomField}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Add Custom Field</span>
          </button>
        </div>
      </SystemSection>

      {/* Save Changes Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            // Save systems data
            console.log('Saving systems:', systems);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiSave} className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};

export default PropertySystems;
```