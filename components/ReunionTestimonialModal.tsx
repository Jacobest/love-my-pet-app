import React, { useState } from 'react';
import { Pet } from '../types';
import Modal from './Modal';
import Button from './Button';
import StarRatingInput from './StarRating';
import { generateOwnerTestimonial } from '../services/geminiService';
import TypingIndicator from './TypingIndicator';

interface ReunionTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { testimonial: string, rating: number }) => void;
  pet: Pet;
}

const ReunionTestimonialModal: React.FC<ReunionTestimonialModalProps> = ({ isOpen, onClose, onSubmit, pet }) => {
  const [testimonial, setTestimonial] = useState('');
  const [rating, setRating] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    const generatedText = await generateOwnerTestimonial(pet);
    setTestimonial(generatedText);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonial.trim() || rating === 0) {
      alert("Please write a testimonial and provide a star rating.");
      return;
    }
    onSubmit({ testimonial, rating });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Congratulations on finding ${pet.name}!`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
            <img src={pet.photoUrls[0]} alt={pet.name} className="h-24 w-24 rounded-full object-cover ring-4 ring-brand-primary/50 mx-auto" />
            <p className="mt-4 text-gray-600">Share your story to celebrate this happy moment with the community and help others find hope.</p>
        </div>
        
        <div>
            <div className="flex justify-between items-center mb-1">
                <label htmlFor="testimonial" className="block text-sm font-medium text-gray-700">Your Reunion Story</label>
                <Button type="button" variant="ghost" size="sm" onClick={handleGenerateAI} disabled={isGenerating}>
                    ✨ Generate with AI
                </Button>
            </div>
            {isGenerating && <TypingIndicator />}
            <textarea
                id="testimonial"
                rows={5}
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
                placeholder={`How did you find ${pet.name}? Share your experience...`}
                className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
                required
            ></textarea>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Rate Your Experience</label>
            <p className="text-xs text-gray-500 mb-2">How helpful was the LoveMyPet app in this reunion?</p>
            <StarRatingInput rating={rating} setRating={setRating} />
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Story</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReunionTestimonialModal;