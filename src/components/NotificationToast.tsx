import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Notification } from '../types';
import { X, MessageSquare, AlertTriangle } from 'lucide-react';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Allow time for exit animation before calling parent onClose
    setTimeout(onClose, 300);
  };

  const isAlert = notification.type === 'alert';
  const Icon = isAlert ? AlertTriangle : MessageSquare;
  const iconColor = isAlert ? 'text-red-500' : 'text-blue-500';
  const ringColor = isAlert ? 'ring-red-200' : 'ring-blue-200';

  return (
    <div
      className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ${ringColor} overflow-hidden transform transition-all duration-300 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {notification.imageUrl ? (
                <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={notification.imageUrl}
                    alt={notification.title}
                />
            ) : (
                <span className={`h-10 w-10 rounded-full flex items-center justify-center bg-gray-100 ${iconColor}`}>
                    <Icon className="h-6 w-6" />
                </span>
            )}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <Link to={notification.link} className="block" onClick={handleClose}>
              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
              <p className="mt-1 text-sm text-gray-500 truncate">{notification.message}</p>
            </Link>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              type="button"
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;