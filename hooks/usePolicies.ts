import { useContext } from 'react';
import { PolicyContext } from '../App';

export const usePolicies = () => {
  const context = useContext(PolicyContext);
  if (context === undefined) {
    throw new Error('usePolicies must be used within a PolicyProvider');
  }
  return context;
};
