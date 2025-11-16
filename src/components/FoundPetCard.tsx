
import React, { useState, useContext } from 'react';
import { FoundPetStory } from '../types';
import { Heart, MessageSquare, MessageCircle, Pin, PinOff } from 'lucide-react';
import PetStatusBadge from './PetStatusBadge';
import Button from './Button';
import { StarRatingDisplay } from './StarRating';
import { useAuth } from '../hooks/useAuth';
import { PinContext } from '../App';

interface FoundPetCardProps {
  story: FoundPetStory;
  commentCount: number;
  onViewComments: (storyId: string) => void;
  onPinRequest: (story: FoundPetStory) => void;
}

const FoundPetCard: React.FC<FoundPetCardProps> = ({ story, commentCount, onViewComments, onPinRequest }) => {
  const { user } = useAuth();
  const { pinnedItems, unpinItem } = useContext(PinContext);
  
  const [likes, setLikes] = useState(story.likes);
  const [isLiked, setIsLiked] = useState(false);

  const isPinned = pinnedItems.some(p => p.itemId === `story-${story.id}` && p.itemType === 'story');

  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col relative">
       {isPinned && (
        <div className="absolute top-2 right-2 bg-brand-accent text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-10">
          <Pin size={12} />
          PINNED
        </div>
      )}
      <div className="relative">
        <img src={story.pet.photoUrls[0]} alt={story.pet.name} className="w-full h-64 object-cover" />
        <div className="absolute top-4 left-4">
           <PetStatusBadge status={story.pet.status} className="!text-base shadow-lg" />
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-2xl font-bold text-brand-dark">{story.pet.name}</h3>
                <p className="text-gray-500 mb-2">{new Date(story.reunionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="text-right">
                <StarRatingDisplay rating={story.ownerRating} />
                <p className="text-xs text-gray-500 mt-1">App Rating</p>
            </div>
        </div>

        <div className="space-y-4 flex-grow my-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="font-semibold text-blue-800 flex items-center gap-2"><Heart className="h-4 w-4" /> Owner's Words</p>
            <p className="text-blue-700 italic">"{story.ownerTestimonial}"</p>
          </div>
          {story.finderTestimonial ? (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="font-semibold text-green-800 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> 
                  {story.finderName ? `${story.finderName}'s Words` : "Finder's Words"}
              </p>
              <p className="text-green-700 italic">"{story.finderTestimonial}"</p>
            </div>
          ) : (
             <div className="bg-gray-100 p-3 rounded-lg text-center">
                 <p className="text-sm text-gray-500">Finder's story coming soon...</p>
              </div>
          )}
        </div>

        <div className="border-t pt-4 flex justify-around items-center text-gray-600">
           <Button variant="ghost" onClick={handleLike} className={`flex items-center gap-2 ${isLiked ? 'text-brand-secondary' : ''}`}>
             <Heart size={20} className={isLiked ? 'fill-current' : ''}/>
             <span>{likes}</span>
           </Button>
           <Button variant="ghost" onClick={() => onViewComments(story.id)} className="flex items-center gap-2">
             <MessageCircle size={20} />
             <span>{commentCount}</span>
           </Button>
           {user?.role === 'Admin' && (
              isPinned ? (
                <Button variant="ghost" size="sm" onClick={() => unpinItem(`story-${story.id}`, 'story')} title="Unpin Post">
                  <PinOff className="h-5 w-5 text-brand-secondary" />
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => onPinRequest(story)} title="Pin Post">
                  <Pin className="h-5 w-5 text-gray-400 hover:text-brand-primary" />
                </Button>
              )
            )}
        </div>

      </div>
    </div>
  );
};

export default FoundPetCard;