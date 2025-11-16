
import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand-alert/10">
          <AlertTriangle className="h-6 w-6 text-brand-alert" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:mt-5">
            <div className="mt-2">
                <p className="text-sm text-gray-500">{children}</p>
            </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-6 flex justify-center gap-4">
        <Button type="button" variant="ghost" onClick={onClose}>
          {cancelText}
        </Button>
        <Button type="button" variant={confirmVariant} onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;