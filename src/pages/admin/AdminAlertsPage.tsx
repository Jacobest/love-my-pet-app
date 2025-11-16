import React, { useState } from 'react';
import { usePets } from '../../contexts/PetContext';
import { useUsers } from '../../hooks/useUsers';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';
import { Eye, CheckCircle } from 'lucide-react';
import { Pet, FoundPetStory } from '../../types';
import ConfirmationModal from '../../components/ConfirmationModal';
import Modal from '../../components/Modal';
import CreateReunionStoryForm from '../../components/CreateReunionStoryForm';
import { useStories } from '../../hooks/useStories';
import { useNotifications } from '../../hooks/useNotifications';

type StoryFormData = {
  reunionDate: string;
  ownerTestimonial: string;
  ownerRating: number;
  finderUniqueToken: string;
}

const AdminAlertsPage: React.FC = () => {
  const { pets, updatePet } = usePets();
  const { getUserById } = useUsers();
  const { addFoundPetStory } = useStories();
  const { addNotification } = useNotifications();

  const [resolvingPet, setResolvingPet] = useState<Pet | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  const lostPets = pets
    .filter(p => p.status === 'Lost')
    .sort((a, b) => new Date(b.lastSeenTime || 0).getTime() - new Date(a.lastSeenTime || 0).getTime());

  const handleInitiateResolve = (pet: Pet) => {
    setResolvingPet(pet);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmResolve = () => {
    setIsConfirmModalOpen(false);
    setIsStoryModalOpen(true);
  };

  const handleCancelResolve = () => {
    setResolvingPet(null);
    setIsConfirmModalOpen(false);
    setIsStoryModalOpen(false);
  };

  const handleSaveStory = (storyData: StoryFormData) => {
    if (!resolvingPet) return;
    
    const newStory: Omit<FoundPetStory, 'id' | 'likes' | 'commentIds'> = {
        pet: { ...resolvingPet, status: 'Reunited' },
        reunionDate: storyData.reunionDate,
        ownerTestimonial: storyData.ownerTestimonial,
        ownerRating: storyData.ownerRating,
        finderTestimonialStatus: 'NotSubmitted',
        finderUniqueToken: storyData.finderUniqueToken,
    };
    
    addFoundPetStory(newStory);
    updatePet(resolvingPet.id, { status: 'Reunited' });
    
    addNotification({
        type: 'alert',
        title: 'Reunion Story Started!',
        message: `The alert for ${resolvingPet.name} is resolved. Waiting for finder's story.`,
        link: `/found`,
        imageUrl: resolvingPet.photoUrls[0],
    });

    handleCancelResolve();
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-brand-dark mb-6">Manage Active Alerts</h1>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pet</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seen</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Reported</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lostPets.length > 0 ? lostPets.map(pet => {
                const owner = getUserById(pet.ownerId);
                return (
                  <tr key={pet.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full object-cover" src={pet.photoUrls[0]} alt={pet.name} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{pet.name}</div>
                          <div className="text-sm text-gray-500">{pet.breed}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{owner?.displayName}</div>
                      <div className="text-sm text-gray-500">{owner?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" title={pet.lastSeenLocation}>
                      {pet.lastSeenLocation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pet.lastSeenTime ? new Date(pet.lastSeenTime).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button as={Link} to={`/pet/${pet.id}`} variant="ghost" size="sm" title="View Details">
                          <Eye size={16} />
                        </Button>
                        <Button onClick={() => handleInitiateResolve(pet)} variant="ghost" size="sm" title="Resolve Alert" className="text-green-600 hover:bg-green-100 hover:text-green-700">
                          <CheckCircle size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">
                    No active alerts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {resolvingPet && (
        <>
          <ConfirmationModal
            isOpen={isConfirmModalOpen}
            onClose={handleCancelResolve}
            onConfirm={handleConfirmResolve}
            title={`Resolve Alert for ${resolvingPet.name}?`}
            confirmText="Yes, Resolve"
            confirmVariant="primary"
          >
            This will mark the pet as 'Reunited' and allow you to create a reunion story. Are you sure you want to proceed?
          </ConfirmationModal>

          <Modal
            isOpen={isStoryModalOpen}
            onClose={handleCancelResolve}
            title={`Create Reunion Story for ${resolvingPet.name}`}
          >
            <CreateReunionStoryForm
              pet={resolvingPet}
              onSave={handleSaveStory}
              onCancel={handleCancelResolve}
            />
          </Modal>
        </>
      )}
    </>
  );
};

// FIX: Added missing default export.
export default AdminAlertsPage;
