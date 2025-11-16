import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePets } from '../../contexts/PetContext';
import { useUsers } from '../../hooks/useUsers';
import { useStories } from '../../hooks/useStories';
import { Pet } from '../../types';
import Input from '../../components/Input';
import PetStatusBadge from '../../components/PetStatusBadge';
import { MoreHorizontal, Archive, RefreshCw } from 'lucide-react';
import Button from '../../components/Button';

type PetStatusTab = 'Lost' | 'Reunited' | 'All Active' | 'Archived';

const PetActionDropdown: React.FC<{ pet: Pet }> = ({ pet }) => {
  const { updatePet } = usePets();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>
        <MoreHorizontal size={20} />
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
          <div className="py-1">
            {pet.status !== 'Archived' ? (
              <button
                onClick={(e) => handleAction(e, () => updatePet(pet.id, { status: 'Archived' }))}
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Archive size={16} /> Archive
              </button>
            ) : (
              <button
                onClick={(e) => handleAction(e, () => updatePet(pet.id, { status: 'Safe' }))}
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <RefreshCw size={16} /> Restore to Safe
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminPetsPage: React.FC = () => {
  const { pets } = usePets();
  const { users, getUserById } = useUsers();
  const { stories } = useStories();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<PetStatusTab>('Lost');
  const [searchTerm, setSearchTerm] = useState('');

  const reunionDates = useMemo(() => new Map(stories.map(s => [s.pet.id, s.reunionDate])), [stories]);

  const filteredPets = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    
    return pets.filter(pet => {
      if (activeTab === 'Lost') return pet.status === 'Lost';
      if (activeTab === 'Reunited') return pet.status === 'Reunited';
      if (activeTab === 'Archived') return pet.status === 'Archived';
      if (activeTab === 'All Active') {
        if (pet.status === 'Archived') return false;
        if (!searchTerm) return true;

        const owner = getUserById(pet.ownerId);
        return (
          pet.name.toLowerCase().includes(lowercasedFilter) ||
          pet.breed.toLowerCase().includes(lowercasedFilter) ||
          pet.species.toLowerCase().includes(lowercasedFilter) ||
          pet.color.toLowerCase().includes(lowercasedFilter) ||
          (owner?.displayName.toLowerCase().includes(lowercasedFilter) ?? false)
        );
      }
      return false;
    });
  }, [pets, activeTab, searchTerm, getUserById]);

  const TABS: PetStatusTab[] = ['Lost', 'Reunited', 'All Active', 'Archived'];

  const renderTable = (petList: Pet[]) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pet</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {activeTab === 'Lost' && 'Last Seen'}
              {activeTab === 'Reunited' && 'Reunion Date'}
              {activeTab === 'All Active' && 'Status'}
              {activeTab === 'Archived' && 'Species'}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {petList.length > 0 ? petList.map(pet => {
            const owner = getUserById(pet.ownerId);
            return (
              <tr key={pet.id} onClick={() => navigate(`/pet/${pet.id}`)} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full object-cover" src={pet.photoUrls[0]} alt={pet.name} />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{pet.name}</div>
                      <div className="text-sm text-gray-500">{pet.breed}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{owner?.displayName || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {activeTab === 'Lost' && (pet.lastSeenLocation || 'N/A')}
                  {activeTab === 'Reunited' && (reunionDates.get(pet.id) ? new Date(reunionDates.get(pet.id)!).toLocaleDateString() : 'N/A')}
                  {activeTab === 'All Active' && <PetStatusBadge status={pet.status} />}
                  {activeTab === 'Archived' && pet.species}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <PetActionDropdown pet={pet} />
                </td>
              </tr>
            );
          }) : (
            <tr><td colSpan={4} className="text-center py-6 text-gray-500">No pets found in this category.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-dark">Pets Management</h1>
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="border-b border-gray-200 sm:border-b-0">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`${activeTab === tab ? 'border-admin-primary text-admin-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          {activeTab === 'All Active' && (
            <div className="w-full sm:w-auto sm:max-w-xs">
              <Input
                id="search"
                type="text"
                placeholder="Search pets or owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                label="Search Active Pets"
                className="!mt-0"
              />
            </div>
          )}
        </div>
        <div className="mt-4">
          {renderTable(filteredPets)}
        </div>
      </div>
    </div>
  );
};

export default AdminPetsPage;
