import React from 'react';
import { useData } from '../../context/DataContext';
import PropertyComparisonChart from '../../components/PropertyComparisonChart';
import YearlyComparisonChart from '../../components/YearlyComparisonChart';
import FinancialDetailTable from '../../components/FinancialDetailTable';

const ChartsView = ({ year, propertyFilter, comparisonType }) => {
  const { transactions, properties } = useData();

  return (
    <div className="p-6 space-y-6 overflow-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Property Comparison</h2>
          <PropertyComparisonChart
            transactions={transactions}
            properties={properties}
            year={year}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Financial Trends</h2>
          <YearlyComparisonChart
            transactions={transactions}
            comparisonType={comparisonType}
            propertyFilter={propertyFilter}
            year={year}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Financial Details</h2>
        <FinancialDetailTable
          transactions={transactions.filter(t => {
            const transactionYear = new Date(t.date).getFullYear();
            const propertyMatch = propertyFilter === 'all' || t.property === propertyFilter;
            return transactionYear === year && propertyMatch;
          })}
        />
      </div>
    </div>
  );
};

export default ChartsView;