```jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiCalendar,
  FiClock,
  FiSquare,
  FiCheckSquare,
  FiSave,
  FiX
} = FiIcons;

const PropertyNotes = ({ notes, onUpdateNotes }) => {
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [newReminder, setNewReminder] = useState({
    text: '',
    dueDate: '',
    isChecklist: false,
    completed: false
  });
  const [generalNotes, setGeneralNotes] = useState(notes?.generalNotes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const handleAddReminder = () => {
    if (!newReminder.text.trim()) return;

    const updatedNotes = {
      ...notes,
      reminders: [
        ...(notes?.reminders || []),
        {
          id: Date.now(),
          ...newReminder,
          createdAt: new Date().toISOString()
        }
      ]
    };
    onUpdateNotes(updatedNotes);
    setNewReminder({
      text: '',
      dueDate: '',
      isChecklist: false,
      completed: false
    });
    setIsAddingReminder(false);
  };

  const handleDeleteReminder = (id) => {
    const updatedNotes = {
      ...notes,
      reminders: notes.reminders.filter(r => r.id !== id)
    };
    onUpdateNotes(updatedNotes);
  };

  const handleToggleReminder = (id) => {
    const updatedNotes = {
      ...notes,
      reminders: notes.reminders.map(r =>
        r.id === id ? { ...r, completed: !r.completed } : r
      )
    };
    onUpdateNotes(updatedNotes);
  };

  const handleSaveNotes = () => {
    const updatedNotes = {
      ...notes,
      generalNotes
    };
    onUpdateNotes(updatedNotes);
    setIsEditingNotes(false);
  };

  const formatDueDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* General Notes Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">General Notes</h3>
          {!isEditingNotes ? (
            <button
              onClick={() => setIsEditingNotes(true)}
              className="text-blue-600 hover:text-blue-800"
            >
              <SafeIcon icon={FiEdit2} className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSaveNotes}
              className="text-green-600 hover:text-green-800"
            >
              <SafeIcon icon={FiSave} className="w-4 h-4" />
            </button>
          )}
        </div>
        {isEditingNotes ? (
          <textarea
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Add general notes about the property..."
          />
        ) : (
          <div className="prose prose-sm max-w-none">
            {generalNotes ? (
              <p className="text-gray-600 whitespace-pre-wrap">{generalNotes}</p>
            ) : (
              <p className="text-gray-400 italic">No general notes added yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Reminders Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">Reminders</h3>
          <button
            onClick={() => setIsAddingReminder(true)}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Add Reminder</span>
          </button>
        </div>

        {/* Add New Reminder Form */}
        <AnimatePresence>
          {isAddingReminder && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newReminder.text}
                    onChange={(e) => setNewReminder({ ...newReminder, text: e.target.value })}
                    placeholder="Enter reminder text..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">Due Date (Optional)</label>
                      <input
                        type="month"
                        value={newReminder.dueDate}
                        onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newReminder.isChecklist}
                        onChange={(e) => setNewReminder({ ...newReminder, isChecklist: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">Make checklist item</span>
                    </label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setIsAddingReminder(false)}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddReminder}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Reminder
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reminders List */}
        <div className="space-y-2">
          {notes?.reminders?.length > 0 ? (
            notes.reminders.map((reminder) => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex items-start justify-between p-3 rounded-lg ${
                  reminder.completed ? 'bg-gray-50' : 'bg-white'
                } border border-gray-200`}
              >
                <div className="flex items-start space-x-3">
                  {reminder.isChecklist ? (
                    <button
                      onClick={() => handleToggleReminder(reminder.id)}
                      className={`mt-1 ${reminder.completed ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      <SafeIcon
                        icon={reminder.completed ? FiCheckSquare : FiSquare}
                        className="w-4 h-4"
                      />
                    </button>
                  ) : (
                    <SafeIcon icon={FiClock} className="w-4 h-4 mt-1 text-gray-400" />
                  )}
                  <div>
                    <p className={`text-sm ${reminder.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                      {reminder.text}
                    </p>
                    {reminder.dueDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        <SafeIcon icon={FiCalendar} className="w-3 h-3 inline mr-1" />
                        Due: {formatDueDate(reminder.dueDate)}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteReminder(reminder.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No reminders added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyNotes;
```