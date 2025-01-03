import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6">
        <Dashboard />
      </main>
    </div>
  );
};

export default App;