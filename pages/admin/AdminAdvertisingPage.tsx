import React, { useState } from 'react';
import { useAds } from '../../contexts/AdContext';
import Button from '../../components/Button';
import { PlusCircle, Building, Megaphone } from 'lucide-react';
import AdvertiserForm from '../../components/AdvertiserForm';
import { Advertiser, Advert } from '../../types';
import CreateAdvertModal from '../../components/CreateAdvertModal';
import { useNavigate } from 'react-router-dom';

const AdminAdvertisingPage: React.FC = () => {
  const { advertisers, adverts } = useAds();
  const [isAdvertiserModalOpen, setIsAdvertiserModalOpen] = useState(false);
  const [isCreateAdvertModalOpen, setIsCreateAdvertModalOpen] = useState(false);
  const navigate = useNavigate();

  const getAdvertiserName = (advertiserId: string) => {
    return advertisers.find(a => a.id === advertiserId)?.companyName || 'Unknown';
  };

  const statusPillClasses: Record<Advert['status'], string> = {
    'Active': 'bg-green-100 text-green-800',
    'Paused': 'bg-yellow-100 text-yellow-800',
    'Under Review': 'bg-blue-100 text-blue-800',
    'Archived': 'bg-gray-100 text-gray-800'
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-brand-dark mb-8">Advertising Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Advertisers Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
              <Building size={20} /> Advertisers
            </h2>
            <Button size="sm" onClick={() => setIsAdvertiserModalOpen(true)}>
              <PlusCircle size={16} className="mr-2" /> New Advertiser
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {advertisers.map(advertiser => (
                  <tr key={advertiser.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/admin/advertising/${advertiser.id}`)}>
                    <td className="px-4 py-2 font-medium text-gray-900">{advertiser.companyName}</td>
                    <td className="px-4 py-2 text-gray-500">{advertiser.email}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${advertiser.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {advertiser.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Campaigns Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
              <Megaphone size={20} /> Campaigns
            </h2>
            <Button size="sm" onClick={() => setIsCreateAdvertModalOpen(true)}>
              <PlusCircle size={16} className="mr-2" /> New Advert
            </Button>
          </div>
           <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Advertiser</th>
                   <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adverts.map(ad => (
                  <tr key={ad.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/admin/adverts/${ad.id}`)}>
                    <td className="px-4 py-2 font-medium text-gray-900">{ad.name}</td>
                    <td className="px-4 py-2 text-gray-500">{getAdvertiserName(ad.advertiserId)}</td>
                     <td className="px-4 py-2">
                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusPillClasses[ad.status]}`}>
                        {ad.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <AdvertiserForm
        isOpen={isAdvertiserModalOpen}
        onClose={() => setIsAdvertiserModalOpen(false)}
      />

      <CreateAdvertModal
        isOpen={isCreateAdvertModalOpen}
        onClose={() => setIsCreateAdvertModalOpen(false)}
      />
    </>
  );
};

export default AdminAdvertisingPage;