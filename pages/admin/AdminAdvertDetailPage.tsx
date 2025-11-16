import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAds } from '../../contexts/AdContext';
import Button from '../../components/Button';
import AdvertForm from '../../components/AdvertForm';
import { Advert } from '../../types';
import { ArrowLeft, Edit, Play, Pause, Archive, Eye } from 'lucide-react';

const AdminAdvertDetailPage: React.FC = () => {
  const { advertId } = useParams<{ advertId: string }>();
  const navigate = useNavigate();
  const { adverts, updateAdvert } = useAds();

  const advert = adverts.find(ad => ad.id === advertId);

  const handleSave = (advertData: Omit<Advert, 'id'>) => {
    if (advert) {
      updateAdvert(advert.id, advertData);
      alert('Advert updated successfully!');
      navigate('/admin/advertising');
    }
  };
  
  const handleStatusChange = (newStatus: Advert['status']) => {
      if(advert) {
          updateAdvert(advert.id, { status: newStatus });
      }
  };

  if (!advert) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold">Advert not found</h2>
        <Button as={Link} to="/admin/advertising" className="mt-4">
          Back to Advertising
        </Button>
      </div>
    );
  }

  const statusPillClasses: Record<Advert['status'], string> = {
    'Active': 'bg-green-100 text-green-800',
    'Paused': 'bg-yellow-100 text-yellow-800',
    'Under Review': 'bg-blue-100 text-blue-800',
    'Archived': 'bg-gray-100 text-gray-800'
  };

  return (
    <div>
        <Button as={Link} to={`/admin/advertising/${advert.advertiserId}`} variant="ghost" className="mb-6">
            <ArrowLeft size={16} className="mr-2"/>
            Back to Advertiser
        </Button>
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-brand-dark flex items-center gap-3">
                        <Edit /> Edit Campaign: {advert.name}
                    </h1>
                    <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusPillClasses[advert.status]}`}>
                      {advert.status}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {advert.status !== 'Active' && <Button size="sm" variant="ghost" className="text-green-600" onClick={() => handleStatusChange('Active')}><Play size={16} className="mr-2"/> Activate</Button>}
                    {advert.status === 'Active' && <Button size="sm" variant="ghost" className="text-yellow-600" onClick={() => handleStatusChange('Paused')}><Pause size={16} className="mr-2"/> Pause</Button>}
                    {advert.status !== 'Under Review' && <Button size="sm" variant="ghost" className="text-blue-600" onClick={() => handleStatusChange('Under Review')}><Eye size={16} className="mr-2"/> Send to Review</Button>}
                    {advert.status !== 'Archived' && <Button size="sm" variant="ghost" className="text-gray-600" onClick={() => handleStatusChange('Archived')}><Archive size={16} className="mr-2"/> Archive</Button>}
                </div>
            </div>
            
            <AdvertForm
                onSave={handleSave}
                onCancel={() => navigate(`/admin/advertising/${advert.advertiserId}`)}
                advert={advert}
                initialFormat={advert.format}
            />
        </div>
    </div>
  );
};

export default AdminAdvertDetailPage;