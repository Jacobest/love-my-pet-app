import React, { useState } from 'react';
import { useSettings } from '../../../contexts/SettingsContext';
import { AppSettings } from '../../../types';
import Button from '../../Button';
import { Shield, Save } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';

const ContentModerationSettings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState(settings.contentModeration);
  const [profanityText, setProfanityText] = useState(settings.contentModeration.profanityList.join(', '));
  const [isSaved, setIsSaved] = useState(false);
  
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({...prev, [name]: checked }));
  }

  const handleProfanityChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProfanityText(e.target.value);
    const list = e.target.value.split(',').map(word => word.trim().toLowerCase()).filter(Boolean);
    setFormData(prev => ({ ...prev, profanityList: list }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSettings: AppSettings = { ...settings, contentModeration: formData };
    updateSettings(newSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-8">
      <div>
        <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2"><Shield /> Content & Moderation</h2>
        <p className="text-sm text-gray-500 mt-1">Set rules for user-generated content to maintain community standards.</p>
        
        <div className="mt-6 space-y-6">
           <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md border">
                <div>
                  <label htmlFor="requireStoryApproval" className="font-medium text-gray-900">Require Reunion Story Approval</label>
                  <p className="text-sm text-gray-500">If enabled, all new reunion stories will go to the moderation queue.</p>
                </div>
                <ToggleSwitch id="requireStoryApproval" name="requireStoryApproval" checked={formData.requireStoryApproval} onChange={handleToggle} />
            </div>

            <div>
                <label htmlFor="profanityList" className="block text-sm font-medium text-gray-700">Profanity & Keyword Filter</label>
                <p className="text-xs text-gray-500 mt-1 mb-2">Enter comma-separated words. These words will be replaced with asterisks (****) in user posts and comments.</p>
                <textarea
                    id="profanityList"
                    name="profanityList"
                    value={profanityText}
                    onChange={handleProfanityChange}
                    rows={5}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
                    placeholder="e.g., word1, anotherword, badphrase"
                />
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

export default ContentModerationSettings;
