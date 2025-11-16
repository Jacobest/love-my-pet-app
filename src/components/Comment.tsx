
import React from 'react';
import { Comment as CommentType } from '../types';
import { useUsers } from '../hooks/useUsers';

interface CommentProps {
  comment: CommentType;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const { getUserById } = useUsers();
  const author = getUserById(comment.authorId);

  if (!author) {
    return null; // or a placeholder for deleted user
  }

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "min ago";
    return "just now";
  }

  return (
    <div className="flex items-start gap-3">
      <img src={author.profilePhotoUrl} alt={author.displayName} className="h-10 w-10 rounded-full object-cover flex-shrink-0" />
      <div>
        <div className="bg-gray-100 rounded-xl px-4 py-2">
          <p className="font-semibold text-sm">{author.displayName}</p>
          <p className="text-gray-800">{comment.text}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1 ml-2">{timeAgo(comment.timestamp)}</p>
      </div>
    </div>
  );
};

export default Comment;