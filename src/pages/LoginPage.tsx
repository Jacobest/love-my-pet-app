import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Input from '../components/Input';
import { PawPrint } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, signUp, googleLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  // State for Sign In form
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState('');

  // State for Sign Up form
  const [signUpFullName, setSignUpFullName] = useState('');
  const [signUpDisplayName, setSignUpDisplayName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpCity, setSignUpCity] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');
    const success = login(signInEmail);
    if (!success) {
      setSignInError('No account found with that email address.');
    }
  };
  
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would have more robust validation here.
    signUp({
      name: signUpFullName,
      displayName: signUpDisplayName,
      email: signUpEmail,
      city: signUpCity,
      mobileNumber: '',
      contactPreference: 'email',
    });
  };

  const TabButton: React.FC<{
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }> = ({ isActive, onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full py-3 font-semibold text-lg border-b-4 transition-colors ${
        isActive
          ? 'border-brand-primary text-brand-primary'
          : 'border-transparent text-gray-500 hover:text-brand-primary hover:border-brand-primary/50'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div>
          <PawPrint className="mx-auto h-12 w-auto text-brand-primary" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to LoveMyPet
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
             {activeTab === 'signin'
              ? 'Sign in to connect with fellow pet lovers'
              : 'Create an account to join the community'}
          </p>
        </div>

        <div className="flex">
            <TabButton isActive={activeTab === 'signin'} onClick={() => setActiveTab('signin')}>Sign In</TabButton>
            <TabButton isActive={activeTab === 'signup'} onClick={() => setActiveTab('signup')}>Sign Up</TabButton>
        </div>

        {activeTab === 'signin' ? (
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                <div className="rounded-md shadow-sm -space-y-px">
                    <Input id="email-address" name="email" type="email" label="Email address" required placeholder="Email address" value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)} />
                </div>
                <div className="pt-4">
                    <Input id="password" name="password" type="password" label="Password" required placeholder="Password" value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} />
                </div>

                {signInError && <p className="text-sm text-red-600 text-center">{signInError}</p>}
                
                <div className="flex items-center justify-between pt-2">
                    <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-brand-primary hover:text-brand-primary/80">
                        Forgot your password?
                    </Link>
                    </div>
                </div>
                <div>
                    <Button type="submit" className="w-full">
                    Sign in
                    </Button>
                </div>
            </form>
        ) : (
            <form className="mt-8 space-y-4" onSubmit={handleSignUp}>
                <Input id="full-name" name="name" type="text" label="Full Name" required placeholder="John Doe" value={signUpFullName} onChange={(e) => setSignUpFullName(e.target.value)} />
                <Input id="display-name" name="displayName" type="text" label="Display Name" required placeholder="John D." value={signUpDisplayName} onChange={(e) => setSignUpDisplayName(e.target.value)} />
                <Input id="signup-email-address" name="email" type="email" label="Email address" required placeholder="you@example.com" value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} />
                <Input id="signup-city" name="city" type="text" label="City & State" required placeholder="San Francisco, CA" value={signUpCity} onChange={(e) => setSignUpCity(e.target.value)} />
                <Input id="signup-password" name="password" type="password" label="Password" required placeholder="••••••••" value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} />
                <div className="pt-4">
                    <Button type="submit" className="w-full">
                    Create Account
                    </Button>
                </div>
            </form>
        )}

        <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
        </div>
        <div>
            <Button type="button" variant='ghost' className="w-full border border-gray-300" onClick={googleLogin}>
                Continue as Demo User (Google)
            </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;