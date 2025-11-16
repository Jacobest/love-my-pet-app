import React, { useState, useContext, useMemo } from 'react';
import { CommentContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import Comment from './Comment';
import { Send } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { censorText } from '../utils/censor';

interface CommentSectionProps {
  storyId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ storyId }) => {
  const { user } = useAuth();
  const { comments, addComment } = useContext(CommentContext);
  const { settings } = useSettings();
  const [newComment, setNewComment] = useState('');

  const storyComments = useMemo(() => {
    return comments
      .filter(c => c.storyId === storyId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [comments, storyId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && user) {
      const censoredComment = censorText(newComment.trim(), settings.contentModeration.profanityList);
      addComment(storyId, censoredComment);
      setNewComment('');
    } else if (!user) {
      alert("Please log in to comment.");
    }
  };

  return (
    <div className="flex flex-col" style={{ minHeight: '60vh', maxHeight: '70vh' }}>
      <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        {storyComments.length > 0 ? (
          storyComments.map(comment => <Comment key={comment.id} comment={comment} />)
        ) : (
          <p className="text-center text-gray-500 py-8">No comments yet. Be the first to say something!</p>
        )}
      </div>

      {user && (
        <div className="mt-4 pt-4 border-t">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <img src={user.profilePhotoUrl} alt={user.displayName} className="h-10 w-10 rounded-full object-cover" />
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-grow block w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
            />
            <Button type="submit" variant="primary" className="rounded-full !p-3">
              <Send size={18} />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CommentSection;