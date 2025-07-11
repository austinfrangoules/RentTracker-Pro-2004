import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SheetsView from './views/SheetsView';
import ChartsView from './views/ChartsView';
import MultiPropertySelector from '../components/MultiPropertySelector';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBarChart2, FiGrid } = FiIcons;

const Finances = () => {
  const { properties } = useData();
  const [activeView, setActiveView] = useState('sheets');
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [comparisonType, setComparisonType] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Initialize with all properties selected
  React.useEffect(() => {
    if (properties.length > 0 && selectedProperties.length === 0) {
      setSelectedProperties(properties.map(p => p.name));
    }
  }, [properties, selectedProperties.length]);

  const handlePropertySelectionChange = (newSelection) => {
    setSelectedProperties(newSelection);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
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
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
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

          <MultiPropertySelector
            properties={properties}
            selectedProperties={selectedProperties}
            onSelectionChange={handlePropertySelectionChange}
            className="w-64"
          />

          {activeView === 'charts' && (
            <select
              value={comparisonType}
              onChange={(e) => setComparisonType(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'sheets' ? (
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
        )}
      </div>
    </div>
  );
};

export default Finances;