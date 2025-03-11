'use client'
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call the API to send reset password email
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(true);
    } catch (error: any) {
      setError(error?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show success message after form submission
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-xl max-w-md w-full space-y-8 border border-white/20 text-center">
          <div className="mx-auto rounded-full bg-blue-500/20 p-6 inline-flex">
            <FaEnvelope className="h-12 w-12 text-blue-300" />
          </div>
          
          <h2 className="font-bold text-3xl text-white font-['Space_Grotesk']">Check Your Email</h2>
          
          <p className="text-gray-200 text-lg">
            We've sent password reset instructions to <span className="text-blue-300 font-medium">{email}</span>
          </p>
          
          <p className="text-gray-300">
            Please check your inbox and follow the link to reset your password. The link will expire in 1 hour.
          </p>
          
          <div className="pt-4">
            <Link 
              href="/signin" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300 font-medium hover:shadow-lg hover:scale-[1.01]"
            >
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-xl max-w-md w-full space-y-8 border border-white/20">
        <div className="text-center">
          <h2 className="font-bold text-3xl md:text-4xl text-white font-['Space_Grotesk']">Reset Password</h2>
          <p className="mt-2 text-gray-200">Enter your email to receive a password reset link</p>
          <div className="mt-2 mx-auto w-16 h-1 bg-blue-500 rounded"></div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white rounded-lg p-4">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-blue-300" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Email address"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 font-medium hover:shadow-lg hover:scale-[1.01]"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : null}
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <Link 
            href="/auth/signin" 
            className="text-blue-300 hover:text-blue-400 transition-colors font-medium inline-flex items-center"
          >
            <FaArrowLeft className="mr-1 h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}