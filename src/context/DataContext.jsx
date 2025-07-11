import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [properties, setProperties] = useState([
    {
      id: 1,
      name: 'Oceanview Apartment',
      address: '123 Beach Ave, Miami, FL',
      status: 'occupied',
      monthlyRevenue: 3200,
      occupancyRate: 85,
      nextCheckout: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop',
      cleaningFee: 150,
      petFee: 50,
      totalBookings: 12,
      averageNightly: 185,
      expenses: 850,
      profit: 2350
    },
    {
      id: 2,
      name: 'Downtown Loft',
      address: '456 City Center, Austin, TX',
      status: 'vacant',
      monthlyRevenue: 2800,
      occupancyRate: 78,
      nextCheckout: null,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop',
      cleaningFee: 125,
      petFee: 40,
      totalBookings: 8,
      averageNightly: 160,
      expenses: 720,
      profit: 2080
    },
    {
      id: 3,
      name: 'Mountain Cabin',
      address: '789 Pine Ridge, Aspen, CO',
      status: 'maintenance',
      monthlyRevenue: 4500,
      occupancyRate: 92,
      nextCheckout: '2024-01-20',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop',
      cleaningFee: 200,
      petFee: 75,
      totalBookings: 15,
      averageNightly: 275,
      expenses: 1200,
      profit: 3300
    }
  ]);

  const [bookings, setBookings] = useState([
    {
      id: 1,
      propertyId: 1,
      propertyName: 'Oceanview Apartment',
      guestName: 'John Smith',
      checkIn: '2024-01-10',
      checkOut: '2024-01-15',
      nights: 5,
      rate: 185,
      cleaningFee: 150,
      petFee: 0,
      total: 1075,
      platform: 'Airbnb',
      status: 'confirmed'
    },
    {
      id: 2,
      propertyId: 2,
      propertyName: 'Downtown Loft',
      guestName: 'Sarah Johnson',
      checkIn: '2024-01-12',
      checkOut: '2024-01-16',
      nights: 4,
      rate: 160,
      cleaningFee: 125,
      petFee: 40,
      total: 805,
      platform: 'VRBO',
      status: 'confirmed'
    },
    {
      id: 3,
      propertyId: 3,
      propertyName: 'Mountain Cabin',
      guestName: 'Mike Wilson',
      checkIn: '2024-01-18',
      checkOut: '2024-01-22',
      nights: 4,
      rate: 275,
      cleaningFee: 200,
      petFee: 75,
      total: 1375,
      platform: 'Airbnb',
      status: 'pending'
    }
  ]);

  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: 'Towels',
      category: 'Linens',
      currentStock: 24,
      minStock: 15,
      maxStock: 50,
      unitCost: 12.99,
      supplier: 'Hotel Supply Co',
      lastRestocked: '2024-01-10'
    },
    {
      id: 2,
      name: 'Toilet Paper',
      category: 'Bathroom',
      currentStock: 8,
      minStock: 20,
      maxStock: 100,
      unitCost: 1.25,
      supplier: 'Bulk Essentials',
      lastRestocked: '2024-01-05'
    },
    {
      id: 3,
      name: 'Coffee Pods',
      category: 'Kitchen',
      currentStock: 45,
      minStock: 25,
      maxStock: 80,
      unitCost: 0.85,
      supplier: 'Coffee Direct',
      lastRestocked: '2024-01-12'
    },
    {
      id: 4,
      name: 'Bed Sheets',
      category: 'Linens',
      currentStock: 18,
      minStock: 12,
      maxStock: 30,
      unitCost: 29.99,
      supplier: 'Luxury Linens',
      lastRestocked: '2024-01-08'
    }
  ]);

  // Enhanced transactions with more data spanning multiple years
  const [transactions, setTransactions] = useState([
    // 2023 Transactions
    { id: 101, date: '2023-01-15', type: 'income', category: 'Booking Revenue', amount: 950, description: 'January Booking - Oceanview Apartment', property: 'Oceanview Apartment', platform: 'Airbnb' },
    { id: 102, date: '2023-01-20', type: 'expense', category: 'Cleaning', amount: 75, description: 'Cleaning service after checkout', property: 'Oceanview Apartment' },
    { id: 103, date: '2023-02-10', type: 'income', category: 'Booking Revenue', amount: 1200, description: 'February Booking - Mountain Cabin', property: 'Mountain Cabin', platform: 'VRBO' },
    { id: 104, date: '2023-02-15', type: 'expense', category: 'Utilities', amount: 180, description: 'Electric and water bill', property: 'Mountain Cabin' },
    { id: 105, date: '2023-03-05', type: 'income', category: 'Booking Revenue', amount: 870, description: 'March Booking - Downtown Loft', property: 'Downtown Loft', platform: 'Airbnb' },
    { id: 106, date: '2023-03-25', type: 'expense', category: 'Maintenance', amount: 350, description: 'Plumbing repair', property: 'Downtown Loft' },
    { id: 107, date: '2023-04-10', type: 'income', category: 'Booking Revenue', amount: 1050, description: 'April Booking - Oceanview Apartment', property: 'Oceanview Apartment', platform: 'VRBO' },
    { id: 108, date: '2023-05-15', type: 'income', category: 'Booking Revenue', amount: 1350, description: 'May Booking - Mountain Cabin', property: 'Mountain Cabin', platform: 'Airbnb' },
    { id: 109, date: '2023-05-20', type: 'expense', category: 'Supplies', amount: 210, description: 'Restock of amenities', property: 'All Properties' },
    { id: 110, date: '2023-06-08', type: 'income', category: 'Booking Revenue', amount: 980, description: 'June Booking - Downtown Loft', property: 'Downtown Loft', platform: 'Booking.com' },
    { id: 111, date: '2023-06-30', type: 'expense', category: 'Insurance', amount: 450, description: 'Property insurance premium', property: 'All Properties' },
    { id: 112, date: '2023-07-12', type: 'income', category: 'Booking Revenue', amount: 1450, description: 'July Booking - Mountain Cabin', property: 'Mountain Cabin', platform: 'VRBO' },
    { id: 113, date: '2023-07-15', type: 'income', category: 'Booking Revenue', amount: 1100, description: 'July Booking - Oceanview Apartment', property: 'Oceanview Apartment', platform: 'Airbnb' },
    { id: 114, date: '2023-08-05', type: 'income', category: 'Booking Revenue', amount: 1050, description: 'August Booking - Downtown Loft', property: 'Downtown Loft', platform: 'VRBO' },
    { id: 115, date: '2023-08-18', type: 'expense', category: 'Maintenance', amount: 280, description: 'HVAC service', property: 'Oceanview Apartment' },
    { id: 116, date: '2023-09-10', type: 'income', category: 'Booking Revenue', amount: 890, description: 'September Booking - Downtown Loft', property: 'Downtown Loft', platform: 'Airbnb' },
    { id: 117, date: '2023-09-25', type: 'expense', category: 'Utilities', amount: 185, description: 'Electric and water bill', property: 'Downtown Loft' },
    { id: 118, date: '2023-10-08', type: 'income', category: 'Booking Revenue', amount: 1200, description: 'October Booking - Mountain Cabin', property: 'Mountain Cabin', platform: 'Booking.com' },
    { id: 119, date: '2023-10-22', type: 'income', category: 'Booking Revenue', amount: 980, description: 'October Booking - Oceanview Apartment', property: 'Oceanview Apartment', platform: 'VRBO' },
    { id: 120, date: '2023-11-05', type: 'income', category: 'Booking Revenue', amount: 850, description: 'November Booking - Downtown Loft', property: 'Downtown Loft', platform: 'Airbnb' },
    { id: 121, date: '2023-11-20', type: 'expense', category: 'Marketing', amount: 300, description: 'Online advertising', property: 'All Properties' },
    { id: 122, date: '2023-12-10', type: 'income', category: 'Booking Revenue', amount: 1400, description: 'December Booking - Mountain Cabin', property: 'Mountain Cabin', platform: 'VRBO' },
    { id: 123, date: '2023-12-18', type: 'income', category: 'Booking Revenue', amount: 1150, description: 'December Booking - Oceanview Apartment', property: 'Oceanview Apartment', platform: 'Airbnb' },
    { id: 124, date: '2023-12-28', type: 'expense', category: 'Supplies', amount: 230, description: 'Year-end restock', property: 'All Properties' },

    // 2024 Transactions
    { id: 1, date: '2024-01-15', type: 'income', category: 'Booking Revenue', amount: 1075, description: 'John Smith - Oceanview Apartment (5 nights)', property: 'Oceanview Apartment', platform: 'Airbnb' },
    { id: 2, date: '2024-01-14', type: 'expense', category: 'Cleaning', amount: 80, description: 'Professional cleaning service', property: 'Downtown Loft' },
    { id: 3, date: '2024-01-13', type: 'income', category: 'Booking Revenue', amount: 805, description: 'Sarah Johnson - Downtown Loft (4 nights)', property: 'Downtown Loft', platform: 'VRBO' },
    { id: 4, date: '2024-01-12', type: 'expense', category: 'Maintenance', amount: 250, description: 'Plumbing repair', property: 'Oceanview Apartment' },
    { id: 5, date: '2024-01-11', type: 'expense', category: 'Supplies', amount: 120, description: 'Restocking inventory', property: 'All Properties' },
    { id: 6, date: '2024-01-25', type: 'income', category: 'Pet Fees', amount: 75, description: 'Pet fee for Mountain Cabin booking', property: 'Mountain Cabin', platform: 'Airbnb' },
    { id: 7, date: '2024-01-28', type: 'income', category: 'Cleaning Fees', amount: 200, description: 'Cleaning fee for Mountain Cabin booking', property: 'Mountain Cabin', platform: 'Airbnb' },
    { id: 8, date: '2024-01-30', type: 'expense', category: 'Utilities', amount: 175, description: 'Electric and water bills', property: 'Oceanview Apartment' },
    { id: 9, date: '2024-02-05', type: 'income', category: 'Booking Revenue', amount: 1200, description: 'February booking - Mountain Cabin', property: 'Mountain Cabin', platform: 'VRBO' },
    { id: 10, date: '2024-02-10', type: 'expense', category: 'Insurance', amount: 450, description: 'Quarterly insurance premium', property: 'All Properties' }
  ]);

  // Enhanced state for property-specific custom categories
  const [customCategories, setCustomCategories] = useState({
    income: [],
    expense: []
  });

  // State for storing spreadsheet data
  const [spreadsheetData, setSpreadsheetData] = useState({});
  
  // State for skipping delete confirmation
  const [skipDeleteConfirmation, setSkipDeleteConfirmation] = useState(false);

  // Load custom categories from Supabase on component mount
  useEffect(() => {
    loadCustomCategories();
    loadSpreadsheetDataFromStorage();
  }, []);

  // Load spreadsheet data from local storage
  const loadSpreadsheetDataFromStorage = () => {
    try {
      const savedData = localStorage.getItem('spreadsheetData');
      if (savedData) {
        setSpreadsheetData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading spreadsheet data from storage:', error);
    }
  };

  // Save spreadsheet data to local storage
  const saveSpreadsheetDataToStorage = (data) => {
    try {
      localStorage.setItem('spreadsheetData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving spreadsheet data to storage:', error);
    }
  };

  // Load custom categories from Supabase
  const loadCustomCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_categories')
        .select('*');

      if (error) {
        console.log('Using local categories (Supabase not connected)');
        return;
      }

      const categoriesByType = data.reduce((acc, category) => {
        if (!acc[category.type]) acc[category.type] = [];
        acc[category.type].push(category);
        return acc;
      }, { income: [], expense: [] });

      setCustomCategories(categoriesByType);
    } catch (error) {
      console.log('Using local categories (Supabase not connected)');
    }
  };

  // Save spreadsheet data
  const saveSpreadsheetData = (year, data) => {
    setSpreadsheetData(prev => {
      const newData = {
        ...prev,
        [year]: data
      };
      
      // Save to local storage
      saveSpreadsheetDataToStorage(newData);
      
      return newData;
    });
  };

  // Load spreadsheet data
  const loadSpreadsheetData = (year) => {
    return spreadsheetData[year] || null;
  };

  // Add custom category function (property-specific)
  const addCustomCategory = async (categoryData) => {
    try {
      const { data, error } = await supabase
        .from('custom_categories')
        .insert([{
          name: categoryData.name,
          type: categoryData.type,
          properties: categoryData.properties,
          created_at: new Date().toISOString(),
          user_id: 'demo-user'
        }])
        .select();

      if (error) {
        // Fallback to local storage if Supabase not connected
        const newCategory = {
          id: Date.now(),
          name: categoryData.name,
          type: categoryData.type,
          properties: categoryData.properties,
          created_at: new Date().toISOString()
        };

        setCustomCategories(prev => ({
          ...prev,
          [categoryData.type]: [...prev[categoryData.type], newCategory]
        }));
        
        console.log('Added category locally:', newCategory);
        return newCategory;
      }

      const newCategory = data[0];
      setCustomCategories(prev => ({
        ...prev,
        [categoryData.type]: [...prev[categoryData.type], newCategory]
      }));
      
      console.log('Added category to Supabase:', newCategory);
      return newCategory;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  // Update custom category function
  const updateCustomCategory = async (oldName, newName, type, property) => {
    try {
      const { error } = await supabase
        .from('custom_categories')
        .update({ name: newName })
        .eq('name', oldName)
        .eq('type', type)
        .contains('properties', [property]);

      if (error) {
        console.log('Updating category locally');
      }

      // Update local state regardless of Supabase connection
      setCustomCategories(prev => ({
        ...prev,
        [type]: prev[type].map(cat => 
          cat.name === oldName && cat.properties.includes(property)
            ? { ...cat, name: newName }
            : cat
        )
      }));

      console.log('Updated category:', oldName, 'to', newName);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  // Delete custom category function (property-specific)
  const deleteCustomCategory = async (categoryName, type, property) => {
    try {
      const { error } = await supabase
        .from('custom_categories')
        .delete()
        .eq('name', categoryName)
        .eq('type', type)
        .contains('properties', [property]);

      if (error) {
        console.log('Deleting category locally');
      }

      // Update local state regardless of Supabase connection
      setCustomCategories(prev => ({
        ...prev,
        [type]: prev[type].filter(cat => 
          !(cat.name === categoryName && cat.properties.includes(property))
        )
      }));

      console.log('Deleted category:', categoryName, 'from', property);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  // Reorder categories function (property-specific)
  const reorderCategories = (type, property, fromIndex, toIndex) => {
    if (property === 'all') return; // Can't reorder in "All Properties" view
    
    setCustomCategories(prev => {
      const propertyCategories = prev[type].filter(cat => cat.properties.includes(property));
      const otherCategories = prev[type].filter(cat => !cat.properties.includes(property));
      
      const reorderedCategories = [...propertyCategories];
      const [removed] = reorderedCategories.splice(fromIndex, 1);
      reorderedCategories.splice(toIndex, 0, removed);
      
      return {
        ...prev,
        [type]: [...otherCategories, ...reorderedCategories]
      };
    });
  };

  // Property management functions
  const addProperty = (property) => {
    setProperties(prev => [...prev, { ...property, id: Date.now() }]);
  };

  const updateProperty = (id, updates) => {
    setProperties(prev => prev.map(prop => 
      prop.id === id ? { ...prop, ...updates } : prop
    ));
  };

  const deleteProperty = (id) => {
    setProperties(prev => prev.filter(prop => prop.id !== id));
  };

  // Booking management functions
  const addBooking = (booking) => {
    setBookings(prev => [...prev, { ...booking, id: Date.now() }]);
  };

  const updateBooking = (id, updates) => {
    setBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, ...updates } : booking
    ));
  };

  const deleteBooking = (id) => {
    setBookings(prev => prev.filter(booking => booking.id !== id));
  };

  // Inventory management functions
  const addInventoryItem = (item) => {
    setInventory(prev => [...prev, { ...item, id: Date.now() }]);
  };

  const updateInventoryItem = (id, updates) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteInventoryItem = (id) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  // Transaction management functions
  const addTransaction = (transaction) => {
    setTransactions(prev => [...prev, { ...transaction, id: Date.now() }]);
  };

  const updateTransaction = (id, updates) => {
    setTransactions(prev => prev.map(trans => 
      trans.id === id ? { ...trans, ...updates } : trans
    ));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(trans => trans.id !== id));
  };

  const value = {
    properties,
    bookings,
    inventory,
    transactions,
    customCategories,
    skipDeleteConfirmation,
    setSkipDeleteConfirmation,
    addProperty,
    updateProperty,
    deleteProperty,
    addBooking,
    updateBooking,
    deleteBooking,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCustomCategory,
    updateCustomCategory,
    deleteCustomCategory,
    reorderCategories,
    loadCustomCategories,
    saveSpreadsheetData,
    loadSpreadsheetData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};