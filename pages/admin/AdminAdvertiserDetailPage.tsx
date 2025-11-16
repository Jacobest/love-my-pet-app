import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAds } from '../../contexts/AdContext';
import Button from '../../components/Button';
import { ArrowLeft, Edit, Building, Mail, Phone, Globe, FileText } from 'lucide-react';
import AdvertiserForm from '../../components/AdvertiserForm';
import { Advert } from '../../types';
import Modal from '../../components/Modal';

type AdvertStatus = 'Active' | 'Paused' | 'Under Review' | 'Archived';

const AdminAdvertiserDetailPage: React.FC = () => {
  const { advertiserId } = useParams<{ advertiserId: string }>();
  const navigate = useNavigate();
  const { advertisers, adverts } = useAds();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AdvertStatus>('Active');

  const advertiser = advertisers.find(a => a.id === advertiserId);

  const advertiserAdverts = useMemo(() => {
    return adverts.filter(ad => ad.advertiserId === advertiserId);
  }, [adverts, advertiserId]);

  const groupedAdverts = useMemo(() => {
    return advertiserAdverts.reduce((acc, ad) => {
      const status = ad.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(ad);
      return acc;
    }, {} as Record<AdvertStatus, Advert[]>);
  }, [advertiserAdverts]);

  if (!advertiser) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold">Advertiser not found</h2>
        <Button as={Link} to="/admin/advertising" className="mt-4">
          Back to Advertising
        </Button>
      </div>
    );
  }
  
  const TabButton: React.FC<{tab: AdvertStatus, count: number}> = ({tab, count}) => (
      <button
        onClick={() => setActiveTab(tab)}
        className={`px-3 py-2 font-medium text-sm rounded-md ${
          activeTab === tab
            ? 'bg-admin-primary text-white'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        }`}
      >
        {tab} <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-800">{count}</span>
      </button>
  );

  return (
    <div>
      <Button as={Link} to="/admin/advertising" variant="ghost" className="mb-6">
        <ArrowLeft size={16} className="mr-2" />
        Back to All Advertisers
      </Button>

      {/* Advertiser Details Card */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-brand-dark flex items-center gap-3">
              <Building /> {advertiser.companyName}
            </h1>
            <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${advertiser.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {advertiser.status}
            </span>
          </div>
          <Button onClick={() => setIsEditModalOpen(true)}>
            <Edit size={16} className="mr-2" /> Edit Details
          </Button>
        </div>
        <div className="mt-6 border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div className="flex items-center gap-3"><Mail size={16} className="text-gray-400" /> <span>{advertiser.email}</span></div>
          <div className="flex items-center gap-3"><Phone size={16} className="text-gray-400" /> <span>{advertiser.phone}</span></div>
          {advertiser.website && <div className="flex items-center gap-3"><Globe size={16} className="text-gray-400" /> <a href={advertiser.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{advertiser.website}</a></div>}
        </div>
        {advertiser.notes && (
            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <h4 className="font-bold flex items-center gap-2"><FileText size={16} /> Internal Notes</h4>
                <p className="mt-2 text-sm text-yellow-800 whitespace-pre-wrap">{advertiser.notes}</p>
            </div>
        )}
      </div>

      {/* Adverts Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-brand-dark mb-4">Campaigns</h2>
        <div className="border-b border-gray-200">
            <nav className="flex space-x-2" aria-label="Tabs">
                <TabButton tab="Active" count={groupedAdverts['Active']?.length || 0} />
                <TabButton tab="Paused" count={groupedAdverts['Paused']?.length || 0} />
                <TabButton tab="Under Review" count={groupedAdverts['Under Review']?.length || 0} />
                <TabButton tab="Archived" count={groupedAdverts['Archived']?.length || 0} />
            </nav>
        </div>
        <div className="mt-4">
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Campaign Name</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Format</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(groupedAdverts[activeTab] || []).map(ad => (
                      <tr key={ad.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/admin/adverts/${ad.id}`)}>
                        <td className="px-4 py-2 font-medium text-gray-900">{ad.name}</td>
                        <td className="px-4 py-2 text-gray-500 capitalize">{ad.format}</td>
                        <td className="px-4 py-2 text-gray-500">{new Date(ad.startDate).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-gray-500">{new Date(ad.endDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {(groupedAdverts[activeTab] || []).length === 0 && (
                        <tr>
                            <td colSpan={4} className="text-center py-6 text-gray-500">No campaigns with status "{activeTab}".</td>
                        </tr>
                    )}
                  </tbody>
                </table>
            </div>
        </div>
      </div>


      <AdvertiserForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        advertiser={advertiser}
      />
    </div>
  );
};

export default AdminAdvertiserDetailPage;