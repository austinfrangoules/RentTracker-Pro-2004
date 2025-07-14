import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SheetsView from './views/SheetsView';
import ChartsView from './views/ChartsView';
import MultiPropertyFilter from '../components/MultiPropertyFilter';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBarChart2, FiGrid } = FiIcons;

const Finances = () => {
  const { properties } = useData();
  const [activeView, setActiveView] = useState('sheets');
  const [selectedProperties, setSelectedProperties] = useState(properties.map(p => p.name));
  const [comparisonType, setComparisonType] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Initialize selected properties when properties change
  React.useEffect(() => {
    if (properties.length > 0 && selectedProperties.length === 0) {
      setSelectedProperties(properties.map(p => p.name));
    }
  }, [properties]);

  const handlePropertySelection = (newSelection) => {
    setSelectedProperties(newSelection);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveView('sheets')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeView === 'sheets' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <SafeIcon icon={FiGrid} className="w-4 h-4 inline mr-2" />
            Sheets
          </button>
          <button
            onClick={() => setActiveView('charts')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeView === 'charts' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <SafeIcon icon={FiBarChart2} className="w-4 h-4 inline mr-2" />
            Charts & Analysis
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Year Selection */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            {[...Array(5)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>

          {/* Multi-Property Filter */}
          <MultiPropertyFilter
            properties={properties}
            selectedProperties={selectedProperties}
            onSelectionChange={handlePropertySelection}
          />

          {/* Comparison Type (only for charts view) */}
          {activeView === 'charts' && (
            <select
              value={comparisonType}
              onChange={(e) => setComparisonType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          )}
        </div>
      </div>

      {/* Selection Summary */}
      {selectedProperties.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-700">
              {selectedProperties.length === properties.length 
                ? 'Viewing data for all properties' 
                : selectedProperties.length === 1 
                  ? `Viewing data for ${selectedProperties[0]}`
                  : `Viewing combined data for ${selectedProperties.length} selected properties`
              }
            </div>
            {selectedProperties.length < properties.length && (
              <button
                onClick={() => setSelectedProperties(properties.map(p => p.name))}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Select All
              </button>
            )}
          </div>
        </div>
      )}

      {/* Warning for no properties selected */}
      {selectedProperties.length === 0 && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiIcons.FiAlertTriangle} className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-yellow-700">
              No properties selected. Please select at least one property to view financial data.
            </p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {selectedProperties.length > 0 ? (
          activeView === 'sheets' ? (
            <SheetsView 
              year={selectedYear} 
              selectedProperties={selectedProperties}
            />
          ) : (
            <ChartsView 
              year={selectedYear} 
              selectedProperties={selectedProperties}
              comparisonType={comparisonType}
            />
          )
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <div className="text-6xl text-gray-400 mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Select Properties to View Data
              </h3>
              <p className="text-gray-500 mb-6">
                Choose one or more properties from the filter above to analyze your financial data.
              </p>
              <button
                onClick={() => setSelectedProperties(properties.map(p => p.name))}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                disabled={properties.length === 0}
              >
                {properties.length === 0 ? 'No Properties Available' : 'Select All Properties'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Finances;