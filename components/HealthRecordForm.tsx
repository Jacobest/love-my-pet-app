import React, { useState, useEffect } from 'react';
import { HealthRecord } from '../types';
import Input from './Input';
import Button from './Button';

interface HealthRecordFormProps {
  onSave: (record: Omit<HealthRecord, 'id' | 'petId'>) => void;
  onCancel: () => void;
  record?: HealthRecord | null;
}

const HealthRecordForm: React.FC<HealthRecordFormProps> = ({ onSave, onCancel, record }) => {
  const [formData, setFormData] = useState({
    type: 'Vet Visit' as HealthRecord['type'],
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    vetName: '',
    notes: '',
  });

  useEffect(() => {
    if (record) {
      setFormData({
        type: record.type,
        date: record.date,
        vetName: record.vetName || '',
        notes: record.notes,
      });
    } else {
      // Reset form when adding a new record
      setFormData({
        type: 'Vet Visit',
        date: new Date().toISOString().split('T')[0],
        vetName: '',
        notes: '',
      });
    }
  }, [record]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Record Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md"
        >
          <option>Vet Visit</option>
          <option>Vaccination</option>
          <option>Medication</option>
          <option>Allergy</option>
          <option>Other</option>
        </select>
      </div>
      <Input
        id="date"
        name="date"
        type="date"
        label="Date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <Input
        id="vetName"
        name="vetName"
        label="Vet / Clinic Name (Optional)"
        value={formData.vetName}
        onChange={handleChange}
      />
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
          required
        ></textarea>
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Record</Button>
      </div>
    </form>
  );
};

export default HealthRecordForm;