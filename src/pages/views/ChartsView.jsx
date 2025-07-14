import React from 'react';
import { useData } from '../../context/DataContext';
import PropertyComparisonChart from '../../components/PropertyComparisonChart';
import YearlyComparisonChart from '../../components/YearlyComparisonChart';
import FinancialDetailTable from '../../components/FinancialDetailTable';

const ChartsView = ({ year, selectedProperties, comparisonType }) => {
  const { transactions, properties } = useData();

  // Filter transactions for selected properties
  const filteredTransactions = transactions.filter(t => {
    const transactionYear = new Date(t.date).getFullYear();
    const propertyMatch = selectedProperties.includes(t.property);
    return transactionYear === year && propertyMatch;
  });

  // Filter properties for selected ones
  const filteredProperties = properties.filter(p => selectedProperties.includes(p.name));

  const getPropertyFilterDisplay = () => {
    if (selectedProperties.length === 0) {
      return 'No Properties';
    } else if (selectedProperties.length === 1) {
      return selectedProperties[0];
    } else if (selectedProperties.length === properties.length) {
      return 'All Properties';
    } else {
      return `${selectedProperties.length} Properties`;
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-auto">
      {/* Summary Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Financial Analysis - {year}
            </h2>
            <p className="text-sm text-gray-600">
              Viewing data for: {getPropertyFilterDisplay()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Property Comparison</h2>
          <PropertyComparisonChart 
            transactions={filteredTransactions} 
            properties={filteredProperties} 
            year={year} 
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Financial Trends</h2>
          <YearlyComparisonChart 
            transactions={filteredTransactions} 
            comparisonType={comparisonType} 
            propertyFilter={getPropertyFilterDisplay()}
            year={year} 
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Financial Details</h2>
        <FinancialDetailTable transactions={filteredTransactions} />
      </div>
    </div>
  );
};

export default ChartsView;