'use client'
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowRight, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

export default function VerifyEmail() {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) return;

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
        } else {
          setStatus('error');
          setError(data.message || 'Verification failed');
        }
      } catch (error) {
        setStatus('error');
        setError('An unexpected error occurred');
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-xl max-w-md w-full space-y-8 border border-white/20 text-center">
        {status === 'verifying' && (
          <>
            <div className="h-12 w-12 border-4 border-blue-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h2 className="font-bold text-2xl text-white font-['Space_Grotesk']">Verifying your email...</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto rounded-full bg-green-500/20 p-6 inline-flex">
              <FaCheck className="h-12 w-12 text-green-300" />
            </div>
            
            <h2 className="font-bold text-3xl text-white font-['Space_Grotesk']">Email Verified!</h2>
            
            <p className="text-gray-200 text-lg">
              Your email has been successfully verified. You can now sign in to your account.
            </p>
            
            <div className="pt-6">
              <Link 
                href="/signin" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300 font-medium hover:shadow-lg hover:scale-[1.01]"
              >
                Sign In
                <FaArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto rounded-full bg-red-500/20 p-6 inline-flex">
              <FaExclamationTriangle className="h-12 w-12 text-red-300" />
            </div>
            
            <h2 className="font-bold text-3xl text-white font-['Space_Grotesk']">Verification Failed</h2>
            
            <p className="text-gray-200 text-lg">
              {error || 'The verification link is invalid or has expired.'}
            </p>
            
            <div className="pt-6">
              <Link 
                href="/resend-verification" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300 font-medium hover:shadow-lg hover:scale-[1.01]"
              >
                Request a new verification email
              </Link>
            </div>
            
            <div className="text-center mt-6">
              <Link 
                href="/auth/signin" 
                className="text-blue-300 hover:text-blue-400 transition-colors font-medium"
              >
                Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}