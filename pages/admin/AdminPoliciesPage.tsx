import React, { useState, useEffect, useMemo } from 'react';
import { usePolicies } from '../../hooks/usePolicies';
import { Policy } from '../../types';
import Button from '../../components/Button';
import { FileText, Edit, Save, CheckCircle, Archive, Share2, Copy } from 'lucide-react';
import Modal from '../../components/Modal';

const ShareModal: React.FC<{ policy: Policy; onClose: () => void }> = ({ policy, onClose }) => {
  const shareText = `${policy.title}\n\n${policy.content}`;
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: policy.title,
          text: policy.content,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Web Share API not supported in your browser.');
    }
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    alert('Copied to clipboard!');
  };

  const mailToLink = `mailto:?subject=${encodeURIComponent(policy.title)}&body=${encodeURIComponent(policy.content)}`;
  const whatsAppLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <Modal isOpen={true} onClose={onClose} title={`Share: ${policy.title}`}>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">Share this policy via a web service or copy its content.</p>
        <textarea
          readOnly
          value={shareText}
          rows={8}
          className="w-full p-2 border rounded-md bg-gray-50 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          {navigator.share && <Button onClick={handleShare}>Share via...</Button>}
          <Button onClick={handleCopyToClipboard}>Copy to Clipboard</Button>
          <Button as={'a'} href={mailToLink} target="_blank" variant="secondary">Email</Button>
          <Button as={'a'} href={whatsAppLink} target="_blank" variant="secondary">WhatsApp</Button>
        </div>
      </div>
    </Modal>
  );
};

const AdminPoliciesPage: React.FC = () => {
  const { policies, updatePolicy, setPolicyStatus } = usePolicies();
  const [selectedPolicyId, setSelectedPolicyId] = useState<Policy['id'] | null>(policies[0]?.id || null);
  const [editedContent, setEditedContent] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const selectedPolicy = useMemo(() => {
    return policies.find(p => p.id === selectedPolicyId);
  }, [policies, selectedPolicyId]);

  useEffect(() => {
    if (selectedPolicy) {
      setEditedContent(selectedPolicy.content);
    }
  }, [selectedPolicy]);

  const handleSave = () => {
    if (selectedPolicy) {
      updatePolicy(selectedPolicy.id, editedContent);
      alert('Policy updated successfully!');
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-brand-dark mb-8">Policy Management</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Policy List */}
        <div className="md:w-1/3 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><FileText size={18} /> Policies</h2>
          <div className="space-y-2">
            {policies.map(policy => (
              <button
                key={policy.id}
                onClick={() => setSelectedPolicyId(policy.id)}
                className={`w-full text-left p-3 rounded-md transition-colors flex justify-between items-center ${
                  selectedPolicyId === policy.id
                    ? 'bg-admin-primary text-white shadow'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span>{policy.title}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${policy.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>{policy.status}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="md:w-2/3 bg-white p-6 rounded-lg shadow">
          {selectedPolicy ? (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-4 pb-4 border-b">
                <div>
                  <h2 className="text-2xl font-bold text-brand-dark flex items-center gap-2">
                    <Edit size={22} /> {selectedPolicy.title}
                  </h2>
                  <p className="text-sm text-gray-500">Last updated: {new Date(selectedPolicy.lastUpdated).toLocaleString()}</p>
                </div>
                 <div className="flex items-center gap-2">
                    {selectedPolicy.status !== 'Active' && <Button size="sm" variant="ghost" className="text-green-600" onClick={() => setPolicyStatus(selectedPolicy.id, 'Active')}><CheckCircle size={16} className="mr-2"/> Activate</Button>}
                    {selectedPolicy.status !== 'Archived' && <Button size="sm" variant="ghost" className="text-gray-600" onClick={() => setPolicyStatus(selectedPolicy.id, 'Archived')}><Archive size={16} className="mr-2"/> Archive</Button>}
                    <Button size="sm" variant="ghost" onClick={() => setIsShareModalOpen(true)}><Share2 size={16} /></Button>
                 </div>
              </div>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full flex-grow p-3 border rounded-md focus:ring-admin-primary focus:border-admin-primary"
                style={{ minHeight: '400px' }}
                aria-label="Policy Content"
              />
              <div className="mt-4 flex justify-end">
                <Button onClick={handleSave} disabled={editedContent === selectedPolicy.content}>
                  <Save size={18} className="mr-2" /> Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a policy to view and edit.</p>
            </div>
          )}
        </div>
      </div>
      {isShareModalOpen && selectedPolicy && <ShareModal policy={selectedPolicy} onClose={() => setIsShareModalOpen(false)} />}
    </>
  );
};

export default AdminPoliciesPage;
