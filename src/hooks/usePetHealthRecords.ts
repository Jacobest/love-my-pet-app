import { useState, useEffect, useCallback } from 'react';
import { HealthRecord } from '../types';

const STORAGE_KEY = 'lovemypet-health-records';

// Mock data to pre-populate on first load
const MOCK_HEALTH_RECORDS: HealthRecord[] = [
  { id: 'hr-1', petId: 'pet-1', type: 'Vaccination', date: '2023-05-15', notes: 'Rabies and Distemper shots updated.', vetName: 'City Vet Clinic' },
  { id: 'hr-2', petId: 'pet-1', type: 'Vet Visit', date: '2024-01-10', notes: 'Annual check-up. All clear. Good weight.', vetName: 'City Vet Clinic' },
  { id: 'hr-3', petId: 'pet-2', type: 'Medication', date: '2024-03-20', notes: 'Flea and tick prevention (Bravecto) applied.', vetName: '' },
  { id: 'hr-4', petId: 'pet-2', type: 'Allergy', date: '2023-09-01', notes: 'Mild allergy to poultry confirmed. Switched to fish-based food.', vetName: 'Oakland Veterinary' },
];

export const usePetHealthRecords = (petId: string) => {
  const [allRecords, setAllRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    try {
      const storedRecords = localStorage.getItem(STORAGE_KEY);
      if (storedRecords) {
        setAllRecords(JSON.parse(storedRecords));
      } else {
        // If no records exist, pre-populate with mock data for demo purposes
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_HEALTH_RECORDS));
        setAllRecords(MOCK_HEALTH_RECORDS);
      }
    } catch (error) {
      console.error('Failed to load health records from localStorage', error);
    }
  }, []);

  const saveRecords = (records: HealthRecord[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      setAllRecords(records);
    } catch (error) {
      console.error('Failed to save health records to localStorage', error);
    }
  };

  const recordsForPet = allRecords.filter(r => r.petId === petId);

  const addRecord = useCallback((recordData: Omit<HealthRecord, 'id' | 'petId'>) => {
    const newRecord: HealthRecord = {
      ...recordData,
      id: `hr-${Date.now()}`,
      petId,
    };
    saveRecords([...allRecords, newRecord]);
  }, [allRecords, petId]);

  const updateRecord = useCallback((recordId: string, updatedData: Partial<Omit<HealthRecord, 'id' | 'petId'>>) => {
    const updatedRecords = allRecords.map(r =>
      r.id === recordId ? { ...r, ...updatedData } : r
    );
    saveRecords(updatedRecords);
  }, [allRecords]);

  const deleteRecord = useCallback((recordId: string) => {
    const filteredRecords = allRecords.filter(r => r.id !== recordId);
    saveRecords(filteredRecords);
  }, [allRecords]);

  return {
    records: recordsForPet,
    addRecord,
    updateRecord,
    deleteRecord,
  };
};