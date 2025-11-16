import React, { useState } from 'react';
import { Settings, UserCog, Shield } from 'lucide-react';
import GeneralSettings from '../../components/admin/settings/GeneralSettings';
import UserPetManagementSettings from '../../components/admin/settings/UserPetManagementSettings';
import ContentModerationSettings from '../../components/admin/settings/ContentModerationSettings';

type SettingsTab = 'general' | 'userPetManagement' | 'contentModeration';

const AdminSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  const tabs: { id: SettingsTab; name: string; icon: React.ReactNode }[] = [
    { id: 'general', name: 'General', icon: <Settings size={18} /> },
    { id: 'userPetManagement', name: 'User & Pet Management', icon: <UserCog size={18} /> },
    { id: 'contentModeration', name: 'Content & Moderation', icon: <Shield size={18} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'userPetManagement':
        return <UserPetManagementSettings />;
      case 'contentModeration':
        return <ContentModerationSettings />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-dark mb-8">Application Settings</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <nav className="flex flex-col space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 p-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-admin-primary text-white shadow'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="lg:w-3/4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
