
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../types';
import { MapPin, Clock, Pin, PinOff } from 'lucide-react';
import Button from './Button';
import PetStatusBadge from './PetStatusBadge';
import { useAuth } from '../hooks/useAuth';
import { PinContext } from '../App';

interface AlertCardProps {
  alert: Alert;
  onPinRequest: (alert: Alert) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onPinRequest }) => {
  const { user } = useAuth();
  const { pinnedItems, unpinItem } = useContext(PinContext);

  const isPinned = pinnedItems.some(p => p.itemId === `alert-${alert.pet.id}` && p.itemType === 'alert');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col relative">
      {isPinned && (
        <div className="absolute top-2 right-2 bg-brand-accent text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <Pin size={12} />
          PINNED
        </div>
      )}
      <img src={alert.pet.photoUrls[0]} alt={alert.pet.name} className="w-full h-64 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <PetStatusBadge status={alert.pet.status} />
          {user?.role === 'Admin' && (
            isPinned ? (
              <Button variant="ghost" size="sm" onClick={() => unpinItem(`alert-${alert.pet.id}`, 'alert')} title="Unpin Post" className="p-1 h-auto">
                <PinOff className="h-6 w-6 text-brand-secondary" />
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => onPinRequest(alert)} title="Pin Post" className="p-1 h-auto">
                <Pin className="h-6 w-6 text-gray-400 hover:text-brand-primary" />
              </Button>
            )
          )}
        </div>
        <h3 className="text-2xl font-bold text-brand-dark mt-2">{alert.pet.name}</h3>
        <p className="text-gray-600 font-semibold">{alert.pet.breed}</p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="h-5 w-5 text-brand-secondary" />
            <span>Last seen: {alert.pet.lastSeenLocation}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="h-5 w-5 text-brand-secondary" />
            <span>{new Date(alert.pet.lastSeenTime || 0).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
          </div>
        </div>
        <p className="mt-4 text-gray-800 flex-grow">{alert.message}</p>
        <div className="mt-6">
          <Button as={Link} to={`/pet/${alert.pet.id}`} className="w-full">
            View Details & Contact
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
