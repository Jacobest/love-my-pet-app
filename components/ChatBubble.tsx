import React from 'react';
import { ChatMessage } from '../types';

interface ChatBubbleProps {
  message: ChatMessage;
  isSender: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isSender }) => {
  const bubbleClasses = isSender
    ? 'bg-brand-primary text-white self-end'
    : 'bg-gray-200 text-brand-dark self-start';

  const containerClasses = isSender ? 'flex justify-end' : 'flex justify-start';

  return (
    <div className={containerClasses}>
      <div className={`max-w-sm md:max-w-md p-3 rounded-2xl ${bubbleClasses}`}>
        <p>{message.text}</p>
        <p className={`text-xs mt-1 ${isSender ? 'text-blue-100' : 'text-gray-500'} text-right`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default ChatBubble;
