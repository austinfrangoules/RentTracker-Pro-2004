import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiExternalLink, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiMove, 
  FiX, 
  FiSave, 
  FiLink,
  FiLock,
  FiThermometer,
  FiVideo,
  FiHome,
  FiGlobe
} = FiIcons;

// Get icon for specific platform types
const getLinkIcon = (type) => {
  switch (type) {
    case 'airbnb':
      return FiHome;
    case 'vrbo':
      return FiHome;
    case 'booking.com':
      return FiHome;
    case 'direct':
      return FiGlobe;
    case 'lock':
      return FiLock;
    case 'thermostat':
      return FiThermometer;
    case 'camera':
      return FiVideo;
    default:
      return FiLink;
  }
};

const LinkItem = ({ link, onEdit, onDelete, onReorder, index, total }) => {
  const dragRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setIsDragging(true);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    onReorder(fromIndex, index);
  };

  const IconComponent = getLinkIcon(link.type);

  return (
    <motion.div 
      ref={dragRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-between p-4 border rounded-lg ${isDragging ? 'border-blue-400 bg-blue-50 shadow-lg' : 'border-gray-200 bg-white'}`}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${link.type === 'airbnb' ? 'bg-red-100 text-red-600' : link.type === 'vrbo' ? 'bg-blue-100 text-blue-600' : link.type === 'booking.com' ? 'bg-purple-100 text-purple-600' : link.type === 'lock' ? 'bg-green-100 text-green-600' : link.type === 'thermostat' ? 'bg-yellow-100 text-yellow-600' : link.type === 'camera' ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-600'}`}>
          <SafeIcon icon={IconComponent} className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{link.label}</h3>
          <p className="text-sm text-gray-500 truncate">{link.url}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 ml-2">
        <a 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
          title="Open link"
        >
          <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
        </a>
        <button 
          onClick={() => onEdit(link)} 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Edit"
        >
          <SafeIcon icon={FiEdit2} className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDelete(link.id)} 
          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
          title="Delete"
        >
          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
        </button>
        <div 
          className="p-2 text-gray-400 cursor-move"
          title="Drag to reorder"
        >
          <SafeIcon icon={FiMove} className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
};

const LinkModal = ({ isOpen, onClose, link, onSave }) => {
  const [formData, setFormData] = useState({
    id: '',
    label: '',
    url: '',
    type: 'other'
  });

  const linkTypes = [
    { value: 'airbnb', label: 'Airbnb Listing' },
    { value: 'vrbo', label: 'VRBO Listing' },
    { value: 'booking.com', label: 'Booking.com Listing' },
    { value: 'direct', label: 'Direct Booking Website' },
    { value: 'lock', label: 'Smart Lock Dashboard' },
    { value: 'thermostat', label: 'Smart Thermostat App' },
    { value: 'camera', label: 'Security Camera' },
    { value: 'other', label: 'Other' }
  ];

  // Set initial form data when link prop changes
  React.useEffect(() => {
    if (link) {
      setFormData(link);
    } else {
      setFormData({
        id: Date.now().toString(),
        label: '',
        url: '',
        type: 'other'
      });
    }
  }, [link, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If type changes and label is empty or matches a previous type label, update label too
    if (name === 'type' && (!formData.label || linkTypes.some(t => t.value === formData.type && t.label === formData.label))) {
      const selectedType = linkTypes.find(t => t.value === value);
      if (selectedType) {
        setFormData(prev => ({
          ...prev,
          label: selectedType.label
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate URL format
    try {
      new URL(formData.url);
    } catch (e) {
      if (!formData.url.startsWith('http')) {
        // Try adding https:// prefix and validate again
        try {
          new URL(`https://${formData.url}`);
          formData.url = `https://${formData.url}`;
        } catch (e) {
          alert('Please enter a valid URL');
          return;
        }
      } else {
        alert('Please enter a valid URL');
        return;
      }
    }
    
    onSave(formData);
    onClose();
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
          <h2 className="text-xl font-semibold text-gray-800">
            {link ? 'Edit Link' : 'Add New Link'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {linkTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Label
            </label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Airbnb Listing, Smart Lock Dashboard"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter the full URL including https://
            </p>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiSave} className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const PropertyExternalLinks = ({ propertyId, links, onUpdateLinks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [propertyLinks, setPropertyLinks] = useState(links || []);
  
  // Update links if prop changes
  React.useEffect(() => {
    setPropertyLinks(links || []);
  }, [links]);
  
  const handleAddLink = () => {
    setSelectedLink(null);
    setIsModalOpen(true);
  };
  
  const handleEditLink = (link) => {
    setSelectedLink(link);
    setIsModalOpen(true);
  };
  
  const handleDeleteLink = (linkId) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      const updatedLinks = propertyLinks.filter(link => link.id !== linkId);
      setPropertyLinks(updatedLinks);
      onUpdateLinks(updatedLinks);
    }
  };
  
  const handleSaveLink = (linkData) => {
    let updatedLinks;
    
    if (selectedLink) {
      // Edit existing link
      updatedLinks = propertyLinks.map(link => 
        link.id === linkData.id ? linkData : link
      );
    } else {
      // Add new link
      updatedLinks = [...propertyLinks, linkData];
    }
    
    setPropertyLinks(updatedLinks);
    onUpdateLinks(updatedLinks);
  };
  
  const handleReorderLinks = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    
    const updatedLinks = [...propertyLinks];
    const [movedItem] = updatedLinks.splice(fromIndex, 1);
    updatedLinks.splice(toIndex, 0, movedItem);
    
    setPropertyLinks(updatedLinks);
    onUpdateLinks(updatedLinks);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800">External Links & Apps</h3>
        <button
          onClick={handleAddLink}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>Add Link</span>
        </button>
      </div>
      
      <div className="space-y-3">
        {propertyLinks.length > 0 ? (
          <div className="space-y-3">
            {propertyLinks.map((link, index) => (
              <LinkItem
                key={link.id}
                link={link}
                onEdit={handleEditLink}
                onDelete={handleDeleteLink}
                onReorder={handleReorderLinks}
                index={index}
                total={propertyLinks.length}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <SafeIcon icon={FiLink} className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-gray-600 font-medium mb-2">No External Links</h3>
            <p className="text-gray-500 mb-4">
              Add links to listing platforms, smart home apps, and more.
            </p>
            <button
              onClick={handleAddLink}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Add Your First Link
            </button>
          </div>
        )}
      </div>
      
      <LinkModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        link={selectedLink}
        onSave={handleSaveLink}
      />
    </div>
  );
};

export default PropertyExternalLinks;