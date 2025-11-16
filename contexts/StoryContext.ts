import React from 'react';
import { FoundPetStory } from '../types';

export const StoryContext = React.createContext<{
  stories: FoundPetStory[];
  addFoundPetStory: (storyData: Omit<FoundPetStory, 'id' | 'likes' | 'commentIds'>) => void;
  updateFoundPetStory: (storyId: string, updates: Partial<FoundPetStory>) => void;
  deleteFoundPetStory: (storyId: string) => void;
}>({
  stories: [],
  addFoundPetStory: () => {},
  updateFoundPetStory: () => {},
  deleteFoundPetStory: () => {},
});