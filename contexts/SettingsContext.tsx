import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AppSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

const SETTINGS_STORAGE_KEY = 'lovemypet-app-settings';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: AppSettings) => void;
  isLoading: boolean;
}

// FIX: Export SettingsContext to allow it to be imported by other modules, resolving the compilation error.
export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        // Basic validation to merge stored settings with defaults,
        // preventing crashes if the structure changes.
        const parsedSettings = JSON.parse(storedSettings);
        const mergedSettings = {
            ...DEFAULT_SETTINGS,
            general: { ...DEFAULT_SETTINGS.general, ...parsedSettings.general },
            userPetManagement: { ...DEFAULT_SETTINGS.userPetManagement, ...parsedSettings.userPetManagement },
            contentModeration: { ...DEFAULT_SETTINGS.contentModeration, ...parsedSettings.contentModeration },
        };
        setSettings(mergedSettings);
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSettings = useCallback((newSettings: AppSettings) => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }
  }, []);

  const value = { settings, updateSettings, isLoading };

  return (
    <SettingsContext.Provider value={value}>
      {!isLoading && children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
