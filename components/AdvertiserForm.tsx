import React, { useState, useEffect } from 'react';
import { useAds } from '../contexts/AdContext';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { Building } from 'lucide-react';
import { Advertiser } from '../types';

interface AdvertiserFormProps {
  isOpen: boolean;
  onClose: () => void;
  advertiser?: Advertiser;
}

const AdvertiserForm: React.FC<AdvertiserFormProps> = ({ isOpen, onClose, advertiser }) => {
  const { addAdvertiser, updateAdvertiser } = useAds();
  const [formData, setFormData] = useState<Omit<Advertiser, 'id' | 'createdAt'>>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    billingAddress: '',
    taxId: '',
    status: 'Active',
    website: '',
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
        if (advertiser) {
          setFormData({
            companyName: advertiser.companyName,
            contactPerson: advertiser.contactPerson,
            email: advertiser.email,
            phone: advertiser.phone,
            billingAddress: advertiser.billingAddress,
            taxId: advertiser.taxId || '',
            status: advertiser.status,
            website: advertiser.website || '',
            notes: advertiser.notes || '',
          });
        } else {
          // Reset form for new advertiser
          setFormData({
            companyName: '',
            contactPerson: '',
            email: '',
            phone: '',
            billingAddress: '',
            taxId: '',
            status: 'Active',
            website: '',
            notes: '',
          });
        }
    }
  }, [advertiser, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (advertiser) {
      updateAdvertiser(advertiser.id, formData);
    } else {
      addAdvertiser(formData);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={advertiser ? "Edit Advertiser" : "Create New Advertiser"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-3 text-gray-600">
            <Building size={24} />
            <p>Create a new client profile to associate with ad campaigns.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input id="companyName" name="companyName" label="Company Name" value={formData.companyName} onChange={handleChange} required />
            <Input id="contactPerson" name="contactPerson" label="Contact Person" value={formData.contactPerson} onChange={handleChange} required />
            <Input id="email" name="email" type="email" label="Contact Email" value={formData.email} onChange={handleChange} required />
            <Input id="phone" name="phone" type="tel" label="Contact Phone" value={formData.phone} onChange={handleChange} required />
            <Input id="website" name="website" type="url" label="Website URL" value={formData.website} onChange={handleChange} placeholder="https://example.com" />
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
        </div>
        <div>
            <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700">Billing Address</label>
            <textarea
                id="billingAddress"
                name="billingAddress"
                rows={3}
                value={formData.billingAddress}
                onChange={handleChange}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
                required
            />
        </div>
        <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Internal Notes</label>
            <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
            />
        </div>
        <Input id="taxId" name="taxId" label="VAT / Tax ID (Optional)" value={formData.taxId} onChange={handleChange} />

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Advertiser</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdvertiserForm;