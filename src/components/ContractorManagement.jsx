import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiSearch, FiTag, FiStar, FiPhone, FiMail } = FiIcons;

const ContractorManagement = () => {
  const [contractors, setContractors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTags, setFilterTags] = useState([]);
  const { supabase } = useData();

  useEffect(() => {
    loadContractors();
  }, []);

  const loadContractors = async () => {
    const { data, error } = await supabase
      .from('contractors')
      .select('*')
      .order('name');

    if (!error) {
      setContractors(data);
    }
  };

  const addContractor = async (contractorData) => {
    const { data, error } = await supabase
      .from('contractors')
      .insert([contractorData]);

    if (!error) {
      loadContractors();
    }
  };

  const updateContractor = async (id, updates) => {
    const { error } = await supabase
      .from('contractors')
      .update(updates)
      .match({ id });

    if (!error) {
      loadContractors();
    }
  };

  const deleteContractor = async (id) => {
    const { error } = await supabase
      .from('contractors')
      .delete()
      .match({ id });

    if (!error) {
      loadContractors();
    }
  };

  const filteredContractors = contractors.filter(contractor => {
    const matchesSearch = searchTerm === '' || 
      contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.services.some(service => 
        service.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesTags = filterTags.length === 0 ||
      filterTags.every(tag => contractor.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Contractors</h2>
        <button
          onClick={() => {/* Open add contractor modal */}}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <SafeIcon icon={FiPlus} className="mr-2 h-5 w-5" />
          Add Contractor
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <SafeIcon
              icon={FiSearch}
              className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search contractors..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        
        {/* Tag Filter */}
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiTag} className="h-5 w-5 text-gray-400" />
          <select
            multiple
            value={filterTags}
            onChange={(e) => setFilterTags(Array.from(e.target.selectedOptions, option => option.value))}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          >
            {/* Dynamically populated tags */}
          </select>
        </div>
      </div>

      {/* Contractors Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredContractors.map((contractor) => (
          <motion.div
            key={contractor.id}
            className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{contractor.name}</h3>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <SafeIcon
                      key={i}
                      icon={FiStar}
                      className={`h-5 w-5 ${
                        i < contractor.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">{contractor.company}</p>
            </div>
            
            <div className="px-4 py-4 sm:px-6">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <SafeIcon icon={FiPhone} className="mr-2 h-5 w-5" />
                  {contractor.phone}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <SafeIcon icon={FiMail} className="mr-2 h-5 w-5" />
                  {contractor.email}
                </div>
              </div>
            </div>
            
            <div className="px-4 py-4 sm:px-6">
              <div className="flex flex-wrap gap-2">
                {contractor.services.map((service, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
            
            {contractor.notes && (
              <div className="px-4 py-4 sm:px-6">
                <p className="text-sm text-gray-500">{contractor.notes}</p>
              </div>
            )}
            
            <div className="px-4 py-4 sm:px-6">
              <div className="flex flex-wrap gap-2">
                {contractor.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ContractorManagement;