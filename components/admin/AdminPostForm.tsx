import React, { useState, useEffect, useRef, useContext } from 'react';
import { PostContext } from '../../App';
import { useAuth } from '../../hooks/useAuth';
import { Post } from '../../types';
import Button from '../Button';
import Input from '../Input';
import { Upload, X } from 'lucide-react';

interface AdminPostFormProps {
  postToEdit: Post | null;
  onSave: () => void;
  onCancel: () => void;
}

const AdminPostForm: React.FC<AdminPostFormProps> = ({ postToEdit, onSave, onCancel }) => {
  const { user } = useAuth();
  const { addPost, updatePost } = useContext(PostContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    text: '',
    imageUrl: '',
    category: 'Announcement' as Post['category'],
    status: 'Active' as Post['status'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0], // 30 days from now
  });

  useEffect(() => {
    if (postToEdit) {
      setFormData({
        text: postToEdit.text,
        imageUrl: postToEdit.imageUrl || '',
        category: postToEdit.category || 'Announcement',
        status: postToEdit.status || 'Active',
        startDate: postToEdit.startDate ? postToEdit.startDate.split('T')[0] : '',
        endDate: postToEdit.endDate ? postToEdit.endDate.split('T')[0] : '',
      });
    } else {
        // Reset for new post
        setFormData({
            text: '',
            imageUrl: '',
            category: 'Announcement',
            status: 'Active',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
        });
    }
  }, [postToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, imageUrl: '' });
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
        alert("End date cannot be before start date.");
        return;
    }

    const postData = {
      ...formData,
      isAdminPost: true,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
    };

    if (postToEdit) {
      updatePost(postToEdit.id, postData);
    } else {
      addPost(postData);
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700">Post Content</label>
        <textarea
          id="text"
          name="text"
          value={formData.text}
          onChange={handleChange}
          rows={6}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
          required
        />
      </div>

       <div>
        <label className="block text-sm font-medium text-gray-700">Image (Optional)</label>
        {formData.imageUrl && (
             <div className="mt-2 relative group w-full h-48">
                <img src={formData.imageUrl} alt="Post preview" className="w-full h-full rounded-md object-cover"/>
                <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75">
                    <X size={16}/>
                </button>
            </div>
        )}
        <Button type="button" variant="ghost" onClick={() => fileInputRef.current?.click()} className="mt-2">
          <Upload size={18} className="mr-2"/> {formData.imageUrl ? 'Change Photo' : 'Add Photo'}
        </Button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
            <option>Announcement</option>
            <option>Important Message</option>
          </select>
        </div>
         <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
            <option>Active</option>
            <option>Archived</option>
          </select>
        </div>
      </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input id="startDate" name="startDate" type="date" label="Start Date" value={formData.startDate} onChange={handleChange} required />
        <Input id="endDate" name="endDate" type="date" label="End Date" value={formData.endDate} onChange={handleChange} required />
       </div>


      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{postToEdit ? 'Save Changes' : 'Create Post'}</Button>
      </div>
    </form>
  );
};

export default AdminPostForm;
