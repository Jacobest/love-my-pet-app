import React from 'react';
import { PawPrint, Wrench } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

const MaintenancePage: React.FC = () => {
  const { settings } = useSettings();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <div className="bg-white p-10 rounded-lg shadow-xl">
        <div className="flex justify-center items-center gap-4 mb-6">
          <PawPrint className="h-12 w-12 text-brand-primary" />
          <h1 className="text-4xl font-bold text-brand-dark">{settings.general.appName}</h1>
        </div>
        <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-brand-dark mb-2">Down for Maintenance</h2>
        <p className="text-lg text-gray-600 max-w-md">
          We are currently performing scheduled maintenance to improve our community platform. We'll be back online shortly. Thank you for your patience!
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;
