import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingInputProps {
  rating: number;
  setRating: (rating: number) => void;
  totalStars?: number;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({ rating, setRating, totalStars = 5 }) => {
  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            type="button"
            key={starValue}
            onClick={() => setRating(starValue)}
            className="p-1 focus:outline-none"
            aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
          >
            <Star
              className={`h-7 w-7 transition-colors cursor-pointer ${
                starValue <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-200'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRatingInput;

interface StarRatingDisplayProps {
  rating: number;
  totalStars?: number;
  className?: string;
}

export const StarRatingDisplay: React.FC<StarRatingDisplayProps> = ({ rating, totalStars = 5, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            className={`h-5 w-5 ${
              starValue <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        );
      })}
    </div>
  );
};