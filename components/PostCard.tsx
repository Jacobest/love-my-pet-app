
import React, { useState, useContext } from 'react';
import { Post } from '../types';
import { useUsers } from '../hooks/useUsers';
import { Heart, MessageCircle, Pin, PinOff, PawPrint } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../hooks/useAuth';
import { PinContext } from '../App';

interface PostCardProps {
  post: Post;
  onPinRequest: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPinRequest }) => {
  const { user } = useAuth();
  const { getUserById } = useUsers();
  const { pinnedItems, unpinItem } = useContext(PinContext);

  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);

  const author = getUserById(post.authorId);
  const isPinned = pinnedItems.some(p => p.itemId === `post-${post.id}` && p.itemType === 'post');

  const handleLike = () => {
    setIsLiked(prev => !prev);
    setLikes(prev => (isLiked ? prev - 1 : prev + 1));
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}m`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m`;
    return `now`;
  }

  if (!author) return null;

  const isAdminPost = post.isAdminPost;
  const cardClasses = `bg-white rounded-lg shadow-md overflow-hidden flex flex-col relative ${isAdminPost ? 'border-2 border-pink-400' : ''}`;

  const rolePillClasses: Record<string, string> = {
    Admin: 'bg-red-100 text-red-800',
    Moderator: 'bg-blue-100 text-blue-800',
  };


  return (
    <div className={cardClasses}>
       {isPinned && (
        <div className="absolute top-2 right-2 bg-brand-accent text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-10">
          <Pin size={12} />
          PINNED
        </div>
      )}
      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post content" className="w-full h-64 object-cover" />
      )}
      <div className="p-4 flex flex-col flex-grow">
        {isAdminPost ? (
            <div className="flex items-center gap-3 mb-3">
                <PawPrint className="h-10 w-10 text-brand-primary p-1 bg-pink-100 rounded-full flex-shrink-0" />
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-semibold">{author.displayName}</p>
                        { (author.role === 'Admin' || author.role === 'Moderator') &&
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${rolePillClasses[author.role]}`}>{author.role}</span>
                        }
                    </div>
                    <p className="text-xs text-gray-500">{timeAgo(post.timestamp)}</p>
                </div>
            </div>
        ) : (
            <div className="flex items-center gap-3 mb-3">
                <img src={author.profilePhotoUrl} alt={author.displayName} className="h-10 w-10 rounded-full object-cover" />
                <div>
                    <p className="font-semibold">{author.displayName}</p>
                    <p className="text-xs text-gray-500">{timeAgo(post.timestamp)}</p>
                </div>
            </div>
        )}

        {isAdminPost && post.category && (
            <div className="mb-3">
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-pink-500 text-white tracking-wide">{post.category}</span>
            </div>
        )}
        
        <p className="text-gray-800 flex-grow mb-4 whitespace-pre-wrap">{post.text}</p>

        <div className="border-t pt-2 flex justify-around items-center text-gray-600 mt-auto">
          <Button variant="ghost" onClick={handleLike} className={`flex items-center gap-2 ${isLiked ? 'text-brand-secondary' : ''}`}>
            <Heart size={20} className={isLiked ? 'fill-current' : ''} />
            <span>{likes}</span>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <MessageCircle size={20} />
            <span>Comment</span>
          </Button>
          {user?.role === 'Admin' && (
            isPinned ? (
              <Button variant="ghost" size="sm" onClick={() => unpinItem(`post-${post.id}`, 'post')} title="Unpin Post">
                <PinOff className="h-5 w-5 text-brand-secondary" />
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => onPinRequest(post)} title="Pin Post">
                <Pin className="h-5 w-5 text-gray-400 hover:text-brand-primary" />
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;