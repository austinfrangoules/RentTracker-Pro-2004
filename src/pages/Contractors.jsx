import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import ContractorCard from '../components/ContractorCard';
import ContractorModal from '../components/ContractorModal';
import ServiceHistoryModal from '../components/ServiceHistoryModal';
import ServiceSelectionModal from '../components/ServiceSelectionModal';
import ContractorListView from '../components/ContractorListView';
import ContractorProfileModal from '../components/ContractorProfileModal';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiPlus, FiSearch, FiFilter, FiX, FiTag, FiBriefcase, 
  FiGrid, FiList, FiTool 
} = FiIcons;

const Contractors = () => {
  const { contractors } = useData();
  const [isContractorModalOpen, setIsContractorModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isServiceSelectionModalOpen, setIsServiceSelectionModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedProfessions, setSelectedProfessions] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique tags and professions from all contractors
  const allTags = [...new Set(contractors.flatMap(c => c.tags || []))].sort();
  const allProfessions = [...new Set(contractors.flatMap(c => c.services || []))].sort();

  // Filter contractors based on all criteria
  const filteredContractors = contractors.filter(contractor => {
    const matchesSearch = searchTerm === '' || 
      contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.services?.some(service => 
        service.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      contractor.tags?.some(tag => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => contractor.tags?.includes(tag));

    const matchesProfessions = selectedProfessions.length === 0 || 
      selectedProfessions.some(prof => contractor.services?.includes(prof));

    return matchesSearch && matchesTags && matchesProfessions;
  });

  const handleAddService = () => {
    setIsServiceSelectionModalOpen(true);
  };

  const handleAddContractor = () => {
    setSelectedContractor(null);
    setIsContractorModalOpen(true);
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleProfessionToggle = (profession) => {
    setSelectedProfessions(prev => 
      prev.includes(profession) 
        ? prev.filter(p => p !== profession) 
        : [...prev, profession]
    );
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSelectedProfessions([]);
    setSearchTerm('');
  };

  const handleViewProfile = (contractor) => {
    setSelectedContractor(contractor);
    setIsProfileModalOpen(true);
  };

  const handleEditContractor = (contractor) => {
    setSelectedContractor(contractor);
    setIsProfileModalOpen(false);
    setIsContractorModalOpen(true);
  };

  const handleViewHistory = (contractor) => {
    setSelectedContractor(contractor);
    setIsServiceModalOpen(true);
  };

  const activeFiltersCount = selectedTags.length + selectedProfessions.length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Contractors</h1>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddService}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          >
            <SafeIcon icon={FiTool} className="w-5 h-5" />
            <span>Add Service</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddContractor}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            <span>Add Contractor</span>
          </motion.button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <div className="flex-1 min-w-0 max-w-2xl mr-4">
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
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={FiX} className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <SafeIcon icon={FiGrid} className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <SafeIcon icon={FiList} className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters || activeFiltersCount > 0 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={FiFilter} className="w-4 h-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {(selectedTags.length > 0 || selectedProfessions.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedProfessions.map(profession => (
              <span
                key={profession}
                className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                <SafeIcon icon={FiBriefcase} className="w-3 h-3" />
                <span>{profession}</span>
                <button
                  onClick={() => handleProfessionToggle(profession)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <SafeIcon icon={FiX} className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedTags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center space-x-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
              >
                <SafeIcon icon={FiTag} className="w-3 h-3" />
                <span>{tag}</span>
                <button
                  onClick={() => handleTagToggle(tag)}
                  className="hover:bg-purple-200 rounded-full p-0.5"
                >
                  <SafeIcon icon={FiX} className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Filter Options */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 border-t pt-4"
          >
            {/* Services Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <SafeIcon icon={FiBriefcase} className="w-4 h-4 mr-2" />
                Filter by Service Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {allProfessions.map(profession => (
                  <button
                    key={profession}
                    onClick={() => handleProfessionToggle(profession)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedProfessions.includes(profession)
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                        : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    {profession}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <SafeIcon icon={FiTag} className="w-4 h-4 mr-2" />
                Filter by Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-purple-100 text-purple-800 border-2 border-purple-300'
                        : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Results Section */}
      {filteredContractors.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContractors.map((contractor) => (
              <ContractorCard
                key={contractor.id}
                contractor={contractor}
                onEdit={() => handleEditContractor(contractor)}
                onViewHistory={() => handleViewHistory(contractor)}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <ContractorListView
            contractors={filteredContractors}
            onEdit={handleEditContractor}
            onViewHistory={handleViewHistory}
            onViewProfile={handleViewProfile}
          />
        )
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          {contractors.length === 0 ? (
            <>
              <div className="text-gray-400 text-6xl mb-4">👷</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No contractors yet</h3>
              <p className="text-gray-500 mb-6">Add your first contractor to get started</p>
              <button
                onClick={handleAddContractor}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Add Your First Contractor
              </button>
            </>
          ) : (
            <>
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No contractors found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </>
          )}
        </div>
      )}

      {/* Modals */}
      <ContractorModal
        isOpen={isContractorModalOpen}
        onClose={() => {
          setIsContractorModalOpen(false);
          setSelectedContractor(null);
        }}
        contractor={selectedContractor}
      />
      
      <ServiceHistoryModal
        isOpen={isServiceModalOpen}
        onClose={() => {
          setIsServiceModalOpen(false);
          setSelectedContractor(null);
        }}
        contractor={selectedContractor}
      />
      
      <ServiceSelectionModal
        isOpen={isServiceSelectionModalOpen}
        onClose={() => setIsServiceSelectionModalOpen(false)}
      />
      
      <ContractorProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedContractor(null);
        }}
        contractor={selectedContractor}
        onEdit={handleEditContractor}
      />
    </div>
  );
};

export default Contractors;