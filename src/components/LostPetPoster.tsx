import React from 'react';
import { Pet, User } from '../types';
import Button from './Button';
import { Printer } from 'lucide-react';

interface LostPetPosterProps {
  pet: Pet;
  owner: User;
}

const LostPetPoster: React.FC<LostPetPosterProps> = ({ pet, owner }) => {

  const handlePrint = () => {
    window.print();
  };

  const contactInfo = () => {
      switch(owner.contactPreference) {
          case 'email':
              return owner.email;
          case 'mobile':
              return owner.mobileNumber;
          case 'both':
              return `${owner.mobileNumber} or ${owner.email}`;
          default:
              return `Contact via LoveMyPet app`;
      }
  }

  const tearOffContact = owner.mobileNumber || owner.email;

  return (
    <div>
      <div id="print-area" className="p-4 bg-white font-sans text-black">
        <div className="border-4 border-black p-4 space-y-4">
          <div className="text-center bg-red-600 text-white py-2">
            <h1 className="text-5xl font-extrabold tracking-widest">
              LOST {pet.species.toUpperCase()}
            </h1>
          </div>

          <div className="text-center">
            <h2 className="text-6xl font-bold">{pet.name.toUpperCase()}</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="w-full md:w-1/2 flex-shrink-0">
              <img
                src={pet.photoUrls[0]}
                alt={pet.name}
                className="w-full object-cover border-2 border-black aspect-square"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-3 text-lg">
              <p><strong>Breed:</strong> {pet.breed}</p>
              <p><strong>Color:</strong> {pet.color}</p>
              <p><strong>Age:</strong> {pet.age} years old</p>
              <p><strong>Last Seen:</strong> {pet.lastSeenLocation}</p>
              <p><strong>Time:</strong> {pet.lastSeenTime}</p>
            </div>
          </div>

          <div className="text-center border-t-2 border-b-2 border-dashed border-black py-3">
             <p className="text-xl">{pet.missingReportMessage}</p>
          </div>

          <div className="text-center">
            <h3 className="text-4xl font-bold">CONTACT {owner.displayName}</h3>
            <p className="text-3xl font-semibold">{contactInfo()}</p>
          </div>
        </div>
        
        {/* Tear-off tabs */}
        <div className="flex border-4 border-black border-t-0 overflow-hidden">
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="w-[12.5%] text-center border-l border-dashed border-black first:border-l-0 py-4 px-1" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                    <p className="font-bold text-lg rotate-180">{pet.name.toUpperCase()}</p>
                    <p className="text-sm rotate-180">{tearOffContact}</p>
                </div>
            ))}
        </div>
      </div>
      <div className="mt-6 text-center">
        <Button onClick={handlePrint}>
            <Printer className="mr-2 h-5 w-5" />
            Print Poster
        </Button>
      </div>
    </div>
  );
};

export default LostPetPoster;