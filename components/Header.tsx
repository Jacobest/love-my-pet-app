
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { PawPrint, LogIn, LogOut, MessageSquare, Shield, AlertTriangle, Home, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import { useSettings } from '../contexts/SettingsContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();

  const navLinkClasses = ({ isActive }: { isActive: boolean }): string =>
    `text-lg font-medium transition-colors flex items-center gap-2 ${
      isActive ? 'text-brand-primary' : 'text-gray-600 hover:text-brand-primary'
    }`;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <PawPrint className="h-8 w-8 text-brand-primary" />
            <span className="text-2xl font-bold text-brand-dark tracking-tight">{settings.general.appName}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLinkClasses}><Home size={20} /> Home</NavLink>
            <NavLink to="/found" className={navLinkClasses}><Heart size={20} /> Found Pets</NavLink>
            <NavLink to="/alerts" className={navLinkClasses}><AlertTriangle size={20} /> Alerts</NavLink>
            {user && <NavLink to="/profile" className={navLinkClasses}><PawPrint size={20} /> My Pets</NavLink>}
            {user && <NavLink to="/chats" className={navLinkClasses}><MessageSquare size={20} /> Chats</NavLink>}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative group pb-2">
                <Link to="/member-profile" className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100">
                  <img src={user.profilePhotoUrl} alt={user.displayName} className="h-10 w-10 rounded-full object-cover" />
                  <span className="hidden sm:inline font-semibold">{user.displayName}</span>
                </Link>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                   {user.role === 'Admin' && (
                     <Link to="/admin" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                       <Shield size={16} className="mr-2"/> Admin Panel
                     </Link>
                   )}
                   <button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-sm text-brand-alert hover:bg-brand-alert/10">
                     <LogOut size={16} className="mr-2"/> Logout
                   </button>
                </div>
              </div>
            ) : (
              <Button as={Link} to="/login" variant="primary">
                <LogIn className="h-4 w-4 mr-2" />
                Login / Sign Up
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
