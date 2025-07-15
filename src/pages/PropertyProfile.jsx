```jsx
// Add to imports at the top
import PropertyNotes from '../components/PropertyNotes';

// Add to the component's state
const [propertyNotes, setPropertyNotes] = useState({
  generalNotes: '',
  reminders: []
});

// Add handler function inside component
const handleUpdateNotes = (updatedNotes) => {
  setPropertyNotes(updatedNotes);
  // Here you would typically save to your backend
};

// Find the existing tabs section and add a new "notes" tab
<nav className="flex space-x-8 px-6">
  {/* Existing tabs */}
  <button
    onClick={() => setActiveTab('notes')}
    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
      activeTab === 'notes' 
        ? 'border-blue-500 text-blue-600' 
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    <SafeIcon icon={FiFileText} className="w-4 h-4" />
    <span>Notes & Reminders</span>
  </button>
</nav>

{/* Add to the tab content section */}
{activeTab === 'notes' && (
  <div className="space-y-6">
    <PropertyNotes
      notes={propertyNotes}
      onUpdateNotes={handleUpdateNotes}
    />
  </div>
)}
```