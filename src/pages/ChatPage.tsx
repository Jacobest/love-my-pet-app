
import React, { useContext, useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChatContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, Send } from 'lucide-react';
import Button from '../components/Button';
import ChatBubble from '../components/ChatBubble';
import { useUsers } from '../hooks/useUsers';

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { user } = useAuth();
  const { threads, messages, sendMessage } = useContext(ChatContext);
  const { getUserById } = useUsers();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const thread = useMemo(() => threads.find(t => t.id === chatId), [threads, chatId]);
  
  const otherParticipant = useMemo(() => {
    if (!thread || !user) return null;
    const otherId = thread.participantIds.find(id => id !== user.id);
    return otherId ? getUserById(otherId) : null;
  }, [thread, user, getUserById]);
  
  const threadMessages = useMemo(() => {
    return messages
      .filter(m => m.chatId === chatId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [threadMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !chatId) return;
    sendMessage(chatId, newMessage.trim());
    setNewMessage('');
  };

  if (!user || !thread || !otherParticipant) {
    return <div>Loading chat...</div>;
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto bg-white rounded-lg shadow-md" style={{height: '75vh'}}>
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <Link to="/chats" className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={24} />
        </Link>
        <img src={otherParticipant.profilePhotoUrl} alt={otherParticipant.displayName} className="h-10 w-10 rounded-full object-cover ml-4"/>
        <h2 className="text-xl font-bold ml-3">{otherParticipant.displayName}</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          {threadMessages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} isSender={msg.senderId === user.id} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
            autoComplete="off"
          />
          <Button type="submit" variant="primary" className="rounded-full !p-3">
            <Send size={20} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;