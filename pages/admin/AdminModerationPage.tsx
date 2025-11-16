import React from 'react';
import { useStories } from '../../hooks/useStories';
import { FoundPetStory } from '../../types';
import Button from '../../components/Button';
import { Check, X, Link as LinkIcon, Copy, Info } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import { useNotifications } from '../../hooks/useNotifications';
import { usePets } from '../../contexts/PetContext';
import { useSettings } from '../../contexts/SettingsContext';

const AdminModerationPage: React.FC = () => {
  const { stories, deleteFoundPetStory } = useStories();
  const { pets, updatePet } = usePets();
  const { getUserById } = useUsers();
  const { addNotification } = useNotifications();
  const { settings } = useSettings();

  const reviewPets = pets.filter(p => p.status === 'Review');

  const handleApprove = (story: FoundPetStory) => {
    updatePet(story.pet.id, { status: 'Reunited' });
    addNotification({
        type: 'alert',
        title: `Story Approved`,
        message: `The reunion story for ${story.pet.name} is now live on the Found Pets page.`,
        link: '/found',
        imageUrl: story.pet.photoUrls[0],
    });
  };
  
  const handleReject = (story: FoundPetStory) => {
    deleteFoundPetStory(story.id);
    updatePet(story.pet.id, { status: 'Safe' }); // Revert pet to Safe status
    addNotification({
        type: 'alert',
        title: `Story Rejected`,
        message: `The reunion story for ${story.pet.name} has been rejected and removed.`,
        link: '/admin/moderation'
    });
  };

  const FinderLink: React.FC<{ token: string | undefined }> = ({ token }) => {
    const [isCopied, setIsCopied] = React.useState(false);
    if (!token) return <p className="text-sm text-gray-500">No token available.</p>;

    const link = `${window.location.origin}${window.location.pathname}#/finder-testimonial/${token}`;
    
    const handleCopy = () => {
        navigator.clipboard.writeText(link);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="mt-2 p-3 bg-gray-100 rounded-md">
            <p className="text-xs text-gray-600 mb-2">Share this secure, one-time link with the finder:</p>
            <div className="flex items-center gap-2">
            <input type="text" readOnly value={link} className="flex-grow bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm p-2" />
            <Button type="button" variant="ghost" onClick={handleCopy} className="flex-shrink-0">
                <Copy size={16} className="mr-2" />
                {isCopied ? 'Copied!' : 'Copy'}
            </Button>
            </div>
        </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-brand-dark mb-6">Reunion Story Moderation</h1>
      
      {!settings.contentModeration.requireStoryApproval && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-md my-4 flex items-start gap-3">
              <Info className="h-5 w-5 mt-0.5 flex-shrink-0"/>
              <p>
                <strong>Moderation is currently turned off.</strong> Reunion stories will be published automatically without review. 
                You can enable moderation in the <a href="#/admin/settings" className="font-bold underline">Admin Settings</a>.
              </p>
          </div>
      )}

      <div className="space-y-6">
        {reviewPets.length > 0 ? (
          reviewPets.map(pet => {
            const story = stories.find(s => s.pet.id === pet.id);
            if (!story) return null;

            const owner = getUserById(story.pet.ownerId);
            return (
              <div key={story.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                  <img src={story.pet.photoUrls[0]} alt={story.pet.name} className="h-16 w-16 rounded-full object-cover" />
                  <div>
                    <h2 className="text-xl font-bold">{story.pet.name}'s Reunion</h2>
                    <p className="text-sm text-gray-500">Owner: {owner?.displayName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-3 rounded-lg md:col-span-2">
                        <h3 className="font-semibold text-blue-800">Owner's Testimonial:</h3>
                        <p className="text-blue-700 italic">"{story.ownerTestimonial}"</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2"><LinkIcon size={16}/> Link for Finder:</h3>
                        <FinderLink token={story.finderUniqueToken} />
                    </div>
                    <div className={`p-3 rounded-lg ${story.finderTestimonial ? 'bg-green-50' : 'bg-yellow-50'}`}>
                        <h3 className={`font-semibold ${story.finderTestimonial ? 'text-green-800' : 'text-yellow-800'}`}>Finder's Testimonial:</h3>
                        {story.finderTestimonial ? (
                            <>
                                <p className="text-sm text-gray-600">Finder's Name: {story.finderName}</p>
                                <p className="text-green-700 italic">"{story.finderTestimonial}"</p>
                            </>
                        ) : (
                            <p className="text-yellow-700 italic">Waiting for finder to submit their story...</p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-4 pt-4 border-t">
                  <Button variant="danger" size="sm" onClick={() => handleReject(story)}>
                    <X size={16} className="mr-2" /> Reject
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleApprove(story)}>
                    <Check size={16} className="mr-2" /> Approve & Post
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-gray-500">There are no pending reunion stories to review.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModerationPage;
