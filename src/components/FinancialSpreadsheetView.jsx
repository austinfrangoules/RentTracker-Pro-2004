import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import CategoryModal from './CategoryModal';
import CategoryEditModal from './CategoryEditModal';
import DeleteCategoryModal from './DeleteCategoryModal';

const { FiPlus, FiTrash2, FiMove, FiEdit2, FiEdit3, FiPrinter, FiDownload, FiX, FiCheck, FiAlertTriangle } = FiIcons;

// Enhanced Print Modal Component
const PrintModal = ({ isOpen, onClose, onPrint, properties, currentYear }) => {
  const [printSettings, setPrintSettings] = useState({
    scale: 70,
    orientation: 'landscape',
    margins: 'minimal',
    years: [currentYear],
    includeHeader: true,
    includeFooter: true,
    includeUserInfo: true
  });

  const availableYears = [];
  for (let i = currentYear - 4; i <= currentYear; i++) {
    availableYears.push(i);
  }

  const handlePrint = () => {
    onPrint(printSettings);
    onClose();
  };

  const toggleYearSelection = (year) => {
    setPrintSettings(prev => {
      if (prev.years.includes(year)) {
        return { ...prev, years: prev.years.filter(y => y !== year) };
      } else {
        return { ...prev, years: [...prev.years, year].sort() };
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Print Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scale ({printSettings.scale}%)
            </label>
            <input
              type="range"
              min="30"
              max="100"
              value={printSettings.scale}
              onChange={(e) => setPrintSettings(prev => ({ ...prev, scale: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>30%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orientation
            </label>
            <select
              value={printSettings.orientation}
              onChange={(e) => setPrintSettings(prev => ({ ...prev, orientation: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="landscape">Landscape (Recommended)</option>
              <option value="portrait">Portrait</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Margins
            </label>
            <select
              value={printSettings.margins}
              onChange={(e) => setPrintSettings(prev => ({ ...prev, margins: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="minimal">Minimal</option>
              <option value="normal">Normal</option>
              <option value="none">None</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years to Include
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableYears.map(year => (
                <div key={year} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`year-${year}`}
                    checked={printSettings.years.includes(year)}
                    onChange={() => toggleYearSelection(year)}
                    className="mr-2"
                  />
                  <label htmlFor={`year-${year}`} className="text-sm text-gray-700">{year}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="include-header"
              checked={printSettings.includeHeader}
              onChange={() => setPrintSettings(prev => ({ ...prev, includeHeader: !prev.includeHeader }))}
              className="mr-2"
            />
            <label htmlFor="include-header" className="text-sm text-gray-700">
              Include header with property name and year
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="include-footer"
              checked={printSettings.includeFooter}
              onChange={() => setPrintSettings(prev => ({ ...prev, includeFooter: !prev.includeFooter }))}
              className="mr-2"
            />
            <label htmlFor="include-footer" className="text-sm text-gray-700">
              Include footer with date, time, and user info (like QuickBooks)
            </label>
          </div>
        </div>

        <div className="flex space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Print
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Enhanced print function with QuickBooks-style footer
const handlePrint = (settings) => {
  const { scale, orientation, margins, years, includeHeader, includeFooter } = settings;
  const currentUser = "John Doe"; // Get from auth context
  const currentDateTime = new Date().toLocaleString();
  
  const style = document.createElement('style');
  const marginMap = {
    none: '0',
    minimal: '0.5in',
    normal: '1in'
  };

  style.innerHTML = `
    @media print {
      @page {
        size: ${orientation};
        margin: ${marginMap[margins]};
      }
      
      body * {
        visibility: hidden;
      }
      
      .print-container, .print-container * {
        visibility: visible;
      }
      
      .print-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        transform: scale(${scale / 100});
        transform-origin: top left;
      }
      
      .print-header {
        text-align: center;
        margin-bottom: 20px;
        padding: 10px;
        border-bottom: 1px solid #ccc;
      }
      
      .print-footer {
        text-align: center;
        margin-top: 20px;
        padding: 10px;
        border-top: 1px solid #ccc;
        font-size: 10px;
        color: #666;
        page-break-inside: avoid;
      }
      
      .print-year {
        page-break-before: always;
      }
      
      .print-year:first-child {
        page-break-before: avoid;
      }
      
      .no-print {
        display: none !important;
      }
      
      table {
        border-collapse: collapse;
        width: 100%;
        font-size: ${scale < 60 ? '10px' : '12px'};
      }
      
      th, td {
        border: 1px solid #333 !important;
        padding: ${scale < 60 ? '2px' : '4px'} !important;
        text-align: center;
      }
      
      th {
        background-color: #f0f0f0 !important;
        font-weight: bold;
      }
      
      .sticky {
        position: static !important;
      }
    }
  `;

  document.head.appendChild(style);

  const printContainer = document.createElement('div');
  printContainer.className = 'print-container';
  document.body.appendChild(printContainer);

  const originalContent = document.getElementById('printable-spreadsheet').cloneNode(true);

  years.forEach((printYear, index) => {
    const yearContainer = document.createElement('div');
    yearContainer.className = `print-year year-${printYear}`;

    if (includeHeader) {
      const header = document.createElement('div');
      header.className = 'print-header';
      header.innerHTML = `
        <h2>Financial Data ${printYear}</h2>
        <p>Property: ${propertyFilter === 'all' ? 'All Properties' : propertyFilter}</p>
      `;
      yearContainer.appendChild(header);
    }

    const yearContent = originalContent.cloneNode(true);
    yearContainer.appendChild(yearContent);

    if (includeFooter) {
      const footer = document.createElement('div');
      footer.className = 'print-footer';
      footer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>Printed by: ${currentUser}</span>
          <span>RentTracker Pro - Page ${index + 1} of ${years.length}</span>
          <span>${currentDateTime}</span>
        </div>
      `;
      yearContainer.appendChild(footer);
    }

    printContainer.appendChild(yearContainer);
  });

  setTimeout(() => {
    window.print();
    document.body.removeChild(printContainer);
    document.head.removeChild(style);
  }, 100);
};

// Rest of the component remains the same...
const FinancialSpreadsheetView = ({ transactions, year, propertyFilter }) => {
  // ... existing component code
};

export default FinancialSpreadsheetView;