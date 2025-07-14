import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Mock data for development
const generateMockData = () => {
  const properties = [
    {
      id: 1,
      name: 'Sunset Villa',
      address: '123 Ocean Drive, Miami, FL',
      status: 'occupied',
      monthlyRevenue: 4500,
      occupancyRate: 85,
      nextCheckout: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500',
      cleaningFee: 150,
      petFee: 75,
      totalBookings: 24,
      averageNightly: 180,
      expenses: 1200,
      profit: 3300
    },
    {
      id: 2,
      name: 'Mountain Retreat',
      address: '456 Pine Street, Aspen, CO',
      status: 'vacant',
      monthlyRevenue: 3800,
      occupancyRate: 92,
      nextCheckout: '2024-01-20',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500',
      cleaningFee: 125,
      petFee: 50,
      totalBookings: 18,
      averageNightly: 220,
      expenses: 900,
      profit: 2900
    },
    {
      id: 3,
      name: 'City Loft',
      address: '789 Downtown Ave, New York, NY',
      status: 'maintenance',
      monthlyRevenue: 5200,
      occupancyRate: 78,
      nextCheckout: '2024-01-12',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500',
      cleaningFee: 100,
      petFee: 0,
      totalBookings: 32,
      averageNightly: 165,
      expenses: 1500,
      profit: 3700
    }
  ];

  const transactions = [
    {
      id: 1,
      date: '2024-01-10',
      type: 'income',
      category: 'Booking Revenue',
      amount: 1800,
      description: 'Weekend booking - Sunset Villa',
      property: 'Sunset Villa'
    },
    {
      id: 2,
      date: '2024-01-09',
      type: 'expense',
      category: 'Cleaning',
      amount: 150,
      description: 'Post-checkout cleaning',
      property: 'Sunset Villa'
    },
    {
      id: 3,
      date: '2024-01-08',
      type: 'income',
      category: 'Booking Revenue',
      amount: 2200,
      description: 'Weekly booking - Mountain Retreat',
      property: 'Mountain Retreat'
    },
    {
      id: 4,
      date: '2024-01-07',
      type: 'expense',
      category: 'Maintenance',
      amount: 300,
      description: 'HVAC repair - City Loft',
      property: 'City Loft'
    },
    {
      id: 5,
      date: '2024-01-06',
      type: 'income',
      category: 'Cleaning Fees',
      amount: 125,
      description: 'Cleaning fee - Mountain Retreat',
      property: 'Mountain Retreat'
    }
  ];

  const bookings = [
    {
      id: 1,
      propertyId: 1,
      propertyName: 'Sunset Villa',
      guestName: 'John Smith',
      checkIn: '2024-01-15',
      checkOut: '2024-01-18',
      nights: 3,
      rate: 180,
      cleaningFee: 150,
      petFee: 0,
      total: 690,
      platform: 'Airbnb',
      status: 'confirmed'
    },
    {
      id: 2,
      propertyId: 2,
      propertyName: 'Mountain Retreat',
      guestName: 'Sarah Johnson',
      checkIn: '2024-01-20',
      checkOut: '2024-01-25',
      nights: 5,
      rate: 220,
      cleaningFee: 125,
      petFee: 50,
      total: 1275,
      platform: 'VRBO',
      status: 'confirmed'
    },
    {
      id: 3,
      propertyId: 3,
      propertyName: 'City Loft',
      guestName: 'Mike Wilson',
      checkIn: '2024-01-22',
      checkOut: '2024-01-24',
      nights: 2,
      rate: 165,
      cleaningFee: 100,
      petFee: 0,
      total: 430,
      platform: 'Booking.com',
      status: 'pending'
    }
  ];

  const inventory = [
    {
      id: 1,
      name: 'Toilet Paper',
      category: 'Bathroom',
      property: 'Sunset Villa',
      currentStock: 8,
      minStock: 12,
      maxStock: 24,
      unitCost: 1.25,
      supplier: 'Costco',
      lastRestocked: '2024-01-01',
      location: 'Storage Closet',
      productUrl: 'https://example.com/toilet-paper'
    },
    {
      id: 2,
      name: 'Coffee Pods',
      category: 'Kitchen',
      property: 'Mountain Retreat',
      currentStock: 15,
      minStock: 10,
      maxStock: 30,
      unitCost: 0.75,
      supplier: 'Amazon',
      lastRestocked: '2024-01-05',
      location: 'Kitchen Cabinet',
      productUrl: 'https://example.com/coffee-pods'
    },
    {
      id: 3,
      name: 'Bath Towels',
      category: 'Linens',
      property: 'City Loft',
      currentStock: 4,
      minStock: 8,
      maxStock: 16,
      unitCost: 25.00,
      supplier: 'Target',
      lastRestocked: '2023-12-20',
      location: 'Linen Closet',
      productUrl: 'https://example.com/bath-towels'
    }
  ];

  const shoppingList = [
    {
      id: 1,
      name: 'Dishwasher Detergent',
      quantity: 2,
      unit: 'boxes',
      properties: ['Sunset Villa', 'City Loft'],
      priority: 'high',
      dueDate: '2024-01-15',
      productUrl: 'https://example.com/dishwasher-detergent',
      notes: 'Get the eco-friendly brand',
      status: 'active',
      createdAt: '2024-01-10'
    },
    {
      id: 2,
      name: 'Light Bulbs',
      quantity: 6,
      unit: 'pieces',
      properties: ['Mountain Retreat'],
      priority: 'medium',
      dueDate: '2024-01-20',
      productUrl: 'https://example.com/light-bulbs',
      notes: 'LED 60W equivalent',
      status: 'active',
      createdAt: '2024-01-08'
    }
  ];

  const contractors = [
    {
      id: 1,
      name: 'Mike Johnson',
      company: 'Johnson Plumbing',
      phone: '(555) 123-4567',
      email: 'mike@johnsonplumbing.com',
      services: ['Plumbing', 'Emergency Repairs'],
      locations: ['Sunset Villa', 'City Loft'],
      rating: 5,
      status: 'active',
      tags: ['Reliable', 'Emergency', 'Licensed'],
      notes: 'Available 24/7 for emergencies',
      hourlyRate: 85,
      totalJobs: 12,
      avgResponseTime: 2,
      lastWorked: '2024-01-05',
      emergencyContact: true,
      insurance: true,
      licensed: true,
      serviceHistory: [
        {
          id: 1,
          date: '2024-01-05',
          property: 'Sunset Villa',
          description: 'Fixed kitchen sink leak',
          cost: 150,
          duration: 2,
          urgency: 'normal'
        }
      ]
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      company: 'Clean & Shine',
      phone: '(555) 987-6543',
      email: 'sarah@cleanandshine.com',
      services: ['Cleaning', 'Deep Cleaning'],
      locations: ['Mountain Retreat', 'Sunset Villa'],
      rating: 4,
      status: 'active',
      tags: ['Professional', 'Experienced'],
      notes: 'Specializes in vacation rental turnovers',
      hourlyRate: 35,
      totalJobs: 25,
      avgResponseTime: 4,
      lastWorked: '2024-01-08',
      emergencyContact: false,
      insurance: true,
      licensed: true,
      serviceHistory: []
    }
  ];

  return {
    properties,
    transactions,
    bookings,
    inventory,
    shoppingList,
    contractors
  };
};

export const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize with mock data
  const mockData = generateMockData();
  const [properties, setProperties] = useState(mockData.properties);
  const [transactions, setTransactions] = useState(mockData.transactions);
  const [bookings, setBookings] = useState(mockData.bookings);
  const [inventory, setInventory] = useState(mockData.inventory);
  const [shoppingList, setShoppingList] = useState(mockData.shoppingList);
  const [contractors, setContractors] = useState(mockData.contractors);
  const [customCategories, setCustomCategories] = useState({ income: [], expense: [] });
  const [skipDeleteConfirmation, setSkipDeleteConfirmation] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Property management functions
  const addProperty = (propertyData) => {
    const newProperty = {
      ...propertyData,
      id: Math.max(...properties.map(p => p.id), 0) + 1
    };
    setProperties(prev => [...prev, newProperty]);
  };

  const updateProperty = (id, updates) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProperty = (id) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    setTransactions(prev => prev.filter(t => t.property !== properties.find(p => p.id === id)?.name));
    setBookings(prev => prev.filter(b => b.propertyId !== id));
  };

  // Transaction management functions
  const addTransaction = (transactionData) => {
    const newTransaction = {
      ...transactionData,
      id: Math.max(...transactions.map(t => t.id), 0) + 1
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (id, updates) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Booking management functions
  const addBooking = (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: Math.max(...bookings.map(b => b.id), 0) + 1
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const updateBooking = (id, updates) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBooking = (id) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  // Inventory management functions
  const addInventoryItem = (itemData) => {
    const newItem = {
      ...itemData,
      id: Math.max(...inventory.map(i => i.id), 0) + 1
    };
    setInventory(prev => [...prev, newItem]);
  };

  const updateInventoryItem = (id, updates) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const deleteInventoryItem = (id) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  // Shopping list management functions
  const addShoppingItem = (itemData) => {
    const newItem = {
      ...itemData,
      id: Math.max(...shoppingList.map(i => i.id), 0) + 1
    };
    setShoppingList(prev => [...prev, newItem]);
  };

  const updateShoppingItem = (id, updates) => {
    setShoppingList(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const deleteShoppingItem = (id) => {
    setShoppingList(prev => prev.filter(i => i.id !== id));
  };

  const archiveShoppingItem = (id) => {
    setShoppingList(prev => prev.map(i => 
      i.id === id ? { ...i, status: 'purchased', purchasedAt: new Date().toISOString() } : i
    ));
  };

  // Contractor management functions
  const addContractor = (contractorData) => {
    const newContractor = {
      ...contractorData,
      id: Math.max(...contractors.map(c => c.id), 0) + 1,
      serviceHistory: contractorData.serviceHistory || []
    };
    setContractors(prev => [...prev, newContractor]);
    return newContractor;
  };

  const updateContractor = (id, updates) => {
    setContractors(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteContractor = (id) => {
    setContractors(prev => prev.filter(c => c.id !== id));
  };

  // Custom category management
  const addCustomCategory = async (categoryData) => {
    const { name, type, properties } = categoryData;
    setCustomCategories(prev => ({
      ...prev,
      [type]: [
        ...prev[type],
        { name, properties, type }
      ]
    }));
  };

  const updateCustomCategory = async (oldName, newName, type, property) => {
    setCustomCategories(prev => ({
      ...prev,
      [type]: prev[type].map(cat => 
        cat.name === oldName && cat.properties.includes(property)
          ? { ...cat, name: newName }
          : cat
      )
    }));
  };

  const deleteCustomCategory = async (categoryName, type, property) => {
    setCustomCategories(prev => ({
      ...prev,
      [type]: prev[type].filter(cat => 
        !(cat.name === categoryName && cat.properties.includes(property))
      )
    }));
  };

  const reorderCategories = (type, categories) => {
    setCustomCategories(prev => ({
      ...prev,
      [type]: categories
    }));
  };

  // Spreadsheet data management
  const saveSpreadsheetData = (year, data) => {
    localStorage.setItem(`spreadsheet_${year}`, JSON.stringify(data));
  };

  const loadSpreadsheetData = (year) => {
    const data = localStorage.getItem(`spreadsheet_${year}`);
    return data ? JSON.parse(data) : null;
  };

  // Loading state component
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const value = {
    // Data
    properties,
    transactions,
    bookings,
    inventory,
    shoppingList,
    contractors,
    customCategories,
    skipDeleteConfirmation,
    
    // Property functions
    addProperty,
    updateProperty,
    deleteProperty,
    
    // Transaction functions
    addTransaction,
    updateTransaction,
    deleteTransaction,
    
    // Booking functions
    addBooking,
    updateBooking,
    deleteBooking,
    
    // Inventory functions
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    
    // Shopping list functions
    addShoppingItem,
    updateShoppingItem,
    deleteShoppingItem,
    archiveShoppingItem,
    
    // Contractor functions
    addContractor,
    updateContractor,
    deleteContractor,
    
    // Category functions
    addCustomCategory,
    updateCustomCategory,
    deleteCustomCategory,
    reorderCategories,
    
    // Settings
    setSkipDeleteConfirmation,
    
    // Spreadsheet functions
    saveSpreadsheetData,
    loadSpreadsheetData,
    
    // State
    loading,
    error
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};