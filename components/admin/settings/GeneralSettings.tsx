import React, { useState } from 'react';
import { useSettings } from '../../../contexts/SettingsContext';
import { AppSettings, SiteSettings } from '../../../types';
import Input from '../../Input';
import Button from '../../Button';
import { Globe, Info, Save } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';

const GeneralSettings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState<SiteSettings>(settings.general);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        socials: {
            ...prev.socials,
            [name]: value,
        }
    }));
  }
  
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({...prev, [name]: checked }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSettings: AppSettings = { ...settings, general: formData };
    updateSettings(newSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-8">
      <div>
        <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2"><Globe /> General Site Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Control the public-facing name, contact details, and status of the application.</p>
        <div className="mt-6 space-y-4">
          <Input label="Application Name" id="appName" name="appName" value={formData.appName} onChange={handleChange} />
          <Input label="Public Contact Email" id="contactEmail" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} />
          <div>
            <label htmlFor="contactAddress" className="block text-sm font-medium text-gray-700">Public Mailing Address</label>
            <textarea id="contactAddress" name="contactAddress" value={formData.contactAddress} onChange={handleChange} rows={3} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary" />
          </div>
        </div>
      </div>
      
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold">Social Media Links</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Facebook URL" id="facebook" name="facebook" value={formData.socials.facebook || ''} onChange={handleSocialChange} placeholder="https://facebook.com/yourpage" />
            <Input label="Instagram URL" id="instagram" name="instagram" value={formData.socials.instagram || ''} onChange={handleSocialChange} placeholder="https://instagram.com/yourprofile" />
            <Input label="Twitter URL" id="twitter" name="twitter" value={formData.socials.twitter || ''} onChange={handleSocialChange} placeholder="https://twitter.com/yourhandle" />
        </div>
      </div>

      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold">Maintenance Mode</h3>
         <div className="mt-4 flex items-center justify-between bg-gray-50 p-4 rounded-md border">
            <div>
              <label htmlFor="maintenanceMode" className="font-medium text-gray-900">Enable Maintenance Mode</label>
              <p className="text-sm text-gray-500">When enabled, only Admins can access the site. All other users will see a maintenance page.</p>
            </div>
            <ToggleSwitch id="maintenanceMode" name="maintenanceMode" checked={formData.maintenanceMode} onChange={handleToggle} />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSaved}>
          <Save size={16} className="mr-2" /> {isSaved ? 'Settings Saved!' : 'Save General Settings'}
        </Button>
      </div>
    </form>
  );
};

export default GeneralSettings;
