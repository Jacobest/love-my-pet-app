
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Heart, User, MessageSquare } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const BottomNav: React.FC = () => {
  const { user } = useAuth();

  const navLinkClasses = ({ isActive }: { isActive: boolean }): string =>
    `flex flex-col items-center justify-center gap-1 transition-colors w-full pt-2 pb-1 ${
      isActive ? 'text-brand-primary' : 'text-gray-600 hover:text-brand-primary'
    }`;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-t-md z-50 flex justify-around">
      <NavLink to="/" className={navLinkClasses}>
        <Home className="h-6 w-6" />
        <span className="text-xs font-medium">Home</span>
      </NavLink>
      <NavLink to="/found" className={navLinkClasses}>
        <Heart className="h-6 w-6" />
        <span className="text-xs font-medium">Found</span>
      </NavLink>
       <NavLink to={user ? "/chats" : "/login"} className={navLinkClasses}>
        <MessageSquare className="h-6 w-6" />
        <span className="text-xs font-medium">Chats</span>
      </NavLink>
      <NavLink to={user ? "/profile" : "/login"} className={navLinkClasses}>
        <User className="h-6 w-6" />
        <span className="text-xs font-medium">My Pets</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;