import React from 'react';
import { Pet } from '../types';
import { ShieldCheck, AlertTriangle, Heart, Clock } from 'lucide-react';

interface PetStatusBadgeProps {
  status: Pet['status'];
  className?: string;
}

const statusConfig = {
  Safe: {
    text: 'Safe',
    icon: <ShieldCheck size={16} />,
    classes: 'bg-brand-success/10 text-brand-success',
  },
  Lost: {
    text: 'Lost',
    icon: <AlertTriangle size={16} />,
    classes: 'bg-brand-alert/10 text-brand-alert',
  },
  Reunited: {
    text: 'Reunited',
    icon: <Heart size={16} />,
    classes: 'bg-gray-200 text-brand-accent',
  },
  Review: {
    text: 'In Review',
    icon: <Clock size={16} />,
    classes: 'bg-brand-warning/10 text-brand-warning',
  },
};

const PetStatusBadge: React.FC<PetStatusBadgeProps> = ({ status, className = '' }) => {
  const config = statusConfig[status] || statusConfig.Safe;
  
  const baseClasses = 'inline-flex items-center gap-1.5 font-semibold px-3 py-1 text-sm rounded-full';
  
  return (
    <span className={`${baseClasses} ${config.classes} ${className}`}>
      {config.icon}
      {config.text}
    </span>
  );
};

export default PetStatusBadge;