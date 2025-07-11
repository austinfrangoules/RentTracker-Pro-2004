import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Maintenance from './pages/Maintenance';
import Contractors from './pages/Contractors';
import Inventory from './pages/Inventory';
import Finances from './pages/Finances';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { DataProvider } from './context/DataContext';
import './App.css';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/finances" element={<Finances />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/contractors" element={<Contractors />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              {/* Add a catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;