import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import ContractorModal from './ContractorModal';
import ServiceHistoryModal from './ServiceHistoryModal';

const { FiX, FiPlus, FiSearch, FiUser, FiArrowRight, FiBriefcase, FiTool } = FiIcons;

const ServiceSelectionModal = ({ isOpen, onClose }) => {
  const { contractors } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [showAddContractor, setShowAddContractor] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [newContractor, setNewContractor] = useState(null);

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedContractor(null);
    }
  }, [isOpen]);

  // Filter contractors based on search
  const filteredContractors = contractors.filter(contractor => 
    contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    contractor.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.services?.some(service => 
      service.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleContractorSelect = (contractor) => {
    setSelectedContractor(contractor);
    setShowServiceModal(true);
  };

  const handleNewContractorAdded = (contractor) => {
    setNewContractor(contractor);
    setShowAddContractor(false);
    setShowServiceModal(true);
  };

  const handleServiceModalClose = () => {
    setShowServiceModal(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Add New Service
              </h2>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>
            
            {/* Main Content */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Choose a Contractor
                </h3>
                <div className="relative">
                  <SafeIcon 
                    icon={FiSearch} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search contractors..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              {/* Contractors List */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto mb-6">
                {filteredContractors.length > 0 ? (
                  filteredContractors.map((contractor) => (
                    <button
                      key={contractor.id}
                      onClick={() => handleContractorSelect(contractor)}
                      className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-medium text-gray-900">{contractor.name}</h4>
                          {contractor.company && (
                            <p className="text-sm text-gray-500">{contractor.company}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-400">
                        {contractor.services?.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <SafeIcon icon={FiBriefcase} className="w-4 h-4" />
                            <span className="text-sm">{contractor.services.length} services</span>
                          </div>
                        )}
                        <SafeIcon 
                          icon={FiArrowRight} 
                          className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" 
                        />
                      </div>
                    </button>
                  ))
                ) : searchTerm ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <SafeIcon icon={FiSearch} className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">No contractors found matching "{searchTerm}"</p>
                    <button
                      onClick={() => setShowAddContractor(true)}
                      className="mt-4 text-blue-600 hover:text-blue-800"
                    >
                      Add a new contractor instead
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <SafeIcon icon={FiTool} className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">No contractors in your database yet</p>
                  </div>
                )}
              </div>
              
              {/* Add New Contractor Button */}
              <button
                onClick={() => setShowAddContractor(true)}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2 text-blue-600"
              >
                <SafeIcon icon={FiPlus} className="w-5 h-5" />
                <span>Add New Contractor</span>
              </button>
            </div>
          </motion.div>
          
          {/* Contractor Modal */}
          <ContractorModal
            isOpen={showAddContractor}
            onClose={() => setShowAddContractor(false)}
            onSave={handleNewContractorAdded}
          />
          
          {/* Service Modal */}
          <ServiceHistoryModal
            isOpen={showServiceModal}
            onClose={handleServiceModalClose}
            contractor={selectedContractor || newContractor}
          />
        </div>
      )}
    </AnimatePresence>
  );
};

export default ServiceSelectionModal;