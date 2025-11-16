import React, { useState, useRef, useEffect } from 'react';
import { Pet } from '../types';
import { generatePetDescription, generatePetKeywords } from '../services/geminiService';
import Button from './Button';
import Input from './Input';
import Spinner from './Spinner';
import { Camera, Upload, X, Trash2 } from 'lucide-react';
import CameraCaptureModal from './CameraCaptureModal';

// FIX: Add a global declaration for window.google to resolve TypeScript errors.
declare global {
  interface Window {
    google: any;
  }
}

interface PetProfileFormProps {
  onSave: (pet: Partial<Pet>) => void;
  onCancel: () => void;
  onDelete?: (petId: string) => void;
  pet?: Pet;
}

const MAX_PHOTOS = 10;

const PetProfileForm: React.FC<PetProfileFormProps> = ({ onSave, onCancel, onDelete, pet }) => {
  const [formData, setFormData] = useState({
    name: pet?.name || '',
    species: pet?.species || 'Dog',
    breed: pet?.breed || '',
    color: pet?.color || '',
    age: pet?.age || 0,
    roamingArea: pet?.roamingArea || '',
    roamingAreaLat: pet?.roamingAreaLat,
    roamingAreaLng: pet?.roamingAreaLng,
    personalityTraits: '', // Specific to form for AI generation
    description: pet?.description || '',
    keywords: pet?.keywords || [],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>(pet?.photoUrls || []);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    const initAutocomplete = () => {
        if (window.google && window.google.maps && autocompleteInputRef.current && !autocompleteRef.current) {
            const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInputRef.current, {
                types: ['(regions)'],
            });
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place.geometry && place.geometry.location) {
                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();
                    const geocoder = new window.google.maps.Geocoder();
                    geocoder.geocode({ location: { lat, lng } }, (results: any, status: string) => {
                        if (status === 'OK' && results && results[0]) {
                            const addressComponents = results[0].address_components;
                            const neighborhoodComponent = addressComponents.find((c: any) => c.types.includes('neighborhood'));
                            const sublocalityComponent = addressComponents.find((c: any) => c.types.includes('sublocality'));
                            const localityComponent = addressComponents.find((c: any) => c.types.includes('locality'));

                            const neighborhood = neighborhoodComponent?.long_name || sublocalityComponent?.long_name || localityComponent?.long_name || place.name;
                            
                            setFormData(prev => ({
                                ...prev,
                                roamingArea: neighborhood,
                                roamingAreaLat: lat,
                                roamingAreaLng: lng,
                            }));
                        }
                    });
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
            pacContainers.forEach(container => {
                container.remove();
            });
            autocompleteRef.current = null;
        }
    };
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        // FIX: Clear geolocation data when the location text is manually edited. This prevents submitting stale coordinates if the user types a new address after selecting one from the autocomplete dropdown.
        const newState = { ...prev, [name]: name === 'age' ? parseInt(value) : value };
        if (name === 'roamingArea') {
            newState.roamingAreaLat = undefined;
            newState.roamingAreaLng = undefined;
        }
        return newState;
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const files = Array.from(e.target.files);
        const remainingSlots = MAX_PHOTOS - imagePreviews.length;
        
        if(files.length > remainingSlots) {
            alert(`You can only upload ${remainingSlots} more photos.`);
            files.splice(remainingSlots);
        }

        files.forEach(file => {
            // FIX: Added a type guard to ensure the file is a Blob. This resolves an issue where
            // the file's type was being inferred as 'unknown', causing a TypeScript error.
            if (file instanceof Blob) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            }
        });
    }
  };

  const removeImage = (index: number) => {
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
  }

  const handleCameraCapture = (dataUrl: string) => {
    if (imagePreviews.length < MAX_PHOTOS) {
        setImagePreviews(prev => [...prev, dataUrl]);
    } else {
        alert(`You have reached the maximum of ${MAX_PHOTOS} photos.`);
    }
    setIsCameraModalOpen(false);
  };


  const handleGenerateAIContent = async () => {
    if (!formData.name || !formData.breed) {
      alert('Please fill in at least Name and Breed before generating AI content.');
      return;
    }
    setIsGenerating(true);
    try {
        const descPromise = generatePetDescription(formData, imagePreviews[0] || null);
        const keywordsPromise = generatePetKeywords(formData);
        
        const [description, keywords] = await Promise.all([descPromise, keywordsPromise]);

        setFormData(prev => ({ ...prev, description, keywords }));
    } catch (error) {
        console.error("Failed to generate AI content", error);
        alert("There was an error generating content. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(imagePreviews.length === 0) {
        alert("Please upload at least one photo of your pet.");
        return;
    }
    const { personalityTraits, ...petToSave } = formData;
    const finalPetData = { ...petToSave, photoUrls: imagePreviews }; 
    onSave(finalPetData);
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input id="name" name="name" label="Pet Name" value={formData.name} onChange={handleChange} required />
        <div>
          <label htmlFor="species" className="block text-sm font-medium text-gray-700">Species</label>
          <select id="species" name="species" value={formData.species} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
            <option>Dog</option>
            <option>Cat</option>
            <option>Other</option>
          </select>
        </div>
        <Input id="breed" name="breed" label="Breed" value={formData.breed} onChange={handleChange} required />
        <Input id="color" name="color" label="Color" value={formData.color} onChange={handleChange} />
        <Input id="age" name="age" type="number" label="Age" value={formData.age} onChange={handleChange} />
        <Input ref={autocompleteInputRef} id="roamingArea" name="roamingArea" label="Primary Roaming Area (e.g., Neighborhood)" value={formData.roamingArea} onChange={handleChange} />
      </div>

       <div>
        <label className="block text-sm font-medium text-gray-700">Pet Photos ({imagePreviews.length}/{MAX_PHOTOS})</label>
        <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-4">
                {imagePreviews.map((src, index) => (
                    <div key={index} className="relative group">
                        <img src={src} alt={`Pet preview ${index + 1}`} className="h-24 w-24 rounded-md object-cover"/>
                        <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 p-0.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <X size={14}/>
                        </button>
                    </div>
                ))}
            </div>
            {imagePreviews.length < MAX_PHOTOS && (
                <div className="flex items-center justify-center gap-4">
                     <Button type="button" variant="ghost" onClick={() => fileInputRef.current?.click()}>
                        <Upload size={18} className="mr-2"/> Upload
                    </Button>
                    <input type="file" ref={fileInputRef} name="photo" onChange={handleFileChange} accept="image/*" className="hidden" multiple/>
                    <Button type="button" variant="ghost" onClick={() => setIsCameraModalOpen(true)}>
                        <Camera size={18} className="mr-2"/> Use Camera
                    </Button>
                </div>
            )}
        </div>
      </div>

      <div>
        <label htmlFor="personalityTraits" className="block text-sm font-medium text-gray-700">Personality Traits (for AI)</label>
        <textarea id="personalityTraits" name="personalityTraits" rows={2} value={formData.personalityTraits} onChange={handleChange} placeholder="e.g., Playful, loves cuddles, shy with strangers" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"></textarea>
      </div>

      <Button type="button" variant="ghost" onClick={handleGenerateAIContent} isLoading={isGenerating}>
        ✨ Generate Description & Keywords with AI
      </Button>

      {isGenerating && <Spinner />}

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">AI-Generated Description</label>
        <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"></textarea>
      </div>
      {/* FIX: The `Input` component was missing a required `label` prop. The surrounding code was also refactored to correctly use the `Input` component, which includes its own label, by removing the redundant external `<label>` and `<div>` wrapper. */}
      <Input id="keywords" name="keywords" label="AI-Generated Keywords" value={formData.keywords.join(', ')} onChange={(e) => setFormData(prev => ({...prev, keywords: e.target.value.split(',').map(k => k.trim())}))} />

      <div className="flex justify-between items-center gap-4 pt-4 border-t mt-6">
        <div>
          {pet && onDelete && (
            <Button type="button" variant="danger" onClick={() => onDelete(pet.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Pet
            </Button>
          )}
        </div>
        <div className="flex gap-4">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">Save Pet</Button>
        </div>
      </div>
    </form>
    <CameraCaptureModal 
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleCameraCapture}
    />
    </>
  );
};

export default PetProfileForm;