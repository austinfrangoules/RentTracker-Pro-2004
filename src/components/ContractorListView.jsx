import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit2, FiTrash2, FiClock } = FiIcons;

const ContractorListView = ({ contractors, onEdit, onViewHistory, onViewProfile }) => {
  const { deleteContractor } = useData();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this contractor?')) {
      deleteContractor(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contractor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Services
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service History
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                View History
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contractors.map((contractor) => (
              <motion.tr 
                key={contractor.id} 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <button
                        onClick={() => onViewProfile(contractor)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {contractor.name}
                      </button>
                      <div className="text-sm text-gray-500">{contractor.company}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {contractor.services?.slice(0, 2).map((service, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {service}
                      </span>
                    ))}
                    {contractor.services?.length > 2 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{contractor.services.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{contractor.phone}</div>
                  <div>{contractor.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm text-gray-900">
                      {contractor.serviceHistory?.length || 0} records
                    </div>
                    {contractor.lastWorked && (
                      <div className="ml-2 text-xs text-gray-500">
                        Last: {new Date(contractor.lastWorked).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onViewHistory(contractor)}
                    className="inline-flex items-center px-3 py-1.5 border border-purple-300 text-purple-700 bg-purple-50 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
                  >
                    <SafeIcon icon={FiClock} className="w-4 h-4 mr-1.5" />
                    View History
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(contractor)}
                      className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg"
                      title="Edit"
                    >
                      <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(contractor.id)}
                      className="text-red-600 hover:bg-red-100 p-2 rounded-lg"
                      title="Delete"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractorListView;