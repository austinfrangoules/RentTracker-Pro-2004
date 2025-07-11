import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiImage, FiFile, FiX, FiEye, FiDownload, FiZap } = FiIcons;

const ReceiptUpload = ({ onReceiptProcessed, existingReceipts = [], isOpen, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [aiResults, setAiResults] = useState(null);

  // Simulated AI processing function
  const processReceiptWithAI = async (file) => {
    setProcessing(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI results - in real implementation, this would call an AI service
    const mockResults = {
      vendor: file.name.includes('home') ? 'Home Depot' : 'Amazon',
      amount: Math.floor(Math.random() * 500) + 50,
      date: new Date().toISOString().split('T')[0],
      category: 'Maintenance',
      items: [
        { description: 'Paint Brushes', quantity: 2, unitPrice: 12.99 },
        { description: 'Wall Paint', quantity: 1, unitPrice: 45.99 }
      ],
      taxAmount: 8.50,
      confidence: 0.92
    };
    
    setAiResults(mockResults);
    setProcessing(false);
    return mockResults;
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    const newFiles = fileArray.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Process first file with AI
    if (newFiles.length > 0) {
      await processReceiptWithAI(newFiles[0].file);
    }
  };

  const removeFile = (id) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
    setAiResults(null);
  };

  const handleConfirmAIResults = () => {
    if (aiResults && onReceiptProcessed) {
      onReceiptProcessed({
        ...aiResults,
        receipts: uploadedFiles.map(f => f.preview)
      });
    }
    handleClose();
  };

  const handleClose = () => {
    setUploadedFiles([]);
    setAiResults(null);
    setProcessing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Upload Receipt</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiX} className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Area */}
              <div className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <SafeIcon icon={FiUpload} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">Drop receipts here</p>
                  <p className="text-sm text-gray-600 mb-4">or click to browse</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleChange}
                    className="hidden"
                    id="receipt-upload"
                  />
                  <label
                    htmlFor="receipt-upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  >
                    Choose Files
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Supports: JPG, PNG, PDF (Max 10MB each)
                  </p>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700">Uploaded Files</h3>
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {file.type.startsWith('image/') ? (
                            <img src={file.preview} alt="" className="w-10 h-10 object-cover rounded" />
                          ) : (
                            <SafeIcon icon={FiFile} className="w-10 h-10 text-gray-400" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                        >
                          <SafeIcon icon={FiX} className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Processing Results */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiZap} className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-medium text-gray-900">AI Receipt Analysis</h3>
                </div>

                {processing && (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-sm text-gray-600">Processing receipt with AI...</p>
                    </div>
                  </div>
                )}

                {aiResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-green-800">Analysis Complete</h4>
                      <span className="text-xs text-green-600">
                        {Math.round(aiResults.confidence * 100)}% confidence
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Vendor</label>
                        <input
                          type="text"
                          value={aiResults.vendor}
                          onChange={(e) => setAiResults(prev => ({ ...prev, vendor: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Amount</label>
                        <input
                          type="number"
                          value={aiResults.amount}
                          onChange={(e) => setAiResults(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          value={aiResults.date}
                          onChange={(e) => setAiResults(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={aiResults.category}
                          onChange={(e) => setAiResults(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="Maintenance">Maintenance</option>
                          <option value="Supplies">Supplies</option>
                          <option value="Utilities">Utilities</option>
                          <option value="Insurance">Insurance</option>
                        </select>
                      </div>
                    </div>

                    {/* Items breakdown */}
                    <div className="mb-4">
                      <h5 className="text-xs font-medium text-gray-700 mb-2">Items</h5>
                      <div className="space-y-1">
                        {aiResults.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-xs text-gray-600">
                            <span>{item.description} (x{item.quantity})</span>
                            <span>${item.unitPrice}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-xs text-gray-600 pt-1 border-t">
                          <span>Tax</span>
                          <span>${aiResults.taxAmount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={handleConfirmAIResults}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                      >
                        Confirm & Add to Expenses
                      </button>
                      <button
                        onClick={() => setAiResults(null)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50"
                      >
                        Edit Manually
                      </button>
                    </div>
                  </motion.div>
                )}

                {!processing && !aiResults && uploadedFiles.length === 0 && (
                  <div className="text-center p-8 text-gray-500">
                    <SafeIcon icon={FiZap} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm">Upload a receipt to see AI analysis</p>
                  </div>
                )}
              </div>
            </div>

            {/* Existing Receipts */}
            {existingReceipts.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Previous Receipts</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {existingReceipts.map((receipt, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={receipt}
                        alt={`Receipt ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                        <button className="p-1 bg-white rounded text-gray-700 hover:bg-gray-100">
                          <SafeIcon icon={FiEye} className="w-4 h-4" />
                        </button>
                        <button className="p-1 bg-white rounded text-gray-700 hover:bg-gray-100">
                          <SafeIcon icon={FiDownload} className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 p-6 border-t">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            {uploadedFiles.length > 0 && !aiResults && (
              <button
                onClick={() => handleConfirmAIResults()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Receipt
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReceiptUpload;