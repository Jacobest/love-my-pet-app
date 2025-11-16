import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUsers } from '../../hooks/useUsers';
import { usePets } from '../../contexts/PetContext';
import Button from '../../components/Button';
import { ArrowLeft, Mail, Phone, MapPin, Shield, Calendar } from 'lucide-react';
import PetStatusBadge from '../../components/PetStatusBadge';

const AdminMemberDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { getUserById } = useUsers();
  const { pets } = usePets();

  const user = userId ? getUserById(userId) : undefined;
  const userPets = pets.filter(p => p.ownerId === userId);

  if (!user) {
    return (
      <div>
        <h1 className="text-2xl font-bold">User not found</h1>
        <Button onClick={() => navigate('/admin/members')} className="mt-4">Back to Members</Button>
      </div>
    );
  }

  const userStatusColors = {
    Active: 'bg-green-100 text-green-800',
    Paused: 'bg-yellow-100 text-yellow-800',
    Blocked: 'bg-red-100 text-red-800',
    Archived: 'bg-gray-100 text-gray-800',
  };

  return (
    <div>
      <Button onClick={() => navigate(-1)} variant="ghost" className="mb-6">
        <ArrowLeft size={16} className="mr-2"/>
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Info Column */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow space-y-4">
          <div className="flex flex-col items-center">
            <img src={user.profilePhotoUrl} alt={user.displayName} className="h-32 w-32 rounded-full object-cover ring-4 ring-admin-primary/20" />
            <h2 className="text-2xl font-bold mt-4">{user.displayName}</h2>
            <p className="text-gray-500">{user.name}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${userStatusColors[user.status]}`}>
                {user.status}
              </span>
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                {user.role}
              </span>
            </div>
          </div>
          <div className="border-t pt-4 space-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-3"><Mail size={16} className="text-gray-400" /> <span>{user.email}</span></div>
            <div className="flex items-center gap-3"><Phone size={16} className="text-gray-400" /> <span>{user.mobileNumber}</span></div>
            <div className="flex items-center gap-3"><MapPin size={16} className="text-gray-400" /> <span>{user.city}</span></div>
            <div className="flex items-center gap-3"><Shield size={16} className="text-gray-400" /> <span>Vetting: {user.vettingStatus}</span></div>
            <div className="flex items-center gap-3"><Calendar size={16} className="text-gray-400" /> <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span></div>
          </div>
        </div>

        {/* Pets Column */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Pets ({userPets.length})</h3>
          <div className="space-y-4">
            {userPets.length > 0 ? userPets.map(pet => (
              <Link to={`/pet/${pet.id}`} key={pet.id} className="block bg-gray-50 p-4 rounded-lg shadow-sm flex items-center justify-between transition-shadow hover:shadow-md hover:bg-gray-100">
                <div className="flex items-center gap-4">
                  <img src={pet.photoUrls[0]} alt={pet.name} className="h-16 w-16 rounded-full object-cover"/>
                  <div>
                    <h4 className="text-lg font-semibold">{pet.name}</h4>
                    <p className="text-gray-500 text-sm">{pet.breed}</p>
                  </div>
                </div>
                <PetStatusBadge status={pet.status} />
              </Link>
            )) : (
              <p className="text-center text-gray-500 py-8">This user has not added any pets yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMemberDetailPage;