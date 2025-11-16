import React from 'react';
import { Link } from 'react-router-dom';
import { MonitorOff, ArrowLeft } from 'lucide-react';
import Button from './Button';

const AdminMobileAccessDenied: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <MonitorOff className="h-24 w-24 text-gray-400 mb-6" />
      <h1 className="text-3xl font-bold text-brand-dark mb-2">Admin Panel Unavailable</h1>
      <p className="text-lg text-gray-600 max-w-md mb-8">
        The admin panel is designed for a larger screen and is not accessible on mobile devices. Please log in from a desktop or tablet to manage the app.
      </p>
      <Button as={Link} to="/" variant="secondary">
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to Main Site
      </Button>
    </div>
  );
};

export default AdminMobileAccessDenied;
