
import React, { useState, useCallback, useMemo, useEffect, useRef, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, ChatThread, ChatMessage, Notification, Pet, Comment, FoundPetStory, Post, PinnedItem, Advertiser, Advert, Policy, AppSettings, SiteSettings } from './types';
import { MOCK_USER, MOCK_CHAT_THREADS, MOCK_CHAT_MESSAGES, MOCK_USERS, MOCK_PETS, MOCK_COMMENTS, MOCK_FOUND_PETS, MOCK_POSTS, MOCK_ADVERTISERS, MOCK_ADVERTS, MOCK_POLICIES } from './constants';
import { PetContext } from './contexts/PetContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AlertsPage from './pages/AlertsPage';
import FoundPetsPage from './pages/FoundPetsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import PetDetailPage from './pages/PetDetailPage';
import MemberProfilePage from './pages/MemberProfilePage';
import BottomNav from './components/BottomNav';
import CommunityGuidelinesPage from './pages/CommunityGuidelinesPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ContactPage from './pages/ContactPage';
import ChatsPage from './pages/InboxPage';
import ChatPage from './pages/ChatPage';
import NotificationContainer from './components/NotificationContainer';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminRoute from './components/AdminRoute';
import AdminPage from './pages/admin/AdminPage';
import { StoryContext } from './contexts/StoryContext';
import FinderTestimonialPage from './pages/FinderTestimonialPage';
import { AdContext } from './contexts/AdContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import MaintenancePage from './pages/MaintenancePage';

export const AuthContext = React.createContext<{
  user: User | null;
  login: (email: string) => boolean;
  logout: () => void;
  updateUser: (newDetails: Partial<User>) => void;
  signUp: (newUserData: Omit<User, 'id' | 'vettingStatus' | 'profilePhotoUrl' | 'role' | 'status' | 'joinDate'>) => void;
  googleLogin: () => void;
}>({
  user: null,
  login: () => false,
  logout: () => {},
  updateUser: () => {},
  signUp: () => {},
  googleLogin: () => {},
});

export const UserContext = React.createContext<{
  users: User[];
  getUserById: (id: string) => User | undefined;
  updateUserRole: (userId: string, role: User['role']) => void;
  updateUserVettingStatus: (userId: string, vettingStatus: User['vettingStatus']) => void;
  updateUserAccountStatus: (userId: string, status: User['status']) => void;
}>({
  users: [],
  getUserById: () => undefined,
  updateUserRole: () => {},
  updateUserVettingStatus: () => {},
  updateUserAccountStatus: () => {},
});

export const ChatContext = React.createContext<{
  threads: ChatThread[];
  messages: ChatMessage[];
  sendMessage: (chatId: string, text: string) => void;
  startChat: (participantId: string) => string;
}>({
  threads: [],
  messages: [],
  sendMessage: () => {},
  startChat: () => '',
});

export const NotificationContext = React.createContext<{
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
});

export const CommentContext = React.createContext<{
  comments: Comment[];
  addComment: (storyId: string, text: string) => void;
}>({
  comments: [],
  addComment: () => {},
});

export const PostContext = React.createContext<{
  posts: Post[];
  addPost: (postData: Omit<Post, 'id' | 'authorId' | 'timestamp' | 'likes'>) => void;
  updatePost: (postId: string, postData: Partial<Post>) => void;
}>({
  posts: [],
  addPost: () => {},
  updatePost: () => {},
});

export const PinContext = React.createContext<{
  pinnedItems: PinnedItem[];
  pinItem: (item: PinnedItem) => void;
  unpinItem: (itemId: string, itemType: PinnedItem['itemType']) => void;
}>({
  pinnedItems: [],
  pinItem: () => {},
  unpinItem: () => {},
});

export const PolicyContext = React.createContext<{
  policies: Policy[];
  updatePolicy: (policyId: Policy['id'], newContent: string) => void;
  setPolicyStatus: (policyId: Policy['id'], status: Policy['status']) => void;
}>({
  policies: [],
  updatePolicy: () => {},
  setPolicyStatus: () => {},
});


const AppContent: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { users } = useContext(UserContext);
  const { messages } = useContext(ChatContext);
  const { addNotification } = useContext(NotificationContext);
  const { settings } = useSettings();
  const location = useLocation();
  const prevMessagesCount = useRef(messages.length);
  const isAdminSection = location.pathname.startsWith('/admin');
  const isFinderPage = location.pathname.startsWith('/finder-testimonial');

  if (settings.general.maintenanceMode && user?.role !== 'Admin' && !isAdminSection) {
    return <MaintenancePage />;
  }

  useEffect(() => {
    if (messages.length > prevMessagesCount.current) {
      const newMessage = messages[messages.length - 1];
      const isOnChatPage = location.pathname === `/chat/${newMessage.chatId}`;
      
      if (user && newMessage.senderId !== user.id && !isOnChatPage) {
          const sender = users.find(u => u.id === newMessage.senderId);
          if (sender) {
              addNotification({
                  type: 'chat',
                  title: `New message from ${sender.displayName}`,
                  message: newMessage.text,
                  link: `/chat/${newMessage.chatId}`,
                  imageUrl: sender.profilePhotoUrl,
              });
          }
      }
    }
    prevMessagesCount.current = messages.length;
  }, [messages, location, user, addNotification, users]);
  
  return (
    <div className="flex flex-col min-h-screen text-brand-dark">
      {!isAdminSection && !isFinderPage && <Header />}
      <main className={`flex-grow ${!isAdminSection && 'container mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/found" element={<FoundPetsPage />} />
          <Route path="/pet/:id" element={<PetDetailPage />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/member-profile" element={user ? <MemberProfilePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/profile" />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/community-guidelines" element={<CommunityGuidelinesPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/chats" element={user ? <ChatsPage /> : <Navigate to="/login" />} />
          <Route path="/chat/:chatId" element={user ? <ChatPage /> : <Navigate to="/login" />} />
          <Route path="/finder-testimonial/:token" element={<FinderTestimonialPage />} />
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!isAdminSection && !isFinderPage && (
        <>
            <Footer />
            <BottomNav />
        </>
      )}
      <NotificationContainer />
    </div>
  )
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [pets, setPets] = useState<Pet[]>(MOCK_PETS);
  const [threads, setThreads] = useState<ChatThread[]>(MOCK_CHAT_THREADS);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>([]);
  const [foundPetStories, setFoundPetStories] = useState<FoundPetStory[]>(MOCK_FOUND_PETS);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>(MOCK_ADVERTISERS);
  const [adverts, setAdverts] = useState<Advert[]>(MOCK_ADVERTS);
  const [policies, setPolicies] = useState<Policy[]>(MOCK_POLICIES);
  
  const { settings } = useSettings();


  const prevPetsRef = useRef<Pet[]>(pets);

  useEffect(() => {
    const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (mapsApiKey && !document.querySelector('#google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=places,geocoding`;
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);
  
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
      const id = `notif-${Date.now()}`;
      const newNotification = { ...notification, id };
      setNotifications(prev => [...prev, newNotification]);

      setTimeout(() => {
          removeNotification(id);
      }, 5000);
  }, [removeNotification]);


  useEffect(() => {
    // Effect to create notifications for newly missing pets.
    if (!user) return; // Only notify logged-in users.

    const prevPets = prevPetsRef.current;

    const newlyLostPets = pets.filter(currentPet => {
      // Is the pet marked as lost and not owned by the current user?
      if (currentPet.status !== 'Lost' || currentPet.ownerId === user.id) {
        return false;
      }
      // Was the pet previously not marked as lost?
      const prevVersion = prevPets.find(p => p.id === currentPet.id);
      return !prevVersion || prevVersion.status !== 'Lost';
    });
    
    newlyLostPets.forEach(pet => {
        addNotification({
            type: 'alert',
            title: `Missing Pet Alert`,
            message: `${pet.name}, a ${pet.breed}, has been reported missing.`,
            link: `/pet/${pet.id}`,
            imageUrl: pet.photoUrls[0],
        });
    });

    // Update the ref for the next render.
    prevPetsRef.current = pets;

  }, [pets, user, addNotification]);

  const login = useCallback((email: string): boolean => {
    const userToLogin = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (userToLogin && userToLogin.status !== 'Blocked' && userToLogin.status !== 'Archived') {
      setUser(userToLogin);
      return true;
    }
    return false;
  }, [users]);

  const googleLogin = useCallback(() => {
    setUser(MOCK_USER);
  }, []);

  const signUp = useCallback((newUserData: Omit<User, 'id' | 'vettingStatus' | 'profilePhotoUrl' | 'role' | 'status' | 'joinDate'>) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      vettingStatus: 'Pending',
      profilePhotoUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
      role: settings.userPetManagement.defaultUserRole,
      status: 'Active',
      joinDate: new Date().toISOString(),
      ...newUserData,
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
    setUser(newUser);
  }, [settings]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateUser = useCallback((newDetails: Partial<User>) => {
    const currentUserId = user?.id;
    if (!currentUserId) return;
  
    setUser(currentUser => currentUser ? { ...currentUser, ...newDetails } as User : null);
    setUsers(currentUsers =>
      currentUsers.map(u => (u.id === currentUserId ? { ...u, ...newDetails } as User : u))
    );
  }, [user]);

  const updateUserRole = useCallback((userId: string, role: User['role']) => {
    setUsers(currentUsers =>
      currentUsers.map(u => (u.id === userId ? { ...u, role } : u))
    );
  }, []);

  const updateUserVettingStatus = useCallback((userId: string, vettingStatus: User['vettingStatus']) => {
    setUsers(currentUsers =>
      currentUsers.map(u => (u.id === userId ? { ...u, vettingStatus } : u))
    );
  }, []);

  const updateUserAccountStatus = useCallback((userId: string, status: User['status']) => {
    setUsers(currentUsers =>
      currentUsers.map(u => (u.id === userId ? { ...u, status } : u))
    );
  }, []);

  const sendMessage = useCallback((chatId: string, text: string) => {
    if (!user) return;
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      chatId,
      senderId: user.id,
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);

    const thread = threads.find(t => t.id === chatId);
    if (!thread) return;
    const otherParticipantId = thread.participantIds.find(id => id !== user.id);
    if (otherParticipantId) {
        setTimeout(() => {
            const replyMessage: ChatMessage = {
                id: `msg-${Date.now() + 1}`,
                chatId,
                senderId: otherParticipantId,
                text: "Thanks for the message! I'll take a look.",
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, replyMessage]);
        }, 2000);
    }
  }, [user, threads]);

  const startChat = useCallback((participantId: string): string => {
    if (!user) return '';

    const existingThread = threads.find(t => 
      t.participantIds.includes(user.id) && t.participantIds.includes(participantId)
    );

    if (existingThread) {
      return existingThread.id;
    }

    const newThread: ChatThread = {
      id: `chat-${Date.now()}`,
      participantIds: [user.id, participantId],
    };
    setThreads(prev => [...prev, newThread]);
    return newThread.id;
  }, [user, threads]);

  const addComment = useCallback((storyId: string, text: string) => {
    if(!user) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      storyId,
      authorId: user.id,
      text,
      timestamp: new Date().toISOString(),
    };
    setComments(prev => [...prev, newComment]);
  }, [user]);

  const addPost = useCallback((postData: Omit<Post, 'id' | 'authorId' | 'timestamp' | 'likes'>) => {
    if (!user) return;
    const newPost: Post = {
        id: `post-${Date.now()}`,
        authorId: user.id,
        timestamp: new Date().toISOString(),
        likes: 0,
        ...postData,
    };
    setPosts(prev => [newPost, ...prev]);
  }, [user]);

  const updatePost = useCallback((postId: string, postData: Partial<Post>) => {
    setPosts(prev => 
        prev.map(p => p.id === postId ? { ...p, ...postData } as Post : p)
    );
  }, []);

  const pinItem = useCallback((item: PinnedItem) => {
    setPinnedItems(prev => {
      // Remove any existing pin for the same item before adding the new one
      const filtered = prev.filter(p => !(p.itemId === item.itemId && p.itemType === item.itemType));
      return [...filtered, item];
    });
  }, []);
  
  const unpinItem = useCallback((itemId: string, itemType: PinnedItem['itemType']) => {
    // FIX: Changed `item.itemType` to `itemType` to correctly reference the function parameter.
    setPinnedItems(prev => prev.filter(p => !(p.itemId === itemId && p.itemType === itemType)));
  }, []);


  const getPetById = useCallback((id: string) => pets.find(p => p.id === id), [pets]);
  
  const getUserById = useCallback((id: string) => users.find(u => u.id === id), [users]);

  const addPet = useCallback((petData: Omit<Pet, 'id' | 'ownerId' | 'status'>) => {
    if (!user) return;
    const newPet: Pet = {
        id: `pet-${Date.now()}`,
        ownerId: user.id,
        status: 'Safe',
        ...petData,
    };
    setPets(prev => [...prev, newPet]);
  }, [user]);

  const updatePet = useCallback((petId: string, petData: Partial<Pet>) => {
    setPets(prev => {
        let resolvedPet: Pet | null = null;
        const newPets = prev.map(p => {
            if (p.id === petId) {
                const updatedPet = { ...p, ...petData } as Pet;
                if (p.status === 'Lost' && (updatedPet.status === 'Safe' || updatedPet.status === 'Reunited' || updatedPet.status === 'Review')) {
                    resolvedPet = updatedPet;
                }
                return updatedPet;
            }
            return p;
        });

        if (resolvedPet) {
            addNotification({
                type: 'alert',
                title: resolvedPet.status === 'Reunited' ? 'Pet Reunited!' : 'Alert Resolved',
                message: resolvedPet.status === 'Reunited' 
                    ? `${resolvedPet.name} has been successfully reunited!`
                    : `The alert for ${resolvedPet.name} has been resolved.`,
                link: `/pet/${resolvedPet.id}`,
                imageUrl: resolvedPet.photoUrls[0],
            });
        }
        
        return newPets;
    });
  }, [addNotification]);

  const deletePet = useCallback((petId: string) => {
    setPets(prev => prev.filter(p => p.id !== petId));
  }, []);

  const addFoundPetStory = useCallback((storyData: Omit<FoundPetStory, 'id' | 'likes' | 'commentIds'>) => {
    const newStory: FoundPetStory = {
      id: `found-${Date.now()}`,
      likes: 0,
      commentIds: [],
      ...storyData,
    };
    setFoundPetStories(prev => [newStory, ...prev]);

    const newStatus = settings.contentModeration.requireStoryApproval ? 'Review' : 'Reunited';
    updatePet(storyData.pet.id, { status: newStatus });
    
    addNotification({
        type: 'alert',
        title: newStatus === 'Review' ? 'Story Submitted for Review' : 'Reunion Story Published!',
        message: newStatus === 'Review'
            ? `Thank you! Your reunion story for ${storyData.pet.name} is in moderation.`
            : `The story for ${storyData.pet.name} is now live on the Found Pets page!`,
        link: newStatus === 'Review' ? '/profile' : '/found'
    });
  }, [settings, updatePet, addNotification]);

  const updateFoundPetStory = useCallback((storyId: string, updates: Partial<FoundPetStory>) => {
    setFoundPetStories(prev => 
      prev.map(story => 
        story.id === storyId ? { ...story, ...updates } : story
      )
    );
  }, []);

  const deleteFoundPetStory = useCallback((storyId: string) => {
    setFoundPetStories(prev => prev.filter(s => s.id !== storyId));
  }, []);

  const addAdvertiser = useCallback((advertiserData: Omit<Advertiser, 'id' | 'createdAt'>) => {
    const newAdvertiser: Advertiser = {
      id: `adv-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Active',
      ...advertiserData
    };
    setAdvertisers(prev => [...prev, newAdvertiser]);
  }, []);

  const updateAdvertiser = useCallback((advertiserId: string, advertiserData: Partial<Advertiser>) => {
    setAdvertisers(prev => prev.map(adv => adv.id === advertiserId ? { ...adv, ...advertiserData } as Advertiser : adv));
  }, []);
  
  const addAdvert = useCallback((advertData: Omit<Advert, 'id'>) => {
    const newAdvert: Advert = {
      id: `ad-${Date.now()}`,
      status: 'Under Review',
      ...advertData
    };
    setAdverts(prev => [...prev, newAdvert]);
  }, []);

  const updateAdvert = useCallback((advertId: string, advertData: Partial<Advert>) => {
    setAdverts(prev => prev.map(ad => ad.id === advertId ? { ...ad, ...advertData } as Advert : ad));
  }, []);

  const updatePolicy = useCallback((policyId: Policy['id'], newContent: string) => {
    setPolicies(currentPolicies =>
      currentPolicies.map(p =>
        p.id === policyId ? { ...p, content: newContent, lastUpdated: new Date().toISOString() } : p
      )
    );
  }, []);

  const setPolicyStatus = useCallback((policyId: Policy['id'], status: Policy['status']) => {
    setPolicies(currentPolicies =>
      currentPolicies.map(p =>
        p.id === policyId ? { ...p, status, lastUpdated: new Date().toISOString() } : p
      )
    );
  }, []);


  const authContextValue = useMemo(() => ({ user, login, logout, updateUser, signUp, googleLogin }), [user, login, logout, updateUser, signUp, googleLogin]);
  const userContextValue = useMemo(() => ({ users, getUserById, updateUserRole, updateUserVettingStatus, updateUserAccountStatus }), [users, getUserById, updateUserRole, updateUserVettingStatus, updateUserAccountStatus]);
  const chatContextValue = useMemo(() => ({ threads, messages, sendMessage, startChat }), [threads, messages, sendMessage, startChat]);
  const notificationContextValue = useMemo(() => ({ notifications, addNotification, removeNotification }), [notifications, addNotification, removeNotification]);
  const petContextValue = useMemo(() => ({ pets, getPetById, addPet, updatePet, deletePet }), [pets, getPetById, addPet, updatePet, deletePet]);
  const commentContextValue = useMemo(() => ({ comments, addComment }), [comments, addComment]);
  const postContextValue = useMemo(() => ({ posts, addPost, updatePost }), [posts, addPost, updatePost]);
  const pinContextValue = useMemo(() => ({ pinnedItems, pinItem, unpinItem }), [pinnedItems, pinItem, unpinItem]);
  const storyContextValue = useMemo(() => ({ stories: foundPetStories, addFoundPetStory, updateFoundPetStory, deleteFoundPetStory }), [foundPetStories, addFoundPetStory, updateFoundPetStory, deleteFoundPetStory]);
  const adContextValue = useMemo(() => ({ advertisers, adverts, addAdvertiser, updateAdvertiser, addAdvert, updateAdvert }), [advertisers, adverts, addAdvertiser, updateAdvertiser, addAdvert, updateAdvert]);
  const policyContextValue = useMemo(() => ({ policies, updatePolicy, setPolicyStatus }), [policies, updatePolicy, setPolicyStatus]);

  return (
    <AuthContext.Provider value={authContextValue}>
      <UserContext.Provider value={userContextValue}>
        <ChatContext.Provider value={chatContextValue}>
          <NotificationContext.Provider value={notificationContextValue}>
            <PetContext.Provider value={petContextValue}>
              <CommentContext.Provider value={commentContextValue}>
                <StoryContext.Provider value={storyContextValue}>
                  <PostContext.Provider value={postContextValue}>
                    <PinContext.Provider value={pinContextValue}>
                      <AdContext.Provider value={adContextValue}>
                        <PolicyContext.Provider value={policyContextValue}>
                            <HashRouter>
                              <AppContent />
                            </HashRouter>
                        </PolicyContext.Provider>
                      </AdContext.Provider>
                    </PinContext.Provider>
                  </PostContext.Provider>
                </StoryContext.Provider>
              </CommentContext.Provider>
            </PetContext.Provider>
          </NotificationContext.Provider>
        </ChatContext.Provider>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
};

const AppWithProviders: React.FC = () => (
  <SettingsProvider>
    <App />
  </SettingsProvider>
);

export default AppWithProviders;