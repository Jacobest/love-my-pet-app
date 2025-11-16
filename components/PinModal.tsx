
import React, { useState, useContext } from 'react';
import { PinnedItem, Alert, FoundPetStory, Post } from '../types';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { PinContext } from '../App';
import { Pin } from 'lucide-react';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Alert | FoundPetStory | Post;
  itemType: PinnedItem['itemType'];
}

const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose, item, itemType }) => {
  const { pinItem } = useContext(PinContext);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  });
  
  const getItemId = () => {
    switch(itemType) {
        case 'alert': return `alert-${(item as Alert).pet.id}`;
        case 'story': return `story-${(item as FoundPetStory).id}`;
        case 'post': return `post-${(item as Post).id}`;
        default: return '';
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(startDate) > new Date(endDate)) {
      alert("End date cannot be before the start date.");
      return;
    }
    pinItem({
      itemId: getItemId(),
      itemType,
      startDate,
      endDate,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pin Item to Feed">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand-accent/20">
                <Pin className="h-6 w-6 text-brand-accent" />
            </div>
            <p className="mt-4 text-gray-600">
                Select the date range for this item to be pinned to the top of the main feed.
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
                id="startDate"
                name="startDate"
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
            />
            <Input
                id="endDate"
                name="endDate"
                type="date"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
            />
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Set Pin
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PinModal;
