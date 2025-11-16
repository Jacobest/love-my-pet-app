import React, { useState, useRef, useEffect } from 'react';
import { useAds } from '../contexts/AdContext';
import Input from './Input';
import Button from './Button';
import { Advert, AdFormat, AdDisplayPage } from '../types';
import { Image as ImageIcon, LayoutPanelTop, Rows, Columns, AlertCircle } from 'lucide-react';

declare global {
  interface Window { google: any; }
}

export const AD_FORMATS: Record<AdFormat, { name: string; dims: string; w: number; h: number; icon: React.ReactNode }> = {
  banner: { name: 'Banner', dims: '800x200px', w: 800, h: 200, icon: <LayoutPanelTop /> },
  full: { name: 'Full Card', dims: '400x450px', w: 400, h: 450, icon: <Columns /> },
  half: { name: 'Half Card', dims: '400x200px', w: 400, h: 200, icon: <Rows /> },
  strip: { name: 'Strip', dims: '1200x150px', w: 1200, h: 150, icon: <Rows /> },
};
const DISPLAY_PAGES: AdDisplayPage[] = ['Feed', 'Alerts', 'Found'];

interface AdvertFormProps {
  onSave: (advertData: Omit<Advert, 'id'>, isNew: boolean) => void;
  onCancel: () => void;
  advert?: Advert;
  initialFormat: AdFormat;
}

const AdvertForm: React.FC<AdvertFormProps> = ({ onSave, onCancel, advert, initialFormat }) => {
  const { advertisers } = useAds();
  const [formData, setFormData] = useState<Omit<Advert, 'id'>>({
    advertiserId: advert?.advertiserId || '',
    name: advert?.name || '',
    description: advert?.description || '',
    category: advert?.category || '',
    imageUrl: advert?.imageUrl || '',
    url: advert?.url || '',
    startDate: advert?.startDate || new Date().toISOString().split('T')[0],
    endDate: advert?.endDate || '',
    frequency: advert?.frequency || '1/day',
    budget: advert?.budget || 0,
    displayPages: advert?.displayPages || [],
    format: advert?.format || initialFormat,
    geolocation: advert?.geolocation || '',
    status: advert?.status || 'Under Review',
  });

  const [imageError, setImageError] = useState('');
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    if (advert) {
        setFormData({
            advertiserId: advert.advertiserId,
            name: advert.name,
            description: advert.description || '',
            category: advert.category,
            imageUrl: advert.imageUrl,
            url: advert.url,
            startDate: advert.startDate,
            endDate: advert.endDate,
            frequency: advert.frequency,
            budget: advert.budget,
            displayPages: advert.displayPages,
            format: advert.format,
            geolocation: advert.geolocation,
            status: advert.status,
        });
    }
  }, [advert]);

  useEffect(() => {
    const initAutocomplete = () => {
        if (window.google && window.google.maps && autocompleteInputRef.current && !autocompleteRef.current) {
            const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInputRef.current, {
                types: ['(regions)'],
            });
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                setFormData(prev => ({ ...prev, geolocation: place.name || '' }));
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
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'budget' ? parseFloat(value) : value }));
  };
  
  const handlePageSelect = (page: AdDisplayPage) => {
    setFormData(prev => {
        const newPages = prev.displayPages.includes(page)
            ? prev.displayPages.filter(p => p !== page)
            : [...prev.displayPages, page];
        return { ...prev, displayPages: newPages };
    });
  };

  const validateImage = (file: File, format: AdFormat): Promise<{ isValid: boolean; message: string; dataUrl?: string }> => {
    return new Promise((resolve) => {
        const { w, h } = AD_FORMATS[format];
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                if (img.width !== w || img.height !== h) {
                    resolve({ isValid: false, message: `Image must be ${w}x${h}px. Uploaded: ${img.width}x${img.height}px.` });
                } else if (file.size > 2 * 1024 * 1024) { // 2MB limit
                    resolve({ isValid: false, message: 'Image size must be less than 2MB.' });
                } else {
                    resolve({ isValid: true, message: 'Image is valid.', dataUrl: e.target?.result as string });
                }
            };
            img.onerror = () => resolve({ isValid: false, message: 'Could not load image file.' });
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setImageError('');
        const validation = await validateImage(file, formData.format);
        if (validation.isValid && validation.dataUrl) {
            setFormData(prev => ({ ...prev, imageUrl: validation.dataUrl! }));
        } else {
            setImageError(validation.message);
            // FIX: If validation fails, do not clear the imageUrl.
            // This preserves the old image in edit mode and prevents an invalid state.
            // Also, clear the file input so the user can re-select the same file.
            if (e.target) {
              e.target.value = '';
            }
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
        setImageError('An image is required.');
        return;
    }
    if(new Date(formData.startDate) > new Date(formData.endDate)) {
        alert("End date cannot be before start date.");
        return;
    }
    onSave(formData, !advert);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Advertiser</label>
          <select name="advertiserId" value={formData.advertiserId} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
            <option value="">Select an advertiser...</option>
            {advertisers.map(a => <option key={a.id} value={a.id}>{a.companyName}</option>)}
          </select>
        </div>
        <Input id="name" name="name" label="Campaign Name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input id="category" name="category" label="Category" value={formData.category} onChange={handleChange} placeholder="e.g., Pet Food, Vets" required />
        <Input ref={autocompleteInputRef} id="geolocation" name="geolocation" label="Geo-location Target" value={formData.geolocation} onChange={handleChange} placeholder="e.g., San Francisco Bay Area" />
      </div>

      <div>
         <label className="block text-sm font-medium text-gray-700">Ad Image ({AD_FORMATS[formData.format].dims})</label>
         <div className="mt-1 flex items-center gap-4">
            <div className="w-32 h-32 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                {formData.imageUrl ? <img src={formData.imageUrl} alt="preview" className="object-contain h-full w-full" /> : <ImageIcon className="h-12 w-12 text-gray-300" />}
            </div>
            <input type="file" name="image" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" required={!advert} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20"/>
         </div>
         {imageError && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle size={14}/> {imageError}</p>}
      </div>

      <Input id="url" name="url" type="url" label="Advert URL Link" value={formData.url} onChange={handleChange} placeholder="https://example.com/product" required />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input id="startDate" name="startDate" type="date" label="Start Date" value={formData.startDate} onChange={handleChange} required />
        <Input id="endDate" name="endDate" type="date" label="End Date" value={formData.endDate} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input id="frequency" name="frequency" label="Frequency" value={formData.frequency} onChange={handleChange} placeholder="e.g., 5/day" required />
        <Input id="budget" name="budget" type="number" label="Budget ($)" value={formData.budget} onChange={handleChange} required />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Display Pages</label>
        <div className="mt-2 flex flex-wrap gap-3">
            {DISPLAY_PAGES.map(page => (
                <label key={page} className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.displayPages.includes(page)} onChange={() => handlePageSelect(page)} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                    {page}
                </label>
            ))}
        </div>
      </div>

      <div className="flex justify-end items-center gap-4 pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Advert</Button>
      </div>
    </form>
  );
};

export default AdvertForm;