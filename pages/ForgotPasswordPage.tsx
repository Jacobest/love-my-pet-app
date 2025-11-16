import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { PawPrint, Mail, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger an API call to send a reset email.
    // For this mock, we'll just show the confirmation message.
    console.log('Password reset requested for:', email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div>
          <PawPrint className="mx-auto h-12 w-auto text-brand-primary" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot Your Password?
          </h2>
        </div>

        {isSubmitted ? (
          <div className="text-center">
            <Mail className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Check your email</h3>
            <p className="mt-2 text-sm text-gray-600">
              If an account exists for {email}, you will receive an email with instructions on how to reset your password.
            </p>
             <p className="mt-4 text-sm">
                <Link to="/login" className="font-medium text-brand-primary hover:text-brand-primary/80 flex items-center justify-center gap-2">
                    <ArrowLeft size={16} /> Back to Login
                </Link>
            </p>
            {/* In a real app, you wouldn't show this link, but for the demo it's useful */}
            <p className="mt-8 text-xs text-gray-400">
              (Psst... since this is a demo, <Link to="/reset-password/demo-token" className="underline">click here to proceed</Link>.)
            </p>
          </div>
        ) : (
          <>
            <p className="mt-2 text-center text-sm text-gray-600">
              No problem. Enter your email address below and we'll send you a link to reset it.
            </p>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <Input
                id="email-address"
                name="email"
                type="email"
                label="Email address"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div>
                <Button type="submit" className="w-full">
                  Send Reset Link
                </Button>
              </div>
            </form>
             <p className="mt-4 text-center text-sm">
                <Link to="/login" className="font-medium text-brand-primary hover:text-brand-primary/80 flex items-center justify-center gap-2">
                    <ArrowLeft size={16} /> Back to Login
                </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;