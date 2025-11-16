import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { PawPrint, CheckCircle } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isReset, setIsReset] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isReset) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isReset, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // In a real app, this would trigger an API call to update the password.
    console.log('Password has been reset.');
    setIsReset(true);
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div>
          <PawPrint className="mx-auto h-12 w-auto text-brand-primary" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
        </div>
        {isReset ? (
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Password Reset!</h3>
            <p className="mt-2 text-sm text-gray-600">
              Your password has been successfully reset. You will be redirected to the login page shortly.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter and confirm your new password below.
            </p>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <Input
                id="new-password"
                name="password"
                type="password"
                label="New Password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="pt-2">
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  label="Confirm New Password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}

              <div>
                <Button type="submit" className="w-full">
                  Reset Password
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;