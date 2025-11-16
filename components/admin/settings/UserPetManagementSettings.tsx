import React, { useState } from 'react';
import { useSettings } from '../../../contexts/SettingsContext';
import { AppSettings, User } from '../../../types';
import Input from '../../Input';
import Button from '../../Button';
import { UserCog, Save } from 'lucide-react';

const UserPetManagementSettings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState(settings.userPetManagement);
  const [isSaved, setIsSaved] = useState(false);
  
  const userRoles: User['role'][] = ['User', 'Moderator', 'Admin'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'alertDurationDays' ? parseInt(value, 10) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSettings: AppSettings = { ...settings, userPetManagement: formData };
    updateSettings(newSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-8">
      <div>
        <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2"><UserCog /> User & Pet Management</h2>
        <p className="text-sm text-gray-500 mt-1">Configure default behaviors for new users and pet alerts.</p>
        
        <div className="mt-6 space-y-6">
            <div>
                <label htmlFor="defaultUserRole" className="block text-sm font-medium text-gray-700">Default Role for New Users</label>
                <select
                    id="defaultUserRole"
                    name="defaultUserRole"
                    value={formData.defaultUserRole}
                    onChange={handleChange}
                    className="mt-1 block w-full max-w-xs pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md"
                >
                    {userRoles.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
                <p className="text-xs text-gray-500 mt-1">This role will be assigned to all users upon registration.</p>
            </div>
            
            <div>
                <Input
                    label="Alert Review Duration (Days)"
                    id="alertDurationDays"
                    name="alertDurationDays"
                    type="number"
                    value={formData.alertDurationDays}
                    onChange={handleChange}
                    min="1"
                    className="max-w-xs"
                />
                <p className="text-xs text-gray-500 mt-1">Flag 'Lost' pet alerts for admin review after this many days.</p>
            </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" disabled={isSaved}>
          <Save size={16} className="mr-2" /> {isSaved ? 'Settings Saved!' : 'Save Settings'}
        </Button>
      </div>
    </form>
  );
};

export default UserPetManagementSettings;
