import React, { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { User } from '../types';
import { Info, Camera, ShieldCheck } from 'lucide-react';

const MemberProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name || '',
    displayName: user?.displayName || '',
    city: user?.city || '',
    email: user?.email || '',
    mobileNumber: user?.mobileNumber || '',
    contactPreference: user?.contactPreference || 'none',
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(user?.profilePhotoUrl || null);


  if (!user) {
    return <div>Loading...</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd upload the photo and get a URL. Here we save the base64 string.
    updateUser({ ...formData, profilePhotoUrl: photoPreview || user.profilePhotoUrl });
    alert("Profile updated successfully!");
    navigate('/profile');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center gap-6 mb-8">
            <div className="relative group">
                <img src={photoPreview || user.profilePhotoUrl} alt={user.displayName} className="h-32 w-32 rounded-full object-cover ring-4 ring-brand-primary/50 group-hover:ring-brand-primary transition-all"/>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-all text-white opacity-0 group-hover:opacity-100 cursor-pointer"
                    aria-label="Change profile picture"
                >
                    <Camera className="h-8 w-8" />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-center">Edit Your Profile</h1>
                <p className="text-gray-500 text-center">Keep your information up to date.</p>
            </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Public Information</h3>
                 <div className="space-y-4">
                    <Input id="name" name="name" label="Full Name" value={formData.name} onChange={handleChange} required />
                    <Input id="displayName" name="displayName" label="Display Name" value={formData.displayName} onChange={handleChange} required />
                    <Input id="city" name="city" label="City & State" value={formData.city} onChange={handleChange} required />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Private Contact Details</h3>
                <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-3 rounded-md my-4 flex items-start gap-3">
                    <Info className="h-5 w-5 mt-0.5 flex-shrink-0"/>
                    <p className="text-sm">This information is kept private and will only be used to connect you with a verified finder if your pet goes missing.</p>
                </div>
                 <div className="space-y-4">
                    <Input id="email" name="email" type="email" label="Contact Email" value={formData.email} onChange={handleChange} />
                    <Input id="mobileNumber" name="mobileNumber" type="tel" label="Contact Mobile Number" value={formData.mobileNumber} onChange={handleChange} />
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Preference</label>
                        <p className="text-xs text-gray-500 mb-2">Choose how you want to be contacted by finders through the app.</p>
                        <select
                            name="contactPreference"
                            value={formData.contactPreference}
                            onChange={handleChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md"
                        >
                            <option value="none">Do not allow contact</option>
                            <option value="email">Email only</option>
                            <option value="mobile">Mobile only</option>
                            <option value="both">Email and Mobile</option>
                        </select>
                    </div>

                    {user.memberVettedPhotoUrl && (
                      <div className="pt-4">
                        <label className="block text-sm font-medium text-gray-700">Member Vetting Photo</label>
                        <div className="mt-2 flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-100 rounded-lg border">
                          <img 
                            src={user.memberVettedPhotoUrl} 
                            alt="Vetting photo" 
                            className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex items-start gap-2 text-center sm:text-left">
                            <ShieldCheck className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-gray-600">
                              This photo is used for verification purposes to ensure community safety. It is not publicly visible. To update this photo, please contact LoveMyPet support.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="ghost" onClick={() => navigate('/profile')}>
                    Cancel
                </Button>
                <Button type="submit">
                    Save Changes
                </Button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default MemberProfilePage;