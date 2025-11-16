import React from 'react';
import { usePolicies } from '../hooks/usePolicies';
import { PawPrint } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  const { policies } = usePolicies();
  const policy = policies.find(p => p.id === 'privacy-policy' && p.status === 'Active');

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
       {policy ? (
        <>
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-primary">{policy.title}</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                Last updated: {new Date(policy.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>
            <div className="prose lg:prose-xl max-w-none text-gray-700 whitespace-pre-wrap">
                {policy.content}
            </div>
        </>
       ) : (
        <div className="text-center py-20">
            <PawPrint className="mx-auto h-16 w-16 text-gray-300" />
            <h1 className="mt-6 text-3xl font-bold text-brand-dark">Privacy Policy Not Available</h1>
            <p className="mt-2 text-gray-500">The policy is currently being updated. Please check back later.</p>
        </div>
       )}
    </div>
  );
};

export default PrivacyPolicyPage;
