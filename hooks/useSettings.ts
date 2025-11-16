import { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';

// This is a re-export for convenience, but the primary export is in SettingsContext.
// Keeping it allows for a consistent `hooks/use...` pattern.
export { useSettings } from '../contexts/SettingsContext';
