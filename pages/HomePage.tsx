import React, { useState, useMemo, useContext } from 'react';
import { usePets } from '../contexts/PetContext';
import { useStories } from '../hooks/useStories';
import { Alert, FoundPetStory, Post as PostType, PinnedItem } from '../types';
import AlertCard from '../components/AlertCard';
import FoundPetCard from '../components/FoundPetCard';
import Modal from '../components/Modal';
import CommentSection from '../components/CommentSection';
import { CommentContext, PostContext, PinContext } from '../App';
import AdCard from '../components/AdCard';
import { PawPrint, Pin as PinIcon, PlusCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import CreatePostForm from '../components/CreatePostForm';
import PostCard from '../components/PostCard';
import PinModal from '../components/PinModal';

type FeedItemData = Alert | FoundPetStory | PostType;

type FeedItem = {
  id: string;
  type: 'alert' | 'story' | 'post';
  timestamp: Date;
  data: FeedItemData;
};

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { pets, getPetById } = usePets();
  const { stories } = useStories();
  const { posts } = useContext(PostContext);
  const { comments } = useContext(CommentContext);
  const { pinnedItems } = useContext(PinContext);

  const [selectedStory, setSelectedStory] = useState<FoundPetStory | null>(null);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [itemToPin, setItemToPin] = useState<{ item: FeedItemData, type: PinnedItem['itemType'] } | null>(null);

  const feedItems: FeedItem[] = useMemo(() => {
    const alertItems: FeedItem[] = pets
      .filter(p => p.status === 'Lost')
      .map(pet => ({
        id: `alert-${pet.id}`,
        type: 'alert',
        timestamp: new Date(pet.lastSeenTime || 0),
        data: {
          id: `alert-${pet.id}`,
          pet,
          message: pet.missingReportMessage || `Please help find ${pet.name}.`
        } as Alert,
      }));
    
    const approvedStories = stories.filter(story => {
      const pet = getPetById(story.pet.id);
      return pet && pet.status === 'Reunited';
    });

    const storyItems: FeedItem[] = approvedStories
      .map(story => ({
        id: `story-${story.id}`,
        type: 'story',
        timestamp: new Date(story.reunionDate),
        data: story as FoundPetStory,
      }));

    const postItems: FeedItem[] = posts
      .filter(post => {
        if (post.isAdminPost) {
            if (post.status !== 'Active') return false;
            
            const now = new Date().getTime();
            const start = post.startDate ? new Date(post.startDate).getTime() : 0;
            // If no end date, it never expires
            const end = post.endDate ? new Date(post.endDate).setHours(23, 59, 59, 999) : Infinity;

            return now >= start && now <= end;
        }
        return true; // Not an admin post, always include it
      })
      .map(post => ({
        id: `post-${post.id}`,
        type: 'post',
        timestamp: new Date(post.timestamp),
        data: post as PostType,
      }));

    return [...alertItems, ...storyItems, ...postItems].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [pets, stories, posts, getPetById]);

  // Comment modal logic
  const handleViewComments = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (story) setSelectedStory(story);
  };
  const handleCloseComments = () => setSelectedStory(null);
  const getCommentCount = (storyId: string) => comments.filter(c => c.storyId === storyId).length;

  // Pinning Logic
  const handlePinRequest = (item: FeedItemData, type: PinnedItem['itemType']) => {
    setItemToPin({ item, type });
  };

  const activePins = useMemo(() => {
    const now = new Date();
    return pinnedItems.filter(p => {
        const start = new Date(p.startDate);
        const end = new Date(p.endDate);
        end.setHours(23, 59, 59, 999); // Ensure end date is inclusive
        return now >= start && now <= end;
    });
  }, [pinnedItems]);

  const pinnedFeedItems = useMemo(() => {
    return feedItems.filter(item => activePins.some(p => p.itemId === item.id && p.itemType === item.type));
  }, [feedItems, activePins]);
  
  const regularFeedItems = useMemo(() => {
    return feedItems.filter(item => !activePins.some(p => p.itemId === item.id && p.itemType === item.type));
  }, [feedItems, activePins]);


  const renderFeedItem = (item: FeedItem) => {
    switch (item.type) {
      case 'alert':
        return <AlertCard key={item.id} alert={item.data as Alert} onPinRequest={() => handlePinRequest(item.data, 'alert')} />;
      case 'story':
        const story = item.data as FoundPetStory;
        return <FoundPetCard key={item.id} story={story} commentCount={getCommentCount(story.id)} onViewComments={handleViewComments} onPinRequest={() => handlePinRequest(item.data, 'story')} />;
      case 'post':
        return <PostCard key={item.id} post={item.data as PostType} onPinRequest={() => handlePinRequest(item.data, 'post')} />;
      default:
        return null;
    }
  };

  const firstThreeItems = regularFeedItems.slice(0, 3);
  const remainingItems = regularFeedItems.slice(3);
  
  const remainingContentWithAds = remainingItems.reduce<React.ReactNode[]>((acc, item, index) => {
    acc.push(renderFeedItem(item));
    // The index starts from 0 for the 'remainingItems' array.
    // The original ad logic was to show an ad after every 4th item (index 3, 7, etc.).
    // Since we've already displayed 3 items, the next ad should appear after the first item in this new array (original index 3).
    // The condition (index + 3 + 1) % 4 === 0 checks against the original index.
    if ((index + 4) % 4 === 0) {
      acc.push(<AdCard key={`ad-${index}`} size="full" />);
    }
    return acc;
  }, []);

  return (
    <div className="space-y-8">
      <AdCard size="banner" />

      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-primary">Community Feed</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          The latest updates from your community. See active alerts, celebrate reunions, and stay connected.
        </p>
        {user && (
            <button
                onClick={() => setIsCreatePostModalOpen(true)}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-secondary hover:bg-brand-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary"
            >
                <PlusCircle size={20} />
                Create a Post
            </button>
        )}
      </div>

      {pinnedFeedItems.length > 0 && (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-brand-dark flex items-center gap-2"><PinIcon className="text-brand-accent"/> Pinned Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pinnedFeedItems.map(item => renderFeedItem(item))}
            </div>
        </div>
      )}

      <AdCard size="strip" />

      <div>
        {regularFeedItems.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {firstThreeItems.map(item => renderFeedItem(item))}
            </div>
            
            {remainingItems.length > 0 && (
              <>
                <AdCard size="strip" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {remainingContentWithAds}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <PawPrint className="mx-auto h-16 w-16 text-gray-300" />
            <h2 className="mt-6 text-2xl font-semibold text-brand-dark">Welcome to LoveMyPet!</h2>
            <p className="mt-2 text-gray-500">The community feed is quiet right now. Check back later for updates!</p>
          </div>
        )}
      </div>

      {selectedStory && (
        <Modal 
          isOpen={!!selectedStory} 
          onClose={handleCloseComments}
          title={`Comments for ${selectedStory.pet.name}'s Reunion`}
        >
          <CommentSection storyId={selectedStory.id} />
        </Modal>
      )}

      <Modal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        title="Create a New Post"
      >
        <CreatePostForm onPostCreated={() => setIsCreatePostModalOpen(false)} />
      </Modal>

      {itemToPin && user?.role === 'Admin' && (
        <PinModal
          isOpen={!!itemToPin}
          onClose={() => setItemToPin(null)}
          item={itemToPin.item}
          itemType={itemToPin.type}
        />
      )}
    </div>
  );
};

export default HomePage;