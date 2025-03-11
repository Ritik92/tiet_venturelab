'use client'
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get token from URL query params
    const token = searchParams.get('token');
    if (token) {
      setToken(token);
      // Validate token on component mount
      validateToken(token);
    }
  }, [searchParams]);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`/api/auth/verify-reset-token?token=${token}`);
      const data = await response.json();
      
      setIsTokenValid(response.ok);
      setTokenChecked(true);
      
      if (!response.ok) {
        setError(data.message || 'Invalid or expired token');
      }
    } catch (error) {
      setIsTokenValid(false);
      setTokenChecked(true);
      setError('Could not verify reset token');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      // Call API to reset password
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking token
  if (!tokenChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-xl max-w-md w-full space-y-8 border border-white/20 text-center">
          <div className="h-12 w-12 border-4 border-blue-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="font-bold text-2xl text-white font-['Space_Grotesk']">Verifying your reset link...</h2>
        </div>
      </div>
    );
  }

  // Show error message if token is invalid
  if (tokenChecked && !isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-xl max-w-md w-full space-y-8 border border-white/20 text-center">
          <div className="mx-auto rounded-full bg-red-500/20 p-6 inline-flex">
            <FaLock className="h-12 w-12 text-red-300" />
          </div>
          
          <h2 className="font-bold text-3xl text-white font-['Space_Grotesk']">Invalid Reset Link</h2>
          
          <p className="text-gray-200 text-lg">
            The password reset link is invalid or has expired.
          </p>
          
          <div className="pt-4">
            <Link 
              href="/forgot-password" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300 font-medium hover:shadow-lg hover:scale-[1.01]"
            >
              Request a new link
            </Link>
          </div>
          
          <div className="text-center mt-6">
            <Link 
              href="/signin" 
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

  // Show success message after password reset
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-xl max-w-md w-full space-y-8 border border-white/20 text-center">
          <div className="mx-auto rounded-full bg-green-500/20 p-6 inline-flex">
            <svg className="h-12 w-12 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="font-bold text-3xl text-white font-['Space_Grotesk']">Password Reset</h2>
          
          <p className="text-gray-200 text-lg">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
          
          <div className="pt-6">
            <Link 
              href="/signin" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300 font-medium hover:shadow-lg hover:scale-[1.01]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Main password reset form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-xl max-w-md w-full space-y-8 border border-white/20">
        <div>
          <h2 className="font-bold text-3xl text-white text-center font-['Space_Grotesk']">Reset Password</h2>
          <p className="mt-2 text-center text-gray-200 text-lg">
            Please enter your new password below
          </p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-300/20 rounded-lg p-3 text-red-200">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-300">
                Must be at least 8 characters long
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:hover:bg-blue-500 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </span>
                  Processing...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
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
