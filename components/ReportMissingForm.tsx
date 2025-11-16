import React, { useState, useRef, useEffect } from 'react';
import { Pet } from '../types';
import Button from './Button';
import Input from './Input';
import { generateMissingPetMessage } from '../services/geminiService';
import TypingIndicator from './TypingIndicator';

// Added a global declaration for window.google to prevent TypeScript errors.
declare global {
  interface Window {
    google: any;
  }
}

interface ReportMissingFormProps {
  pet: Pet;
  onSave: (data: { lastSeenLocation: string; lastSeenTime: string; message: string; lat?: number; lng?: number; }) => void;
  onCancel: () => void;
}

const ReportMissingForm: React.FC<ReportMissingFormProps> = ({ pet, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    lastSeenLocation: '',
    lastSeenTime: '',
    message: '',
    lat: null as number | null,
    lng: null as number | null,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    const initAutocomplete = () => {
      if (window.google && window.google.maps && autocompleteInputRef.current && !autocompleteRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInputRef.current);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry && place.geometry.location && place.formatted_address) {
            setFormData(prev => ({
              ...prev,
              lastSeenLocation: place.formatted_address,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }));
          }
        });
        autocompleteRef.current = autocomplete;
      }
    };

    const intervalId = setInterval(() => {
      if (window.google && window.google.maps) {
        clearInterval(intervalId);
        initAutocomplete();
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
      if (autocompleteRef.current && window.google && autocompleteInputRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteInputRef.current);
        autocompleteRef.current.unbindAll();
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        const pacContainers = document.querySelectorAll('.pac-container');
        pacContainers.forEach(container => container.remove());
        autocompleteRef.current = null;
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Clear lat/lng when location is manually edited to ensure data consistency.
    setFormData(prev => {
      const newState = { ...prev, [name]: value };
      if (name === 'lastSeenLocation') {
        newState.lat = null;
        newState.lng = null;
      }
      return newState;
    });
  };
  
  const handleGenerateMessage = async () => {
    if (!formData.lastSeenLocation || !formData.lastSeenTime) {
      alert('Please fill in Last Seen Location and Date & Time before generating a message.');
      return;
    }
    setIsGenerating(true);
    try {
      const formattedTime = new Date(formData.lastSeenTime).toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
      });
      const generatedMessage = await generateMissingPetMessage(pet, formData.lastSeenLocation, formattedTime);
      setFormData(prev => ({...prev, message: generatedMessage}));
    } catch(error) {
      console.error("Failed to generate AI message", error);
      alert("There was an error generating the message. Please try again or write one manually.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = (lat?: number, lng?: number) => {
      onSave({
        lastSeenLocation: formData.lastSeenLocation,
        lastSeenTime: formData.lastSeenTime,
        message: formData.message,
        lat,
        lng,
      });
      setIsSubmitting(false);
    };
    
    // If we already have lat/lng from autocomplete, proceed.
    if (formData.lat !== null && formData.lng !== null) {
      submitData(formData.lat, formData.lng);
      return;
    }
    
    // If not, try to geocode the location string entered by the user, if maps API is available.
    if (window.google && window.google.maps && formData.lastSeenLocation) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: formData.lastSeenLocation }, (results: any, status: string) => {
            if (status === 'OK' && results && results[0]?.geometry?.location) {
                const lat = results[0].geometry.location.lat();
                const lng = results[0].geometry.location.lng();
                submitData(lat, lng);
            } else {
                console.warn("Could not geocode the provided location. Submitting without coordinates.");
                // The geocoding failed, but we should still submit the report with the text location.
                submitData();
            }
        });
    } else {
      // If Google Maps is not available (e.g., no API key), submit without coordinates.
      submitData();
    }
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
      
      <p className="text-sm text-gray-600">Please provide details about when and where your pet was last seen. This will help the community in their search.</p>

      <div className="space-y-4">
        <Input 
          ref={autocompleteInputRef}
          id="lastSeenLocation" 
          name="lastSeenLocation" 
          label="Last Seen Location" 
          value={formData.lastSeenLocation} 
          onChange={handleChange} 
          placeholder="e.g., Near Main Street Park"
          required 
        />
        <Input 
          id="lastSeenTime" 
          name="lastSeenTime" 
          type="datetime-local"
          label="Last Seen Date & Time" 
          value={formData.lastSeenTime} 
          onChange={handleChange} 
          required 
        />
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message to the Community</label>
            <Button type="button" variant="ghost" size="sm" onClick={handleGenerateMessage} disabled={isGenerating}>
                ✨ Generate with AI
            </Button>
          </div>
          {isGenerating && <TypingIndicator />}
          <textarea 
            id="message" 
            name="message" 
            rows={5} 
            value={formData.message} 
            onChange={handleChange} 
            placeholder="Add any important details. Is your pet friendly or shy? Are they wearing a collar? Or, use the AI generator!"
            className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
            required
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="danger" isLoading={isSubmitting}>Submit Alert</Button>
      </div>
    </form>
  );
};

export default ReportMissingForm;