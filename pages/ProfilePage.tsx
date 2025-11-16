import React, { useState, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Pet } from '../types';
import Button from '../components/Button';
import { PlusCircle, Edit, UserCog, AlertTriangle, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import PetProfileForm from '../components/PetProfileForm';
import { useNavigate, Link } from 'react-router-dom';
import ReportMissingForm from '../components/ReportMissingForm';
import ConfirmationModal from '../components/ConfirmationModal';
import { usePets } from '../contexts/PetContext';
import PetStatusBadge from '../components/PetStatusBadge';
import { NotificationContext } from '../App';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { pets, addPet, updatePet, deletePet } = usePets();
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

  const userPets = pets.filter(p => p.ownerId === user?.id);
  
  // State for Edit/Add Pet Modal
  const [isPetFormModalOpen, setIsPetFormModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | undefined>(undefined);

  // State for Report Missing Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportingPet, setReportingPet] = useState<Pet | null>(null);

  // State for Delete Confirmation Modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingPet, setDeletingPet] = useState<Pet | null>(null);


  if (!user) {
    return <div>Loading profile...</div>;
  }

  // Handlers for Edit/Add Pet Modal
  const handleOpenPetFormModal = (pet?: Pet) => {
    setEditingPet(pet);
    setIsPetFormModalOpen(true);
  };
  
  const handleClosePetFormModal = () => {
    setIsPetFormModalOpen(false);
    setEditingPet(undefined);
  };

  const handleSavePet = (petData: Partial<Pet>) => {
    if (editingPet) {
        updatePet(editingPet.id, petData);
    } else {
        addPet(petData as Omit<Pet, 'id' | 'ownerId' | 'status'>);
    }
    handleClosePetFormModal();
  };

  // Handlers for Report Missing Modal
  const handleOpenReportModal = (pet: Pet) => {
    setReportingPet(pet);
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setReportingPet(null);
  };

  const handleSaveReport = (data: { lastSeenLocation: string; lastSeenTime: string; message: string; lat?: number; lng?: number; }) => {
    if (!reportingPet) return;

    updatePet(reportingPet.id, {
        status: 'Lost',
        lastSeenLocation: data.lastSeenLocation,
        lastSeenTime: data.lastSeenTime,
        lastSeenLat: data.lat,
        lastSeenLng: data.lng,
        missingReportMessage: data.message
    });
    
    addNotification({
        type: 'alert',
        title: 'Missing Pet Alert Active',
        message: `${reportingPet.name} has been reported missing and is now visible on the homepage.`,
        link: `/pet/${reportingPet.id}`,
        imageUrl: reportingPet.photoUrls[0],
    });

    handleCloseReportModal();
  };
  
  // Handlers for Delete Confirmation Modal
  const handleOpenConfirmModal = (pet: Pet) => {
    setDeletingPet(pet);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setDeletingPet(null);
    setIsConfirmModalOpen(false);
  };

  const handleDeletePet = () => {
    if (!deletingPet) return;
    deletePet(deletingPet.id);
    handleCloseConfirmModal();
  };


  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-8">
        <img src={user.profilePhotoUrl} alt={user.displayName} className="h-32 w-32 rounded-full object-cover ring-4 ring-brand-primary ring-offset-2"/>
        <div>
          <h1 className="text-4xl font-bold">{user.displayName}</h1>
          <p className="text-gray-600 text-lg">{user.name} • {user.city}</p>
          <span className="mt-2 inline-block bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">
            {user.vettingStatus}
          </span>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">My Pets</h2>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate('/member-profile')} variant="ghost">
                <UserCog className="mr-2 h-5 w-5" /> Edit Profile
            </Button>
            <Button onClick={() => handleOpenPetFormModal()} variant="primary">
              <PlusCircle className="mr-2 h-5 w-5" /> Add Pet
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          {userPets.map(pet => (
            <div key={pet.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between transition-shadow hover:shadow-md">
              <Link to={`/pet/${pet.id}`} className="flex items-center gap-4 flex-grow">
                <img src={pet.photoUrls[0]} alt={pet.name} className="h-16 w-16 rounded-full object-cover"/>
                <div>
                  <h3 className="text-xl font-semibold hover:text-brand-primary transition-colors">{pet.name}</h3>
                  <p className="text-gray-500">{pet.breed}</p>
                </div>
              </Link>
              <div className='flex items-center gap-2 flex-shrink-0'>
                <PetStatusBadge status={pet.status} />
                 {pet.status === 'Safe' && (
                  <Button variant="danger" size="sm" onClick={() => handleOpenReportModal(pet)} title="Report Missing">
                      <AlertTriangle size={16} />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => handleOpenPetFormModal(pet)}>
                    <Edit size={16}/>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleOpenConfirmModal(pet)} className="text-brand-alert hover:bg-brand-alert/10">
                    <Trash2 size={16}/>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isPetFormModalOpen} onClose={handleClosePetFormModal} title={editingPet ? 'Edit Pet Profile' : 'Add a New Pet'}>
        <PetProfileForm 
          onSave={handleSavePet} 
          onCancel={handleClosePetFormModal} 
          pet={editingPet}
          onDelete={(petId) => {
            const petToDelete = userPets.find(p => p.id === petId);
            if (petToDelete) {
                handleClosePetFormModal();
                handleOpenConfirmModal(petToDelete);
            }
          }}
        />
      </Modal>

      {reportingPet && (
        <Modal isOpen={isReportModalOpen} onClose={handleCloseReportModal} title={`Report ${reportingPet.name} as Missing`}>
          <ReportMissingForm pet={reportingPet} onSave={handleSaveReport} onCancel={handleCloseReportModal} />
        </Modal>
      )}

      {deletingPet && (
        <ConfirmationModal
            isOpen={isConfirmModalOpen}
            onClose={handleCloseConfirmModal}
            onConfirm={handleDeletePet}
            title={`Delete ${deletingPet.name}?`}
            confirmText="Yes, Delete"
        >
            Are you sure you want to permanently delete this pet profile? This action cannot be undone.
        </ConfirmationModal>
      )}
    </div>
  );
};

export default ProfilePage;