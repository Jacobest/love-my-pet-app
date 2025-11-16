
import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChatContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import { MessageSquare } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';

const ChatsPage: React.FC = () => {
  const { user } = useAuth();
  const { threads, messages } = useContext(ChatContext);
  const { getUserById } = useUsers();

  const userThreads = useMemo(() => {
    if (!user) return [];
    
    return threads
      .filter(thread => thread.participantIds.includes(user.id))
      .map(thread => {
        const otherParticipantId = thread.participantIds.find(id => id !== user.id);
        const otherParticipant = otherParticipantId ? getUserById(otherParticipantId) : undefined;
        const threadMessages = messages.filter(m => m.chatId === thread.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        const lastMessage = threadMessages[0];
        
        return {
          thread,
          otherParticipant,
          lastMessage,
        };
      })
      .sort((a, b) => {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
      });
  }, [user, threads, messages, getUserById]);

  if (!user) {
    return null; // Should be handled by router
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Chats</h1>
        <div className="space-y-4">
          {userThreads.length > 0 ? (
            userThreads.map(({ thread, otherParticipant, lastMessage }) => {
              if (!otherParticipant) return null;
              return (
              <Link
                key={thread.id}
                to={`/chat/${thread.id}`}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  src={otherParticipant?.profilePhotoUrl}
                  alt={otherParticipant?.displayName}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <h2 className="font-bold text-lg">{otherParticipant?.displayName}</h2>
                    {lastMessage && (
                      <p className="text-xs text-gray-500">
                        {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                  <p className="text-gray-600 truncate">
                    {lastMessage ? (
                      <>
                        {lastMessage.senderId === user.id && 'You: '}
                        {lastMessage.text}
                      </>
                    ) : (
                      'No messages yet'
                    )}
                  </p>
                </div>
              </Link>
            )})
          ) : (
            <div className="text-center py-12 text-gray-500">
               <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-xl font-semibold">No Chats</h3>
              <p>Your chats with other members will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;