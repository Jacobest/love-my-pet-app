import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Facebook, Instagram, Twitter } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

const Footer: React.FC = () => {
  const { settings } = useSettings();
  const socials = settings.general.socials;

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
        <div className="flex justify-center items-center gap-2 mb-2">
            <PawPrint className="h-6 w-6 text-brand-secondary" />
            <span className="text-lg font-bold text-brand-dark">{settings.general.appName}</span>
        </div>
        <div className="flex justify-center items-center gap-4 my-4">
            {socials.facebook && <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-primary"><Facebook /></a>}
            {socials.instagram && <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-primary"><Instagram /></a>}
            {socials.twitter && <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-primary"><Twitter /></a>}
        </div>
        <div className="text-sm space-x-4 my-3">
          <Link to="/community-guidelines" className="hover:text-brand-primary transition-colors">Community Guidelines</Link>
          <span>•</span>
          <Link to="/privacy-policy" className="hover:text-brand-primary transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-brand-primary transition-colors">Contact Us</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} {settings.general.appName}. All rights reserved.</p>
        <p>Connecting pets with their people.</p>
      </div>
    </footer>
  );
};

export default Footer;