import { useContext } from 'react';
import { StoryContext } from '../contexts/StoryContext';

export const useStories = () => {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error('useStories must be used within a StoryProvider');
  }
  return context;
};