import React from 'react';
import { Megaphone, ShieldCheck } from 'lucide-react';

interface AdCardProps {
  size: 'half' | 'full' | 'banner' | 'strip';
}

const AdCard: React.FC<AdCardProps> = ({ size }) => {
  if (size === 'banner') {
    return (
       <div className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white p-6 rounded-lg shadow-lg text-center cursor-pointer hover:shadow-xl transition-shadow mb-8">
        <p className="font-bold text-sm tracking-wider uppercase opacity-80">Sponsored</p>
        <h2 className="text-3xl font-extrabold mt-2">LoveMyPet Premium is Here!</h2>
        <p className="text-lg mt-1 max-w-2xl mx-auto">Get advanced alert notifications, AI-powered search assistance, and more. Upgrade today for peace of mind.</p>
      </div>
    );
  }
  
  if (size === 'strip') {
    return (
      <div className="bg-brand-success/10 border-t border-b border-brand-success/20 py-4 px-6 my-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-center sm:text-left cursor-pointer hover:bg-brand-success/20 transition-colors rounded-lg">
        <ShieldCheck className="h-10 w-10 text-brand-success flex-shrink-0" />
        <div>
          <h3 className="font-bold text-brand-success text-lg">Help Keep Our Community Safe!</h3>
          <p className="text-green-700 text-sm">Become a verified member today for added trust and security. It's fast, easy, and helps everyone connect with confidence.</p>
        </div>
        <button className="bg-brand-success text-white font-semibold px-5 py-2 rounded-lg hover:bg-brand-success/90 transition-colors flex-shrink-0 mt-2 sm:mt-0">
          Get Verified
        </button>
      </div>
    );
  }

  if (size === 'half') {
    return (
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 p-4 rounded-lg shadow-sm text-center text-gray-700 mb-8 cursor-pointer hover:shadow-md transition-shadow">
        <p className="font-bold text-sm text-gray-500 tracking-wider uppercase">Advertisement</p>
        <p className="text-xl font-semibold mt-1">✨ Special Offer on Premium Pet Food! ✨</p>
        <p className="text-sm">Get 20% off your first order. Click to learn more!</p>
      </div>
    );
  }

  // full size
  return (
    <div className="bg-gray-100 border border-dashed border-gray-400 rounded-lg shadow-lg flex flex-col justify-center items-center text-center p-6 h-full min-h-[450px]">
       <Megaphone className="h-12 w-12 text-gray-400 mb-4" />
       <h3 className="text-lg font-bold text-gray-700">Advertisement Space</h3>
       <p className="text-gray-500 mt-2 max-w-xs">
         Your ad could be here! Reach thousands of dedicated pet lovers in your local community.
       </p>
       <a href="#" className="mt-4 px-5 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 hover:text-white transition-colors text-sm font-semibold">
         Learn More
       </a>
    </div>
  );
};

export default AdCard;