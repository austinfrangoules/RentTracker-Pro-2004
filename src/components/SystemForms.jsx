```jsx
import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiUpload,
  FiTrash2,
  FiPlus,
  FiMinus
} = FiIcons;

export const HVACForm = ({ system = {}, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">System Type</label>
      <select
        value={system.type || ''}
        onChange={(e) => onChange({ ...system, type: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Type</option>
        <option value="central">Central AC/Heat</option>
        <option value="mini-split">Mini Split</option>
        <option value="window">Window Unit</option>
        <option value="heat-pump">Heat Pump</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Model Number</label>
      <input
        type="text"
        value={system.modelNumber || ''}
        onChange={(e) => onChange({ ...system, modelNumber: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Install Date</label>
      <input
        type="date"
        value={system.installDate || ''}
        onChange={(e) => onChange({ ...system, installDate: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Last Service Date</label>
      <input
        type="date"
        value={system.lastServiceDate || ''}
        onChange={(e) => onChange({ ...system, lastServiceDate: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
);

export const WaterHeaterForm = ({ heater = {}, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
      <select
        value={heater.type || ''}
        onChange={(e) => onChange({ ...heater, type: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Type</option>
        <option value="tank">Tank</option>
        <option value="tankless">Tankless</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (gallons)</label>
      <input
        type="number"
        value={heater.capacity || ''}
        onChange={(e) => onChange({ ...heater, capacity: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
);

export const RoofForm = ({ roof = {}, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
      <select
        value={roof.material || ''}
        onChange={(e) => onChange({ ...roof, material: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Material</option>
        <option value="asphalt">Asphalt Shingles</option>
        <option value="metal">Metal</option>
        <option value="tile">Tile</option>
        <option value="slate">Slate</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Install Year</label>
      <input
        type="number"
        value={roof.installYear || ''}
        onChange={(e) => onChange({ ...roof, installYear: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
);

export const PaintColorForm = ({ paint = {}, onChange, onRemove }) => (
  <div className="border border-gray-200 rounded-lg p-4 mb-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
        <input
          type="text"
          value={paint.room || ''}
          onChange={(e) => onChange({ ...paint, room: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Living Room"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Brand & Color Name</label>
        <input
          type="text"
          value={paint.color || ''}
          onChange={(e) => onChange({ ...paint, color: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Sherwin Williams Naval SW 6244"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sheen</label>
        <select
          value={paint.sheen || ''}
          onChange={(e) => onChange({ ...paint, sheen: e.target.value })}
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

      <div className="flex items-end">
        <button
          type="button"
          onClick={onRemove}
          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center"
        >
          <SafeIcon icon={FiTrash2} className="w-4 h-4 mr-2" />
          Remove
        </button>
      </div>
    </div>
  </div>
);

export const FlooringForm = ({ flooring = {}, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
      <input
        type="text"
        value={flooring.room || ''}
        onChange={(e) => onChange({ ...flooring, room: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
      <select
        value={flooring.type || ''}
        onChange={(e) => onChange({ ...flooring, type: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Type</option>
        <option value="lvp">Luxury Vinyl Plank</option>
        <option value="hardwood">Hardwood</option>
        <option value="carpet">Carpet</option>
        <option value="tile">Tile</option>
        <option value="laminate">Laminate</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Brand & Source</label>
      <input
        type="text"
        value={flooring.brand || ''}
        onChange={(e) => onChange({ ...flooring, brand: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="e.g., Shaw Flooring from Floor & Decor"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Install Year</label>
      <input
        type="number"
        value={flooring.installYear || ''}
        onChange={(e) => onChange({ ...flooring, installYear: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
);

export const CountertopForm = ({ countertop = {}, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
      <input
        type="text"
        value={countertop.room || ''}
        onChange={(e) => onChange({ ...countertop, room: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="e.g., Kitchen"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
      <select
        value={countertop.material || ''}
        onChange={(e) => onChange({ ...countertop, material: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Material</option>
        <option value="granite">Granite</option>
        <option value="quartz">Quartz</option>
        <option value="marble">Marble</option>
        <option value="butcher-block">Butcher Block</option>
        <option value="laminate">Laminate</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Color/Pattern</label>
      <input
        type="text"
        value={countertop.color || ''}
        onChange={(e) => onChange({ ...countertop, color: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="e.g., Calacatta Gold"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
      <input
        type="text"
        value={countertop.supplier || ''}
        onChange={(e) => onChange({ ...countertop, supplier: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="e.g., Stone World"
      />
    </div>
  </div>
);

export const CustomFieldForm = ({ field = {}, onChange, onRemove }) => (
  <div className="border border-gray-200 rounded-lg p-4 mb-4">
    <div className="grid grid-cols-1 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={field.title || ''}
          onChange={(e) => onChange({ ...field, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Deck Replacement"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={field.notes || ''}
          onChange={(e) => onChange({ ...field, notes: e.target.value })}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Add any relevant details..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={field.date || ''}
          onChange={(e) => onChange({ ...field, date: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onRemove}
          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center"
        >
          <SafeIcon icon={FiTrash2} className="w-4 h-4 mr-2" />
          Remove
        </button>
      </div>
    </div>
  </div>
);
```