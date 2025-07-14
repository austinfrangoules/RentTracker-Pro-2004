import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { DataProvider } from './context/DataContext';
import './App.css';

// Lazy load components
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Properties = React.lazy(() => import('./pages/Properties'));
const PropertyProfile = React.lazy(() => import('./pages/PropertyProfile'));
const Inventory = React.lazy(() => import('./pages/Inventory'));
const Finances = React.lazy(() => import('./pages/Finances'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Contractors = React.lazy(() => import('./pages/Contractors'));
const Settings = React.lazy(() => import('./pages/Settings'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong</h2>
            <p className="text-gray-600">{this.state.error?.message || 'Failed to load content'}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <Router>
          <Layout>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/finances" element={<Finances />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/properties/:id" element={<PropertyProfile />} />
                <Route path="/contractors" element={<Contractors />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </DataProvider>
    </ErrorBoundary>
  );
}

export default App;