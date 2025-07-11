import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import CategoryModal from './CategoryModal';
import CategoryEditModal from './CategoryEditModal';
import DeleteCategoryModal from './DeleteCategoryModal';

const { FiPlus, FiTrash2, FiMove, FiEdit2, FiEdit3, FiPrinter, FiDownload, FiX, FiCheck, FiAlertTriangle } = FiIcons;

const EditableCell = ({ 
  initialValue, 
  onSave, 
  isNumeric = true, 
  categoryType, 
  category, 
  month, 
  updateTotals, 
  year,
  cellId,
  onCellFocus,
  onCellBlur,
  onTabPress,
  getFormulaResult,
  propertyFilter
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue || (isNumeric ? '0.00' : ''));
  const [isFormula, setIsFormula] = useState(false);
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setValue(initialValue || (isNumeric ? '0.00' : ''));
    // Check if value is a formula
    if (typeof initialValue === 'string' && initialValue.startsWith('=')) {
      setIsFormula(true);
    }
  }, [initialValue, isNumeric]);
  
  const handleClick = () => {
    // Check if trying to edit All Properties view
    if (propertyFilter === 'all') {
      const confirmed = window.confirm(
        'You are editing the "All Properties" view. This will affect combined data from all properties. Are you sure you want to continue?'
      );
      if (!confirmed) {
        return;
      }
    }
    
    setIsEditing(true);
    if (onCellFocus) {
      onCellFocus(cellId);
    }
  };
  
  const handleBlur = () => {
    setIsEditing(false);
    if (onCellBlur) {
      onCellBlur();
    }
    
    let newValue = value;
    
    // Handle formulas
    if (typeof value === 'string' && value.startsWith('=')) {
      setIsFormula(true);
      const result = getFormulaResult ? getFormulaResult(value) : parseFloat(value.substring(1)) || 0;
      newValue = result;
    } else {
      setIsFormula(false);
      newValue = isNumeric ? parseFloat(value) || 0 : value;
    }
    
    if (onSave) {
      onSave(newValue, value.startsWith('=') ? value : null);
      if (updateTotals) {
        updateTotals(categoryType, category, month, newValue, year);
      }
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setValue(initialValue);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleBlur();
      if (onTabPress) {
        onTabPress(cellId, e.shiftKey);
      }
    }
  };
  
  const displayValue = () => {
    if (isFormula && !isEditing) {
      return `$${parseFloat(value || 0).toFixed(2)}`;
    }
    if (isEditing) {
      return value;
    }
    return isNumeric ? `$${parseFloat(value || 0).toFixed(2)}` : value;
  };
  
  return isEditing ? (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="w-full p-1 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={isNumeric ? "0.00 or =formula" : "Enter text"}
    />
  ) : (
    <div 
      className={`w-full h-full p-1 cursor-pointer hover:bg-blue-50 transition-colors text-right ${isFormula ? 'bg-green-50' : ''}`}
      onClick={handleClick}
      title={isFormula ? `Formula: ${value}` : ''}
    >
      {displayValue()}
    </div>
  );
};

const PrintModal = ({ isOpen, onClose, onPrint, properties, currentYear }) => {
  const [printSettings, setPrintSettings] = useState({
    scale: 70,
    orientation: 'landscape',
    margins: 'minimal',
    years: [currentYear],
    includeHeader: true
  });
  
  // Generate a range of years for selection
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

const ExportDropdown = ({ isOpen, onClose, onExport }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20"
    >
      <div className="py-1">
        <button 
          onClick={() => { onExport('csv'); onClose(); }}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          Export as CSV
        </button>
        <button 
          onClick={() => { onExport('excel'); onClose(); }}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          Export as Excel
        </button>
        <button 
          onClick={() => { onExport('pdf'); onClose(); }}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          Export as PDF
        </button>
      </div>
    </div>
  );
};

// Draggable Row Component
const DraggableRow = ({ 
  category, 
  index, 
  categoryType, 
  months, 
  shouldShowAmount, 
  getCellValue, 
  getCellFormula,
  calculateCategoryTotal,
  handleCellUpdate,
  year,
  generateCellId,
  handleCellFocus,
  handleCellBlur,
  handleTabPress,
  getFormulaResult,
  propertyFilter,
  categoryManagementMode,
  onEdit,
  onDelete,
  isCustomCategory,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragging,
  isDropTarget
}) => {
  const rowRef = useRef(null);
  const [draggedOver, setDraggedOver] = useState(false);
  
  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', ''); // For Firefox compatibility
    onDragStart(index, categoryType);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOver(true);
    onDragOver(index);
  };

  const handleDragLeave = (e) => {
    // Only trigger if leaving the row entirely
    if (!rowRef.current?.contains(e.relatedTarget)) {
      setDraggedOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDraggedOver(false);
    onDrop(index);
  };

  const handleDragEnd = () => {
    setDraggedOver(false);
    onDragEnd();
  };

  const isCustom = isCustomCategory(category, categoryType);
  const canEdit = propertyFilter !== 'all' && isCustom;
  const canDrag = categoryManagementMode && propertyFilter !== 'all' && isCustom;

  return (
    <tr 
      ref={rowRef}
      className={`
        transition-all duration-200 
        ${isDragging ? 'opacity-50 bg-blue-100' : ''} 
        ${draggedOver && !isDragging ? 'bg-blue-50 border-l-4 border-blue-500' : ''} 
        ${canDrag ? 'cursor-move' : ''} 
        hover:bg-gray-50
      `}
      draggable={canDrag}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
    >
      <td className="border p-2 font-medium sticky left-0 bg-white z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {categoryManagementMode && canDrag && (
              <SafeIcon icon={FiMove} className="w-4 h-4 mr-2 text-gray-400" />
            )}
            <span>{category}</span>
          </div>
          {categoryManagementMode && canEdit && (
            <div className="flex items-center space-x-1">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(category, categoryType);
                }}
                className="text-blue-500 hover:text-blue-700 p-1 rounded"
                title="Edit Category"
              >
                <SafeIcon icon={FiEdit3} className="w-3 h-3" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(category, categoryType);
                }}
                className="text-red-500 hover:text-red-700 p-1 rounded"
                title="Delete Category"
              >
                <SafeIcon icon={FiTrash2} className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </td>
      {months.map((month, monthIndex) => {
        const cellId = generateCellId(categoryType, category, month);
        const formula = getCellFormula(categoryType, category, month);
        return (
          <td key={`${category}-${month}`} className="border p-0 relative">
            {shouldShowAmount(monthIndex) ? (
              <div data-cell-id={cellId}>
                <EditableCell
                  initialValue={formula || getCellValue(categoryType, category, month)}
                  onSave={(value, formulaValue) => handleCellUpdate(categoryType, category, month, value, year, formulaValue)}
                  categoryType={categoryType}
                  category={category}
                  month={month}
                  updateTotals={handleCellUpdate}
                  year={year}
                  cellId={cellId}
                  onCellFocus={handleCellFocus}
                  onCellBlur={handleCellBlur}
                  onTabPress={handleTabPress}
                  getFormulaResult={getFormulaResult}
                  propertyFilter={propertyFilter}
                />
              </div>
            ) : (
              <div className="p-1 text-right text-gray-300">-</div>
            )}
          </td>
        );
      })}
      <td className="border p-2 font-medium text-right sticky right-0 bg-white z-10">
        ${calculateCategoryTotal(category, categoryType).toFixed(2)}
      </td>
    </tr>
  );
};

const FinancialSpreadsheetView = ({ transactions, year, propertyFilter }) => {
  const { 
    customCategories, 
    addCustomCategory, 
    deleteCustomCategory, 
    updateCustomCategory,
    reorderCategories, 
    addTransaction,
    saveSpreadsheetData,
    loadSpreadsheetData,
    skipDeleteConfirmation,
    setSkipDeleteConfirmation,
    properties 
  } = useData();
  
  const [cellData, setCellData] = useState({});
  const [cellFormulas, setCellFormulas] = useState({});
  const [categoryManagementMode, setCategoryManagementMode] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCategoryEditModalOpen, setIsCategoryEditModalOpen] = useState(false);
  const [categoryType, setCategoryType] = useState('income');
  const [editingCategory, setEditingCategory] = useState(null);
  const [monthlyTotals, setMonthlyTotals] = useState([]);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState({
    isOpen: false,
    category: null
  });
  
  // Drag and drop state
  const [dragState, setDragState] = useState({
    isDragging: false,
    draggedIndex: null,
    draggedType: null,
    dropTargetIndex: null
  });
  
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [activeCellId, setActiveCellId] = useState(null);
  
  // Define months array
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Get property-specific or combined categories
  const getPropertyCategories = (type) => {
    const baseCategories = type === 'income' 
      ? ['Booking Revenue', 'Cleaning Fees', 'Pet Fees', 'Other Income']
      : ['Mortgage', 'Property Tax', 'Insurance', 'Utilities', 'Cleaning', 'Maintenance', 'Supplies', 'Other Expenses'];
    
    if (propertyFilter === 'all') {
      const allCustomCategories = customCategories[type] || [];
      const uniqueCategories = new Set([...baseCategories]);
      
      allCustomCategories.forEach(category => {
        uniqueCategories.add(category.name);
      });
      
      return Array.from(uniqueCategories);
    } else {
      const propertyCategories = (customCategories[type] || [])
        .filter(category => category.properties.includes(propertyFilter))
        .map(category => category.name);
      
      return [...baseCategories, ...propertyCategories];
    }
  };
  
  const incomeCategories = getPropertyCategories('income');
  const expenseCategories = getPropertyCategories('expense');
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const isCurrentYear = year === currentYear;
  
  // Function to check if we should show amount for this month
  const shouldShowAmount = (monthIndex) => {
    if (!isCurrentYear) return true;
    return monthIndex <= currentMonth;
  };
  
  // Load saved spreadsheet data on component mount and when property/year changes
  useEffect(() => {
    const savedData = loadSpreadsheetData(year);
    if (savedData) {
      if (savedData.values) {
        setCellData(savedData.values);
        setCellFormulas(savedData.formulas || {});
      } else {
        // Legacy format - just values
        setCellData(savedData);
        setCellFormulas({});
      }
    } else {
      initializeFromTransactions();
    }
  }, [year, propertyFilter]);

  // Initialize with transaction data
  const initializeFromTransactions = () => {
    const newCellData = {};
    
    transactions.forEach(transaction => {
      try {
        const date = new Date(transaction.date);
        if (!isNaN(date.getTime())) {
          const transactionYear = date.getFullYear();
          if (transactionYear === year) {
            const month = months[date.getMonth()];
            const type = transaction.type;
            const category = transaction.category;
            const property = transaction.property;
            
            const cellKey = `${year}-${type}-${category}-${month}-${property}`;
            newCellData[cellKey] = (newCellData[cellKey] || 0) + transaction.amount;
          }
        }
      } catch (error) {
        console.error("Error processing transaction:", error);
      }
    });
    
    setCellData(newCellData);
    setCellFormulas({});
  };
  
  // Function to get cell value
  const getCellValue = (categoryType, category, month) => {
    if (propertyFilter === 'all') {
      let total = 0;
      Object.keys(cellData).forEach(key => {
        const [cellYear, cellType, cellCategory, cellMonth, property] = key.split('-');
        if (
          cellYear === year.toString() &&
          cellType === categoryType &&
          cellCategory === category &&
          cellMonth === month
        ) {
          total += cellData[key] || 0;
        }
      });
      return total;
    } else {
      const cellKey = `${year}-${categoryType}-${category}-${month}-${propertyFilter}`;
      return cellData[cellKey] || 0;
    }
  };
  
  // Function to get cell formula
  const getCellFormula = (categoryType, category, month) => {
    if (propertyFilter === 'all') {
      return null; // No formulas for all properties view
    } else {
      const cellKey = `${year}-${categoryType}-${category}-${month}-${propertyFilter}`;
      return cellFormulas[cellKey] || null;
    }
  };
  
  // Simple formula parser
  const getFormulaResult = (formula) => {
    try {
      // Remove the = sign
      const expression = formula.substring(1);
      
      // Basic math operations only for security
      const sanitizedExpression = expression.replace(/[^0-9+\-*/.() ]/g, '');
      
      // Evaluate the expression
      const result = Function('"use strict"; return (' + sanitizedExpression + ')')();
      
      return isNaN(result) ? 0 : result;
    } catch (error) {
      console.error('Formula error:', error);
      return 0;
    }
  };
  
  // Cell navigation
  const generateCellId = (categoryType, category, month) => {
    return `${categoryType}-${category}-${month}`;
  };
  
  const handleCellFocus = (cellId) => {
    setActiveCellId(cellId);
  };
  
  const handleCellBlur = () => {
    setActiveCellId(null);
  };
  
  const handleTabPress = (currentCellId, isShiftPressed) => {
    const allCells = [];
    
    // Build array of all editable cells
    incomeCategories.forEach(category => {
      months.forEach((month, monthIndex) => {
        if (shouldShowAmount(monthIndex)) {
          allCells.push(generateCellId('income', category, month));
        }
      });
    });
    
    expenseCategories.forEach(category => {
      months.forEach((month, monthIndex) => {
        if (shouldShowAmount(monthIndex)) {
          allCells.push(generateCellId('expense', category, month));
        }
      });
    });
    
    const currentIndex = allCells.indexOf(currentCellId);
    let nextIndex;
    
    if (isShiftPressed) {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : allCells.length - 1;
    } else {
      nextIndex = currentIndex < allCells.length - 1 ? currentIndex + 1 : 0;
    }
    
    const nextCellId = allCells[nextIndex];
    if (nextCellId) {
      // Focus the next cell
      setTimeout(() => {
        const nextCell = document.querySelector(`[data-cell-id="${nextCellId}"]`);
        if (nextCell) {
          nextCell.click();
        }
      }, 10);
    }
  };
  
  // Function to get styling for net income values
  const getNetIncomeStyle = (value) => {
    if (value > 0) return 'bg-green-100 text-green-600';
    if (value < 0) return 'bg-red-100 text-red-600';
    return 'bg-gray-100 text-gray-600';
  };
  
  // Calculate initial totals
  useEffect(() => {
    calculateMonthlyTotals();
  }, [cellData, year, incomeCategories, expenseCategories]);
  
  const calculateMonthlyTotals = () => {
    const newMonthlyTotals = months.map((month, monthIndex) => {
      let monthIncome = 0;
      let monthExpenses = 0;

      incomeCategories.forEach(category => {
        const value = getCellValue('income', category, month);
        monthIncome += value;
      });

      expenseCategories.forEach(category => {
        const value = getCellValue('expense', category, month);
        monthExpenses += value;
      });

      return {
        income: monthIncome,
        expenses: monthExpenses,
        net: monthIncome - monthExpenses
      };
    });

    setMonthlyTotals(newMonthlyTotals);
  };

  // Handle cell data update
  const handleCellUpdate = (categoryType, category, month, value, currentYear, formula = null) => {
    if (propertyFilter === 'all') {
      alert('Please select a specific property to edit values');
      return;
    }
    
    const cellKey = `${currentYear}-${categoryType}-${category}-${month}-${propertyFilter}`;
    
    setCellData(prev => {
      const newData = {
        ...prev,
        [cellKey]: value
      };
      
      // Save formulas separately
      const newFormulas = {...cellFormulas};
      if (formula) {
        newFormulas[cellKey] = formula;
      } else {
        delete newFormulas[cellKey];
      }
      setCellFormulas(newFormulas);
      
      // Save both values and formulas
      saveSpreadsheetData(currentYear, {
        values: newData,
        formulas: newFormulas
      });
      
      return newData;
    });
  };

  // Calculate category totals
  const calculateCategoryTotal = (category, categoryType) => {
    return months.reduce((sum, month, monthIndex) => {
      if (shouldShowAmount(monthIndex)) {
        return sum + getCellValue(categoryType, category, month);
      }
      return sum;
    }, 0);
  };

  // Calculate grand totals
  const calculateGrandTotals = () => {
    const visibleMonths = monthlyTotals.slice(0, isCurrentYear ? currentMonth + 1 : 12);
    return {
      income: visibleMonths.reduce((sum, total) => sum + total.income, 0),
      expenses: visibleMonths.reduce((sum, total) => sum + total.expenses, 0),
      net: visibleMonths.reduce((sum, total) => sum + total.net, 0)
    };
  };

  // Drag and Drop Handlers
  const handleDragStart = (index, type) => {
    setDragState({
      isDragging: true,
      draggedIndex: index,
      draggedType: type,
      dropTargetIndex: null
    });
  };

  const handleDragOver = (index) => {
    if (dragState.isDragging) {
      setDragState(prev => ({
        ...prev,
        dropTargetIndex: index
      }));
    }
  };

  const handleDrop = (dropIndex) => {
    if (dragState.isDragging && dragState.draggedIndex !== null && dragState.draggedIndex !== dropIndex) {
      // Perform the reorder
      reorderCategories(dragState.draggedType, propertyFilter, dragState.draggedIndex, dropIndex);
    }
    
    // Reset drag state
    setDragState({
      isDragging: false,
      draggedIndex: null,
      draggedType: null,
      dropTargetIndex: null
    });
  };

  const handleDragEnd = () => {
    setDragState({
      isDragging: false,
      draggedIndex: null,
      draggedType: null,
      dropTargetIndex: null
    });
  };

  const handleAddCategory = (type) => {
    if (propertyFilter === 'all') {
      alert('Please select a specific property to add categories');
      return;
    }
    setCategoryType(type);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category, type) => {
    if (propertyFilter === 'all') {
      alert('Please select a specific property to edit categories');
      return;
    }
    setEditingCategory({ name: category, type, property: propertyFilter });
    setIsCategoryEditModalOpen(true);
  };

  const handleDeleteCategory = (category, type) => {
    if (propertyFilter === 'all') {
      alert('Please select a specific property to delete categories');
      return;
    }
    
    if (skipDeleteConfirmation) {
      deleteCustomCategory(category, type, propertyFilter);
    } else {
      setDeleteConfirmationModal({
        isOpen: true,
        category: { name: category, type }
      });
    }
  };

  const handleConfirmDelete = async (dontShowAgain) => {
    const { category } = deleteConfirmationModal;
    if (dontShowAgain) {
      setSkipDeleteConfirmation(true);
    }
    await deleteCustomCategory(category.name, category.type, propertyFilter);
  };

  const isCustomCategory = (category, type) => {
    const baseCategories = type === 'income' 
      ? ['Booking Revenue', 'Cleaning Fees', 'Pet Fees', 'Other Income']
      : ['Mortgage', 'Property Tax', 'Insurance', 'Utilities', 'Cleaning', 'Maintenance', 'Supplies', 'Other Expenses'];
    
    return !baseCategories.includes(category);
  };

  // Enhanced print function with multi-year support
  const handlePrint = (settings) => {
    const { scale, orientation, margins, years, includeHeader } = settings;
    
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
        
        .print-footer {
          text-align: center;
          margin-top: 20px;
          padding: 10px;
          border-top: 1px solid #ccc;
          font-size: 10px;
          color: #666;
        }
      }
    `;
    
    document.head.appendChild(style);
    
    // Create a container for printing
    const printContainer = document.createElement('div');
    printContainer.className = 'print-container';
    document.body.appendChild(printContainer);
    
    // Get the original spreadsheet content
    const originalContent = document.getElementById('printable-spreadsheet').cloneNode(true);
    
    // For each year, create a copy of the spreadsheet
    years.forEach((printYear, index) => {
      const yearContainer = document.createElement('div');
      yearContainer.className = `print-year year-${printYear}`;
      
      // Add header if needed
      if (includeHeader) {
        const header = document.createElement('div');
        header.className = 'print-header';
        header.innerHTML = `
          <h2>Financial Data ${printYear}</h2>
          <p>Property: ${propertyFilter === 'all' ? 'All Properties' : propertyFilter}</p>
        `;
        yearContainer.appendChild(header);
      }
      
      // Clone the content
      const yearContent = originalContent.cloneNode(true);
      yearContainer.appendChild(yearContent);
      
      // Add to print container
      printContainer.appendChild(yearContainer);
      
      // Add footer
      const footer = document.createElement('div');
      footer.className = 'print-footer';
      footer.innerHTML = `Printed on ${new Date().toLocaleDateString()} - Page ${index + 1} of ${years.length}`;
      yearContainer.appendChild(footer);
    });
    
    // Print
    setTimeout(() => {
      window.print();
      document.body.removeChild(printContainer);
      document.head.removeChild(style);
    }, 100);
  };

  // Export functions
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    csvContent += `Financial Data for ${year} - ${propertyFilter === 'all' ? 'All Properties' : propertyFilter}\n\n`;
    
    csvContent += "Category,";
    months.forEach(month => {
      if (shouldShowAmount(months.indexOf(month))) {
        csvContent += `${month},`;
      }
    });
    csvContent += "Total\n";
    
    csvContent += "INCOME\n";
    incomeCategories.forEach(category => {
      csvContent += `${category},`;
      months.forEach(month => {
        if (shouldShowAmount(months.indexOf(month))) {
          const value = getCellValue('income', category, month);
          csvContent += `${value.toFixed(2)},`;
        }
      });
      csvContent += `${calculateCategoryTotal(category, 'income').toFixed(2)}\n`;
    });
    
    csvContent += "Total Income,";
    monthlyTotals.forEach((total, index) => {
      if (shouldShowAmount(index)) {
        csvContent += `${total.income.toFixed(2)},`;
      }
    });
    csvContent += `${calculateGrandTotals().income.toFixed(2)}\n\n`;
    
    csvContent += "EXPENSES\n";
    expenseCategories.forEach(category => {
      csvContent += `${category},`;
      months.forEach(month => {
        if (shouldShowAmount(months.indexOf(month))) {
          const value = getCellValue('expense', category, month);
          csvContent += `${value.toFixed(2)},`;
        }
      });
      csvContent += `${calculateCategoryTotal(category, 'expense').toFixed(2)}\n`;
    });
    
    csvContent += "Total Expenses,";
    monthlyTotals.forEach((total, index) => {
      if (shouldShowAmount(index)) {
        csvContent += `${total.expenses.toFixed(2)},`;
      }
    });
    csvContent += `${calculateGrandTotals().expenses.toFixed(2)}\n\n`;
    
    csvContent += "Net Income,";
    monthlyTotals.forEach((total, index) => {
      if (shouldShowAmount(index)) {
        csvContent += `${total.net.toFixed(2)},`;
      }
    });
    csvContent += `${calculateGrandTotals().net.toFixed(2)}\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `financial_data_${year}_${propertyFilter === 'all' ? 'all_properties' : propertyFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const csvContent = "data:application/vnd.ms-excel;charset=utf-8,";
    
    let excelContent = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel'>";
    excelContent += "<head><meta charset='UTF-8'></head><body>";
    
    // Add title
    excelContent += `<h1>Financial Data for ${year} - ${propertyFilter === 'all' ? 'All Properties' : propertyFilter}</h1>`;
    
    excelContent += "<table>";
    
    excelContent += "<tr>";
    excelContent += "<th>Category</th>";
    months.forEach(month => {
      if (shouldShowAmount(months.indexOf(month))) {
        excelContent += `<th>${month}</th>`;
      }
    });
    excelContent += "<th>Total</th>";
    excelContent += "</tr>";
    
    excelContent += "<tr><th colspan='14' style='background-color:#e2f0d9; color:#006100; font-weight:bold;'>INCOME</th></tr>";
    
    incomeCategories.forEach(category => {
      excelContent += "<tr>";
      excelContent += `<td>${category}</td>`;
      months.forEach(month => {
        if (shouldShowAmount(months.indexOf(month))) {
          const value = getCellValue('income', category, month);
          excelContent += `<td>$${value.toFixed(2)}</td>`;
        }
      });
      excelContent += `<td>$${calculateCategoryTotal(category, 'income').toFixed(2)}</td>`;
      excelContent += "</tr>";
    });
    
    excelContent += "<tr style='background-color:#e2f0d9; font-weight:bold;'>";
    excelContent += "<td>Total Income</td>";
    monthlyTotals.forEach((total, index) => {
      if (shouldShowAmount(index)) {
        excelContent += `<td>$${total.income.toFixed(2)}</td>`;
      }
    });
    excelContent += `<td>$${calculateGrandTotals().income.toFixed(2)}</td>`;
    excelContent += "</tr>";
    
    excelContent += "<tr><td colspan='14'></td></tr>";
    
    excelContent += "<tr><th colspan='14' style='background-color:#ffd9d9; color:#9c0006; font-weight:bold;'>EXPENSES</th></tr>";
    
    expenseCategories.forEach(category => {
      excelContent += "<tr>";
      excelContent += `<td>${category}</td>`;
      months.forEach(month => {
        if (shouldShowAmount(months.indexOf(month))) {
          const value = getCellValue('expense', category, month);
          excelContent += `<td>$${value.toFixed(2)}</td>`;
        }
      });
      excelContent += `<td>$${calculateCategoryTotal(category, 'expense').toFixed(2)}</td>`;
      excelContent += "</tr>";
    });
    
    excelContent += "<tr style='background-color:#ffd9d9; font-weight:bold;'>";
    excelContent += "<td>Total Expenses</td>";
    monthlyTotals.forEach((total, index) => {
      if (shouldShowAmount(index)) {
        excelContent += `<td>$${total.expenses.toFixed(2)}</td>`;
      }
    });
    excelContent += `<td>$${calculateGrandTotals().expenses.toFixed(2)}</td>`;
    excelContent += "</tr>";
    
    excelContent += "<tr><td colspan='14'></td></tr>";
    
    excelContent += "<tr style='background-color:#ddebf7; font-weight:bold;'>";
    excelContent += "<td>Net Income</td>";
    monthlyTotals.forEach((total, index) => {
      if (shouldShowAmount(index)) {
        const style = total.net >= 0 ? "color:#006100;" : "color:#9c0006;";
        excelContent += `<td style="${style}">$${total.net.toFixed(2)}</td>`;
      }
    });
    const netStyle = calculateGrandTotals().net >= 0 ? "color:#006100;" : "color:#9c0006;";
    excelContent += `<td style="${netStyle}">$${calculateGrandTotals().net.toFixed(2)}</td>`;
    excelContent += "</tr>";
    
    excelContent += "</table></body></html>";
    
    const encodedUri = encodeURI(csvContent + excelContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `financial_data_${year}_${propertyFilter === 'all' ? 'all_properties' : propertyFilter}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    alert('PDF generation requires a PDF library. For now, we recommend printing to PDF using the Print function.');
    setIsPrintModalOpen(true);
  };

  const handleExport = (type) => {
    switch (type) {
      case 'csv':
        exportToCSV();
        break;
      case 'excel':
        exportToExcel();
        break;
      case 'pdf':
        exportToPDF();
        break;
      default:
        break;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white p-6">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Financial Dashboard {year}
          </h2>
          <p className="text-sm text-gray-600">
            {propertyFilter === 'all' 
              ? 'Combined data from all properties' 
              : `Data for ${propertyFilter}`}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2 no-print">
            <button 
              onClick={() => setIsPrintModalOpen(true)}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm flex items-center hover:bg-gray-200"
              title="Print Spreadsheet"
            >
              <SafeIcon icon={FiPrinter} className="w-4 h-4 mr-1" />
              Print
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm flex items-center hover:bg-blue-200"
                title="Export Spreadsheet"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4 mr-1" />
                Export
              </button>
              <ExportDropdown 
                isOpen={isExportDropdownOpen}
                onClose={() => setIsExportDropdownOpen(false)}
                onExport={handleExport}
              />
            </div>
            <button 
              onClick={() => setCategoryManagementMode(!categoryManagementMode)}
              className={`px-3 py-1 rounded-lg text-sm ${
                categoryManagementMode 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <SafeIcon icon={FiEdit2} className="w-4 h-4 inline mr-1" />
              {categoryManagementMode ? 'Exit Management' : 'Manage Categories'}
            </button>
          </div>
        </div>
      </div>

      {/* Warning Banner for All Properties */}
      {propertyFilter === 'all' && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg no-print">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-yellow-700">
              <strong>All Properties View:</strong> You are viewing combined data from all properties. 
              Editing cells will prompt for confirmation as it affects aggregated data. 
              Select a specific property to edit individual property data.
            </p>
          </div>
        </div>
      )}

      {/* Spreadsheet Help */}
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg no-print">
        <p className="text-sm text-green-700">
          <strong>Spreadsheet Tips:</strong> Double-click cells to edit • Use Tab to navigate • Start with = for formulas (e.g., =100+50) • Green cells contain formulas • {categoryManagementMode ? 'Drag custom categories to reorder them' : 'Enable category management to reorder custom categories'}
        </p>
      </div>

      {/* Main Spreadsheet Container */}
      <div id="printable-spreadsheet" className="flex-1 flex flex-col overflow-auto">
        {/* Income Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">Income</h3>
            {categoryManagementMode && (
              <button 
                onClick={() => handleAddCategory('income')}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm flex items-center hover:bg-green-200 no-print"
                disabled={propertyFilter === 'all'}
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
                Add Category
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left w-[200px] min-w-[200px] font-medium sticky left-0 bg-gray-50 z-10">Category</th>
                  {months.map((month, index) => (
                    <th key={month} className={`border p-2 text-center text-sm w-[120px] min-w-[120px] ${!shouldShowAmount(index) ? 'bg-gray-100' : ''}`}>
                      {month.substring(0, 3)}
                    </th>
                  ))}
                  <th className="border p-2 text-center font-medium w-[150px] min-w-[150px] sticky right-0 bg-gray-50 z-10">Total</th>
                </tr>
              </thead>
              <tbody>
                {incomeCategories.map((category, index) => (
                  <DraggableRow
                    key={category}
                    category={category}
                    index={index}
                    categoryType="income"
                    months={months}
                    shouldShowAmount={shouldShowAmount}
                    getCellValue={getCellValue}
                    getCellFormula={getCellFormula}
                    calculateCategoryTotal={calculateCategoryTotal}
                    handleCellUpdate={handleCellUpdate}
                    year={year}
                    generateCellId={generateCellId}
                    handleCellFocus={handleCellFocus}
                    handleCellBlur={handleCellBlur}
                    handleTabPress={handleTabPress}
                    getFormulaResult={getFormulaResult}
                    propertyFilter={propertyFilter}
                    categoryManagementMode={categoryManagementMode}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                    isCustomCategory={isCustomCategory}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    isDragging={dragState.isDragging && dragState.draggedIndex === index && dragState.draggedType === 'income'}
                    isDropTarget={dragState.dropTargetIndex === index && dragState.draggedType === 'income'}
                  />
                ))}
                
                <tr className="bg-green-50 font-bold">
                  <td className="border p-2 font-bold sticky left-0 bg-green-50 z-10">Total Income</td>
                  {monthlyTotals.map((total, index) => (
                    <td key={`income-total-${index}`} className="border p-2 text-right text-green-600">
                      {shouldShowAmount(index) ? `$${total.income.toLocaleString()}` : '-'}
                    </td>
                  ))}
                  <td className="border p-2 text-right text-green-600 sticky right-0 bg-green-50 z-10">
                    ${calculateGrandTotals().income.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">Expenses</h3>
            {categoryManagementMode && (
              <button 
                onClick={() => handleAddCategory('expense')}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm flex items-center hover:bg-red-200 no-print"
                disabled={propertyFilter === 'all'}
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
                Add Category
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left w-[200px] min-w-[200px] font-medium sticky left-0 bg-gray-50 z-10">Category</th>
                  {months.map((month, index) => (
                    <th key={month} className={`border p-2 text-center text-sm w-[120px] min-w-[120px] ${!shouldShowAmount(index) ? 'bg-gray-100' : ''}`}>
                      {month.substring(0, 3)}
                    </th>
                  ))}
                  <th className="border p-2 text-center font-medium w-[150px] min-w-[150px] sticky right-0 bg-gray-50 z-10">Total</th>
                </tr>
              </thead>
              <tbody>
                {expenseCategories.map((category, index) => (
                  <DraggableRow
                    key={category}
                    category={category}
                    index={index}
                    categoryType="expense"
                    months={months}
                    shouldShowAmount={shouldShowAmount}
                    getCellValue={getCellValue}
                    getCellFormula={getCellFormula}
                    calculateCategoryTotal={calculateCategoryTotal}
                    handleCellUpdate={handleCellUpdate}
                    year={year}
                    generateCellId={generateCellId}
                    handleCellFocus={handleCellFocus}
                    handleCellBlur={handleCellBlur}
                    handleTabPress={handleTabPress}
                    getFormulaResult={getFormulaResult}
                    propertyFilter={propertyFilter}
                    categoryManagementMode={categoryManagementMode}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                    isCustomCategory={isCustomCategory}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    isDragging={dragState.isDragging && dragState.draggedIndex === index && dragState.draggedType === 'expense'}
                    isDropTarget={dragState.dropTargetIndex === index && dragState.draggedType === 'expense'}
                  />
                ))}
                
                <tr className="bg-red-50 font-bold">
                  <td className="border p-2 font-bold sticky left-0 bg-red-50 z-10">Total Expenses</td>
                  {monthlyTotals.map((total, index) => (
                    <td key={`expense-total-${index}`} className="border p-2 text-right text-red-600">
                      {shouldShowAmount(index) ? `$${total.expenses.toLocaleString()}` : '-'}
                    </td>
                  ))}
                  <td className="border p-2 text-right text-red-600 sticky right-0 bg-red-50 z-10">
                    ${calculateGrandTotals().expenses.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Net Income Section */}
        <div>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr className="bg-gray-100">
                <td className="border p-2 font-bold w-[200px] min-w-[200px] sticky left-0 bg-gray-100 z-10">Net Income</td>
                {monthlyTotals.map((total, index) => (
                  <td key={`net-${index}`} className={`border p-2 font-bold text-right w-[120px] min-w-[120px] ${shouldShowAmount(index) ? getNetIncomeStyle(total.net) : 'bg-gray-50'}`}>
                    {shouldShowAmount(index) ? `$${total.net.toLocaleString()}` : '-'}
                  </td>
                ))}
                <td className={`border p-2 font-bold text-right w-[150px] min-w-[150px] sticky right-0 z-10 ${getNetIncomeStyle(calculateGrandTotals().net)}`}>
                  ${calculateGrandTotals().net.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <PrintModal 
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        onPrint={handlePrint}
        properties={properties}
        currentYear={year}
      />
      
      <CategoryModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
        type={categoryType}
        propertyFilter={propertyFilter}
      />
      
      <CategoryEditModal 
        isOpen={isCategoryEditModalOpen} 
        onClose={() => setIsCategoryEditModalOpen(false)} 
        category={editingCategory}
      />

      <DeleteCategoryModal
        isOpen={deleteConfirmationModal.isOpen}
        onClose={() => setDeleteConfirmationModal({ isOpen: false, category: null })}
        category={deleteConfirmationModal.category}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default FinancialSpreadsheetView;