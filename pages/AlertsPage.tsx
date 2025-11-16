
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AlertCard from '../components/AlertCard';
import Button from '../components/Button';
import { Megaphone } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usePets } from '../contexts/PetContext';
import { Alert } from '../types';
import AdCard from '../components/AdCard';

const AlertsPage: React.FC = () => {
  const { user } = useAuth();
  const { pets } = usePets();
  const navigate = useNavigate();

  const alerts: Alert[] = pets
    .filter(p => p.status === 'Lost')
    .sort((a, b) => new Date(b.lastSeenTime || 0).getTime() - new Date(a.lastSeenTime || 0).getTime())
    .map(pet => ({
      id: `alert-${pet.id}`,
      pet: pet,
      message: pet.missingReportMessage || `Please help find ${pet.name}.`
    }));

  const handleReportMissingClick = () => {
    if (user) {
      // If user is logged in, go to profile to select a pet
      navigate('/profile');
    } else {
      // If not logged in, prompt them to log in first
      navigate('/login');
    }
  };

  const contentWithAds = alerts.reduce<React.ReactNode[]>((acc, alert, index) => {
    acc.push(
      <AlertCard
        key={alert.id}
        alert={alert}
        onPinRequest={() => {}} // This page doesn't support pinning
      />
    );
    // Add a full-sized ad card after every 3rd alert
    if ((index + 1) % 3 === 0) {
      acc.push(<AdCard key={`ad-${index}`} size="full" />);
    }
    return acc;
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-primary">Active Pet Alerts</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          A community-powered network to help bring missing pets back home safely.
          View active alerts below or report a missing pet.
        </p>
        <div className="mt-6">
            <Button size="lg" variant="secondary" onClick={handleReportMissingClick}>
                <Megaphone className="mr-2 h-6 w-6" /> Report a Missing Pet
            </Button>
        </div>
      </div>

      <AdCard size="half" />

      <div>
        <h2 className="text-3xl font-bold mb-6 text-brand-dark">All Active Alerts</h2>
        {alerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contentWithAds}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <h3 className="text-xl font-semibold">No Active Alerts</h3>
            <p className="text-gray-500 mt-2">All pets are currently safe and sound!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
