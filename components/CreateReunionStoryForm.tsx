import React, { useState } from 'react';
import { Pet } from '../types';
import Input from './Input';
import Button from './Button';
import StarRatingInput from './StarRating';
import { LinkIcon, Copy } from 'lucide-react';

interface CreateReunionStoryFormProps {
  pet: Pet;
  onSave: (data: {
    reunionDate: string;
    ownerTestimonial: string;
    ownerRating: number;
    finderUniqueToken: string;
  }) => void;
  onCancel: () => void;
}

const CreateReunionStoryForm: React.FC<CreateReunionStoryFormProps> = ({ pet, onSave, onCancel }) => {
  const [reunionDate, setReunionDate] = useState(new Date().toISOString().split('T')[0]);
  const [ownerTestimonial, setOwnerTestimonial] = useState('');
  const [ownerRating, setOwnerRating] = useState(0);
  const [finderUniqueToken, setFinderUniqueToken] = useState('');
  const [finderLink, setFinderLink] = useState('');
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const handleGenerateLink = () => {
    const token = `token_${pet.id}_${Date.now()}`;
    const link = `${window.location.origin}${window.location.pathname}#/finder-testimonial/${token}`;
    setFinderUniqueToken(token);
    setFinderLink(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(finderLink);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerTestimonial || ownerRating === 0 || !finderUniqueToken) {
        alert("Please fill out the owner's testimonial, provide a rating, and generate a link for the finder.");
        return;
    }
    onSave({ reunionDate, ownerTestimonial, ownerRating, finderUniqueToken });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
        <img src={pet.photoUrls[0]} alt={pet.name} className="h-16 w-16 rounded-full object-cover"/>
        <div>
          <h3 className="text-xl font-semibold">{pet.name}</h3>
          <p className="text-gray-500">{pet.breed}</p>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          id="reunionDate"
          name="reunionDate"
          type="date"
          label="Reunion Date"
          value={reunionDate}
          onChange={(e) => setReunionDate(e.target.value)}
          required
        />
        <div>
          <label htmlFor="ownerTestimonial" className="block text-sm font-medium text-gray-700">Owner's Testimonial</label>
          <textarea
            id="ownerTestimonial"
            name="ownerTestimonial"
            rows={4}
            value={ownerTestimonial}
            onChange={(e) => setOwnerTestimonial(e.target.value)}
            placeholder={`e.g., "I was so worried when ${pet.name} went missing..."`}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
            required
          ></textarea>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Owner's Rating for App</label>
            <p className="text-xs text-gray-500 mb-2">How helpful was LoveMyPet in this reunion?</p>
            <StarRatingInput rating={ownerRating} setRating={setOwnerRating} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Finder's Contribution</label>
          {finderLink ? (
            <div className="mt-2 p-3 bg-gray-100 rounded-md">
              <p className="text-xs text-gray-600 mb-2">Share this secure, one-time link with the finder:</p>
              <div className="flex items-center gap-2">
                <input type="text" readOnly value={finderLink} className="flex-grow bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm p-2" />
                <Button type="button" variant="ghost" onClick={handleCopyLink} className="flex-shrink-0">
                  <Copy size={16} className="mr-2" />
                  {isLinkCopied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
          ) : (
            <Button type="button" variant="ghost" onClick={handleGenerateLink} className="mt-2">
              <LinkIcon size={16} className="mr-2" />
              Generate One-Time Link for Finder
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Create Story</Button>
      </div>
    </form>
  );
};

export default CreateReunionStoryForm;