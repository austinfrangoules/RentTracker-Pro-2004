import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PropertyPerformance = ({ properties, transactions }) => {
  const propertyData = properties.map(property => {
    const propertyTransactions = transactions.filter(t => t.property === property.name);
    const income = propertyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = propertyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    return {
      name: property.name.length > 15 ? property.name.substring(0, 15) + '...' : property.name,
      income,
      expenses,
      profit: income - expenses,
      occupancy: property.occupancyRate
    };
  });

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={propertyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value, name) => [
              `$${value.toLocaleString()}`, 
              name === 'income' ? 'Income' : name === 'expenses' ? 'Expenses' : 'Profit'
            ]}
          />
          <Bar dataKey="income" fill="#10b981" name="income" />
          <Bar dataKey="expenses" fill="#ef4444" name="expenses" />
          <Bar dataKey="profit" fill="#3b82f6" name="profit" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PropertyPerformance;