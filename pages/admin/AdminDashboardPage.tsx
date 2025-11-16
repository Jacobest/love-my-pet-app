import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-dark">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome, {user?.displayName}. Select a section from the sidebar to begin.</p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for stats cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Active Alerts</h3>
          <p className="text-3xl font-bold mt-2">5</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Members</h3>
          <p className="text-3xl font-bold mt-2">124</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Pets Reunited</h3>
          <p className="text-3xl font-bold mt-2">23</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
