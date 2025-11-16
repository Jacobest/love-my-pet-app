
import React, { useState, useRef, useContext } from 'react';
import Button from './Button';
import { PostContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import { Upload, X } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { censorText } from '../utils/censor';

interface CreatePostFormProps {
  onPostCreated: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated }) => {
  const { addPost } = useContext(PostContext);
  const { user } = useAuth();
  const { settings } = useSettings();
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      alert("Please write something for your post.");
      return;
    }
    const censoredText = censorText(text, settings.contentModeration.profanityList);
    addPost({ text: censoredText, imageUrl: imagePreview || undefined });
    onPostCreated();
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-3">
        <img src={user.profilePhotoUrl} alt={user.displayName} className="h-12 w-12 rounded-full object-cover" />
        <div>
          <p className="font-semibold">{user.displayName}</p>
          <p className="text-sm text-gray-500">Share with the community</p>
        </div>
      </div>
      <div>
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>
      
      {imagePreview && (
         <div className="relative group">
            <img src={imagePreview} alt="Post preview" className="w-full h-auto max-h-60 rounded-md object-cover"/>
            <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75">
                <X size={16}/>
            </button>
        </div>
      )}

      <div>
        <Button type="button" variant="ghost" onClick={() => fileInputRef.current?.click()}>
          <Upload size={18} className="mr-2"/> {imagePreview ? 'Change Photo' : 'Add Photo'}
        </Button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full">Post</Button>
      </div>
    </form>
  );
};

export default CreatePostForm;
