
import React from 'react';
import { Pet } from '../types';

export const PetContext = React.createContext<{
  pets: Pet[];
  getPetById: (id: string) => Pet | undefined;
  addPet: (petData: Omit<Pet, 'id' | 'ownerId' | 'status'>) => void;
  updatePet: (petId: string, petData: Partial<Pet>) => void;
  deletePet: (petId: string) => void;
}>({
  pets: [],
  getPetById: () => undefined,
  addPet: () => {},
  updatePet: () => {},
  deletePet: () => {},
});

export const usePets = () => React.useContext(PetContext);