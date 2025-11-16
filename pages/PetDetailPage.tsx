import React, { useState, useContext, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Info, Tag, MessageSquare, PlusCircle, Heart, FileText, PartyPopper, Edit, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { ChatContext, NotificationContext } from '../App';
import { HealthRecord, Pet, User, FoundPetStory } from '../types';
import { usePetHealthRecords } from '../hooks/usePetHealthRecords';
import Modal from '../components/Modal';
import HealthRecordForm from '../components/HealthRecordForm';
import HealthRecordCard from '../components/HealthRecordCard';
import ConfirmationModal from '../components/ConfirmationModal';
import { usePets } from '../contexts/PetContext';
import LostPetPoster from '../components/LostPetPoster';
import PetStatusBadge from '../components/PetStatusBadge';
import { useUsers } from '../hooks/useUsers';
import { useStories } from '../hooks/useStories';
import ReunionTestimonialModal from '../components/ReunionTestimonialModal';
import PetProfileForm from '../components/PetProfileForm';
import { useSettings } from '../contexts/SettingsContext';

type ActiveTab = 'details' | 'health';

const PetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const { getPetById, updatePet, deletePet } = usePets();
  const { getUserById } = useUsers();
  const { addFoundPetStory } = useStories();
  const { addNotification } = useContext(NotificationContext);
  const { startChat } = useContext(ChatContext);
  const { settings } = useSettings();
  const navigate = useNavigate();

  const { pet, owner } = useMemo(() => {
    const p = id ? getPetById(id) : undefined;
    const o = p ? getUserById(p.ownerId) : undefined;
    return { pet: p, owner: o };
  }, [id, getPetById, getUserById]);
  
  const [mainImage, setMainImage] = useState(pet?.photoUrls[0] || '');
  const [activeTab, setActiveTab] = useState<ActiveTab>('details');
  
  const { records, addRecord, updateRecord, deleteRecord } = usePetHealthRecords(pet ? pet.id : '');
  const [isRecordFormModalOpen, setIsRecordFormModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);
  const [isConfirmRecordDeleteModalOpen, setIsConfirmRecordDeleteModalOpen] = useState(false);
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);
  
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [isReunionModalOpen, setIsReunionModalOpen] = useState(false);
  
  // State for Admin/Owner pet management
  const [isPetFormModalOpen, setIsPetFormModalOpen] = useState(false);
  const [isConfirmPetDeleteModalOpen, setIsConfirmPetDeleteModalOpen] = useState(false);

  React.useEffect(() => {
    if (pet?.photoUrls[0]) {
      setMainImage(pet.photoUrls[0]);
    }
  }, [pet]);

  if (!pet || !owner) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold">Pet Not Found</h1>
        <p className="mt-4 text-lg text-gray-600">Sorry, we couldn't find the pet or owner information you're looking for.</p>
        <Button as={Link} to="/" className="mt-6">Go Home</Button>
      </div>
    );
  }
  
  const isOwner = currentUser?.id === owner.id;
  const isAdmin = currentUser?.role === 'Admin';
  const canManage = isOwner || isAdmin;
  const canContactOwner = currentUser && !isOwner && pet.status === 'Lost';


  // --- Health Record Handlers ---
  const handleOpenRecordForm = (record?: HealthRecord) => {
    setEditingRecord(record || null);
    setIsRecordFormModalOpen(true);
  };
  const handleCloseRecordForm = () => {
      setIsRecordFormModalOpen(false);
      setEditingRecord(null);
  };
  const handleSaveRecord = (recordData: Omit<HealthRecord, 'id' | 'petId'>) => {
      if (editingRecord) {
          updateRecord(editingRecord.id, recordData);
      } else {
          addRecord(recordData);
      }
      handleCloseRecordForm();
  };
  const handleOpenConfirmDelete = (recordId: string) => {
      setDeletingRecordId(recordId);
      setIsConfirmRecordDeleteModalOpen(true);
  };
  const handleCloseConfirmDelete = () => {
      setDeletingRecordId(null);
      setIsConfirmRecordDeleteModalOpen(false);
  };
  const handleDeleteRecord = () => {
      if (deletingRecordId) {
          deleteRecord(deletingRecordId);
      }
      handleCloseConfirmDelete();
  };
  
  // --- Owner Action Handlers ---
  const handleReunitePet = (data: { testimonial: string, rating: number }) => {
    if (!pet) return;
    const token = `token_${pet.id}_${Date.now()}`;
    const newStoryData: Omit<FoundPetStory, 'id' | 'likes' | 'commentIds'> = {
      pet: pet,
      reunionDate: new Date().toISOString(),
      ownerTestimonial: data.testimonial,
      ownerRating: data.rating,
      finderUniqueToken: token,
    };
    
    addFoundPetStory(newStoryData);
    setIsReunionModalOpen(false);
  };

  const handleMessageOwner = () => {
    if (owner && currentUser) {
      const chatId = startChat(owner.id);
      navigate(`/chat/${chatId}`);
    }
  };

  // --- Admin/Owner Pet Management Handlers ---
  const handleOpenPetFormModal = () => setIsPetFormModalOpen(true);
  const handleClosePetFormModal = () => setIsPetFormModalOpen(false);
  const handleSavePet = (petData: Partial<Pet>) => {
    if (pet) {
      updatePet(pet.id, petData);
    }
    handleClosePetFormModal();
  };
  const handleOpenConfirmPetDelete = () => setIsConfirmPetDeleteModalOpen(true);
  const handleCloseConfirmPetDelete = () => setIsConfirmPetDeleteModalOpen(false);
  const handleDeletePet = () => {
    if (!pet) return;
    deletePet(pet.id);
    handleCloseConfirmPetDelete();
    if (isAdmin) {
      navigate(`/admin/members/${owner.id}`);
    } else {
      navigate('/profile');
    }
  };


  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-5xl font-extrabold text-brand-dark">{pet.name}</h1>
        <div className="flex items-center gap-4 mt-2">
            <p className="text-xl text-gray-500 font-medium">{pet.breed}</p>
            <PetStatusBadge status={pet.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* LEFT COLUMN: Image Gallery */}
        <div className="lg:col-span-2">
          <PetImageGallery
            name={pet.name}
            status={pet.status}
            photoUrls={pet.photoUrls}
            mainImage={mainImage}
            onSetMainImage={setMainImage}
          />
        </div>
        
        {/* RIGHT COLUMN: Tabs and Content */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="px-8 py-6 flex-grow overflow-y-auto">
            {activeTab === 'details' && <PetDetailsTab pet={pet} owner={owner} />}
            {activeTab === 'health' && (
              <HealthRecordsTab
                pet={pet}
                records={records}
                isOwner={isOwner}
                onAddRecord={() => handleOpenRecordForm()}
                onEditRecord={handleOpenRecordForm}
                onDeleteRecord={handleOpenConfirmDelete}
              />
            )}
          </div>

           {/* --- ACTION BUTTONS --- */}
            <div className="p-6 border-t bg-gray-50 space-y-4">
                {canContactOwner && (
                    <Button onClick={handleMessageOwner} className="w-full"><MessageSquare className="mr-2 h-5 w-5"/> Message Owner</Button>
                )}
                {isOwner && pet.status === 'Lost' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button onClick={() => setIsPosterModalOpen(true)} variant="secondary"><FileText className="mr-2 h-5 w-5" /> Generate Poster</Button>
                        <Button onClick={() => setIsReunionModalOpen(true)} variant="primary"><PartyPopper className="mr-2 h-5 w-5" /> My Pet is Found!</Button>
                    </div>
                )}
                {isAdmin && (
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 text-center">Admin Actions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Button onClick={handleOpenPetFormModal} variant="secondary"><Edit className="mr-2 h-5 w-5" /> Edit Pet</Button>
                            <Button onClick={handleOpenConfirmPetDelete} variant="danger"><Trash2 className="mr-2 h-5 w-5" /> Delete Pet</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
      
      {/* --- MODALS --- */}
      <Modal
          isOpen={isRecordFormModalOpen}
          onClose={handleCloseRecordForm}
          title={editingRecord ? 'Edit Health Record' : 'Add Health Record'}
      >
          <HealthRecordForm onSave={handleSaveRecord} onCancel={handleCloseRecordForm} record={editingRecord} />
      </Modal>

      <ConfirmationModal
          isOpen={isConfirmRecordDeleteModalOpen}
          onClose={handleCloseConfirmDelete}
          onConfirm={handleDeleteRecord}
          title="Delete Health Record?"
          confirmText="Yes, Delete"
      >
          Are you sure you want to delete this health record? This action cannot be undone.
      </ConfirmationModal>
      
      <Modal
        isOpen={isPosterModalOpen}
        onClose={() => setIsPosterModalOpen(false)}
        title={`Lost Pet Poster for ${pet.name}`}
        size="3xl"
      >
          <LostPetPoster pet={pet} owner={owner} />
      </Modal>

      <ReunionTestimonialModal
        isOpen={isReunionModalOpen}
        onClose={() => setIsReunionModalOpen(false)}
        onSubmit={handleReunitePet}
        pet={pet}
      />
      
      <Modal isOpen={isPetFormModalOpen} onClose={handleClosePetFormModal} title={`Edit Pet: ${pet.name}`}>
        <PetProfileForm 
          onSave={handleSavePet} 
          onCancel={handleClosePetFormModal} 
          pet={pet}
        />
      </Modal>

      <ConfirmationModal
          isOpen={isConfirmPetDeleteModalOpen}
          onClose={handleCloseConfirmPetDelete}
          onConfirm={handleDeletePet}
          title={`Delete ${pet.name}?`}
          confirmText="Yes, Delete"
      >
          Are you sure you want to permanently delete this pet profile? This will also remove any related alerts or stories. This action cannot be undone.
      </ConfirmationModal>
    </div>
  );
};

// --- Sub-components for better organization ---

const PetImageGallery: React.FC<{name: string, status: Pet['status'], photoUrls: string[], mainImage: string, onSetMainImage: (url: string) => void}> = 
({name, status, photoUrls, mainImage, onSetMainImage}) => (
    <div className="relative">
        <div className="relative">
            <img src={mainImage} alt={name} className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-md" />
            <div className="absolute top-4 left-4">
              <PetStatusBadge status={status} className="!text-base !px-4 !py-2 shadow-lg" />
            </div>
        </div>
        {photoUrls.length > 1 && (
            <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                {photoUrls.map((url) => (
                    <button key={url} onClick={() => onSetMainImage(url)} className={`flex-shrink-0 rounded-md overflow-hidden border-2 ${mainImage === url ? 'border-brand-primary' : 'border-transparent'}`}>
                        <img src={url} alt={`${name} thumbnail`} className="h-20 w-20 object-cover" />
                    </button>
                ))}
            </div>
        )}
    </div>
);

const TabNavigation: React.FC<{activeTab: ActiveTab, setActiveTab: (tab: ActiveTab) => void}> = ({activeTab, setActiveTab}) => {
  const getTabClasses = (tabName: ActiveTab) => `whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
    activeTab === tabName
      ? 'border-brand-primary text-brand-primary'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
  }`;

  return (
    <div className="px-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button onClick={() => setActiveTab('details')} className={getTabClasses('details')}>Details</button>
            <button onClick={() => setActiveTab('health')} className={getTabClasses('health')}>Health Records</button>
        </nav>
    </div>
  );
};

const PetDetailsTab: React.FC<{pet: Pet, owner: User}> = ({pet, owner}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4 text-gray-700">
        {pet.status === 'Lost' && pet.lastSeenLocation && (
          <div className="flex items-start gap-3"><MapPin className="h-6 w-6 text-brand-secondary flex-shrink-0 mt-1" /><div><h3 className="font-semibold">Last Seen Location</h3><p>{pet.lastSeenLocation}</p></div></div>
        )}
        {pet.status === 'Lost' && pet.lastSeenTime && (
          <div className="flex items-start gap-3"><Clock className="h-6 w-6 text-brand-secondary flex-shrink-0 mt-1" /><div><h3 className="font-semibold">Last Seen Time</h3><p>{new Date(pet.lastSeenTime).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</p></div></div>
        )}
        <div className="flex items-start gap-3"><Info className="h-6 w-6 text-brand-secondary flex-shrink-0 mt-1" /><div><h3 className="font-semibold">Details</h3><p>{pet.species} • {pet.age} years old • {pet.color}</p></div></div>
        {pet.keywords.length > 0 && (
           <div className="flex items-start gap-3"><Tag className="h-6 w-6 text-brand-secondary flex-shrink-0 mt-1" /><div><h3 className="font-semibold">Keywords</h3><div className="flex flex-wrap gap-2 mt-1">{pet.keywords.map(kw => (<span key={kw} className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">{kw}</span>))}</div></div></div>
        )}
      </div>
      <div><h2 className="text-2xl font-bold">About {pet.name}</h2><p className="mt-2 text-gray-700 whitespace-pre-wrap">{pet.description}</p></div>
      <div className="pt-6 border-t">
        <div className="flex items-center gap-4"><img src={owner.profilePhotoUrl} alt={owner.displayName} className="h-14 w-14 rounded-full object-cover" /><div><p className="font-semibold text-gray-600">Owner</p><h3 className="text-xl font-bold">{owner.displayName}</h3></div></div>
      </div>
    </div>
  );
};

const HealthRecordsTab: React.FC<{pet: Pet, records: HealthRecord[], isOwner: boolean, onAddRecord: () => void, onEditRecord: (record: HealthRecord) => void, onDeleteRecord: (recordId: string) => void}> = 
({pet, records, isOwner, onAddRecord, onEditRecord, onDeleteRecord}) => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Heart className="h-6 w-6 text-brand-secondary" /> Health Records</h2>
        {isOwner && (
            <Button onClick={onAddRecord} variant="ghost"><PlusCircle className="mr-2 h-5 w-5" /> Add Record</Button>
        )}
      </div>
      <div className="space-y-4">
        {records.length > 0 ? (
          [...records]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(record => (
              <HealthRecordCard key={record.id} record={record} isOwner={isOwner} onEdit={() => onEditRecord(record)} onDelete={() => onDeleteRecord(record.id)} />
            ))
        ) : (
          <div className="text-center text-gray-500 py-6 bg-gray-50 rounded-lg"><p>No health records have been added for {pet.name} yet.</p></div>
        )}
      </div>
    </div>
);

export default PetDetailPage;
