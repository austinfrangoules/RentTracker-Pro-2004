import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiTool, FiCalendar, FiDollarSign, FiFileText } = FiIcons;

const MaintenanceManagement = ({ property }) => {
  const [records, setRecords] = useState([]);
  const [contractors, setContractors] = useState([]);
  const { supabase } = useData();

  useEffect(() => {
    loadMaintenanceRecords();
    loadContractors();
  }, [property]);

  const loadMaintenanceRecords = async () => {
    const { data, error } = await supabase
      .from('maintenance_records')
      .select(`
        *,
        contractor:contractors (
          name,
          company
        )
      `)
      .eq('property_id', property.id)
      .order('start_date', { ascending: false });

    if (!error) {
      setRecords(data);
    }
  };

  const loadContractors = async () => {
    const { data, error } = await supabase
      .from('contractors')
      .select('*')
      .order('name');

    if (!error) {
      setContractors(data);
    }
  };

  const addMaintenanceRecord = async (recordData) => {
    const { data, error } = await supabase
      .from('maintenance_records')
      .insert([{
        ...recordData,
        property_id: property.id,
        created_by: supabase.auth.user().id
      }]);

    if (!error) {
      loadMaintenanceRecords();
    }
  };

  const updateMaintenanceRecord = async (id, updates) => {
    const { error } = await supabase
      .from('maintenance_records')
      .update(updates)
      .match({ id });

    if (!error) {
      loadMaintenanceRecords();
    }
  };

  const deleteMaintenanceRecord = async (id) => {
    const { error } = await supabase
      .from('maintenance_records')
      .delete()
      .match({ id });

    if (!error) {
      loadMaintenanceRecords();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Maintenance Records</h2>
        <button
          onClick={() => {/* Open add maintenance record modal */}}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <SafeIcon icon={FiPlus} className="mr-2 h-5 w-5" />
          Add Record
        </button>
      </div>

      {/* Records List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {records.map((record) => (
            <motion.li
              key={record.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-4 sm:px-6 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {record.description}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <SafeIcon icon={FiTool} className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {record.contractor.name} - {record.contractor.company}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <SafeIcon icon={FiCalendar} className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <p>
                        {new Date(record.start_date).toLocaleDateString()} - 
                        {record.end_date ? new Date(record.end_date).toLocaleDateString() : 'Ongoing'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <SafeIcon icon={FiDollarSign} className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        ${record.cost.toFixed(2)}
                      </p>
                    </div>
                    {record.notes && (
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <SafeIcon icon={FiFileText} className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <p>{record.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MaintenanceManagement;