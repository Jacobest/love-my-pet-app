import React, { useState } from 'react';
import { useAds } from '../contexts/AdContext';
import Modal from './Modal';
import Button from './Button';
import { Advert, AdFormat } from '../types';
import AdvertForm, { AD_FORMATS } from './AdvertForm';

interface CreateAdvertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateAdvertModal: React.FC<CreateAdvertModalProps> = ({ isOpen, onClose }) => {
  const { addAdvert } = useAds();
  const [step, setStep] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState<AdFormat | null>(null);

  const handleClose = () => {
    setStep(1);
    setSelectedFormat(null);
    onClose();
  };

  const handleFormatSelect = (format: AdFormat) => {
    setSelectedFormat(format);
    setStep(2);
  };

  const handleSave = (advertData: Omit<Advert, 'id'>, isNew: boolean) => {
    if (isNew) {
      addAdvert(advertData);
    }
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 1 ? "Choose Ad Format" : `Create ${AD_FORMATS[selectedFormat!]?.name} Advert`}
      size={step === 2 ? "3xl" : "3xl"}
    >
      {step === 1 && (
        <div className="p-4">
          <h3 className="text-lg font-semibold text-center mb-6">Select the type of advertisement you want to create.</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(AD_FORMATS).map(([key, { name, dims, icon }]) => (
                <button key={key} onClick={() => handleFormatSelect(key as AdFormat)} className="p-6 border-2 rounded-lg hover:border-brand-primary hover:bg-brand-primary/5 transition-all text-center flex flex-col items-center justify-center gap-2">
                    <span className="text-brand-primary">{icon}</span>
                    <span className="font-bold text-lg">{name}</span>
                    <span className="text-sm text-gray-500">{dims}</span>
                </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && selectedFormat && (
        <>
            <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="mb-4">
                &larr; Back to formats
            </Button>
            <AdvertForm
                onSave={handleSave}
                onCancel={handleClose}
                initialFormat={selectedFormat}
            />
        </>
      )}
    </Modal>
  );
};

export default CreateAdvertModal;