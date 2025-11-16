import React, { useState, useContext } from 'react';
import FoundPetCard from '../components/FoundPetCard';
import Modal from '../components/Modal';
import CommentSection from '../components/CommentSection';
import { CommentContext } from '../App';
import { FoundPetStory } from '../types';
import AdCard from '../components/AdCard';
import { useStories } from '../hooks/useStories';
import { usePets } from '../contexts/PetContext';

const FoundPetsPage: React.FC = () => {
  const { comments } = useContext(CommentContext);
  const { stories } = useStories();
  const { getPetById } = usePets();
  const [selectedStory, setSelectedStory] = useState<FoundPetStory | null>(null);

  const handleViewComments = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (story) {
      setSelectedStory(story);
    }
  };

  const handleCloseComments = () => {
    setSelectedStory(null);
  };

  const getCommentCount = (storyId: string) => {
    return comments.filter(c => c.storyId === storyId).length;
  }

  const approvedStories = stories.filter(story => {
    const pet = getPetById(story.pet.id);
    return pet && pet.status === 'Reunited';
  });

  const sortedStories = [...approvedStories].sort((a, b) => new Date(b.reunionDate).getTime() - new Date(a.reunionDate).getTime());

  const contentWithAds = sortedStories.reduce<React.ReactNode[]>((acc, story, index) => {
    acc.push(
      <FoundPetCard 
        key={story.id} 
        story={story} 
        commentCount={getCommentCount(story.id)}
        onViewComments={handleViewComments}
        // FIX: Add missing onPinRequest prop. Pinning is not supported on this page.
        onPinRequest={() => {}}
      />
    );

    // Add a full-sized ad card after every 3rd story
    if ((index + 1) % 3 === 0) {
      acc.push(<AdCard key={`ad-${index}`} size="full" />);
    }

    return acc;
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-primary">Happy Reunions</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          Celebrating the heartwarming stories of pets who have been safely reunited with their families, thanks to our wonderful community.
        </p>
      </div>
      
      {/* Half-sized ad before the main content grid for all users */}
      <AdCard size="half" />

      {sortedStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contentWithAds}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-brand-dark">No Reunion Stories Yet</h2>
            <p className="mt-2 text-gray-500">Check back soon for heartwarming tales of found pets!</p>
        </div>
      )}

      {selectedStory && (
        <Modal 
          isOpen={!!selectedStory} 
          onClose={handleCloseComments}
          title={`Comments for ${selectedStory.pet.name}'s Reunion`}
        >
          <CommentSection storyId={selectedStory.id} />
        </Modal>
      )}
    </div>
  );
};

export default FoundPetsPage;