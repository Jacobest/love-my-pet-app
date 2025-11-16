import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-start space-x-1 p-2" aria-label="AI is generating a message...">
      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></div>
      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></div>
      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
  );
};

export default TypingIndicator;