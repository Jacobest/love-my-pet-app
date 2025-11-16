import React from 'react';
import { HealthRecord } from '../types';
import { Stethoscope, Syringe, Pill, Siren, ClipboardList, Edit, Trash2 } from 'lucide-react';
import Button from './Button';

interface HealthRecordCardProps {
  record: HealthRecord;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const recordIcons: Record<HealthRecord['type'], React.ReactElement> = {
  'Vet Visit': <Stethoscope className="h-6 w-6 text-brand-primary" />,
  'Vaccination': <Syringe className="h-6 w-6 text-green-500" />,
  'Medication': <Pill className="h-6 w-6 text-yellow-500" />,
  'Allergy': <Siren className="h-6 w-6 text-orange-500" />,
  'Other': <ClipboardList className="h-6 w-6 text-gray-500" />,
};

const HealthRecordCard: React.FC<HealthRecordCardProps> = ({ record, isOwner, onEdit, onDelete }) => {
  const formattedDate = new Date(record.date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC', // To prevent off-by-one day errors
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">{recordIcons[record.type]}</div>
          <div>
            <h4 className="text-lg font-bold text-brand-dark">{record.type}</h4>
            <p className="text-sm text-gray-500 font-semibold">{formattedDate}</p>
            {record.vetName && <p className="text-sm text-gray-500">at {record.vetName}</p>}
          </div>
        </div>
        {isOwner && (
            <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onEdit} aria-label="Edit record">
                <Edit size={16} />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete} className="text-brand-alert hover:bg-brand-alert/10" aria-label="Delete record">
                <Trash2 size={16} />
            </Button>
            </div>
        )}
      </div>
      <p className="mt-3 text-gray-700 whitespace-pre-wrap pl-10">{record.notes}</p>
    </div>
  );
};

export default HealthRecordCard;