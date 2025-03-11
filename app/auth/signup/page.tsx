'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('ENTREPRENEUR');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: Verification sent
  const router = useRouter();

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
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
      // Make API call to register user
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Show verification message
      setStep(2);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Display verification sent screen
  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-xl max-w-md w-full space-y-8 border border-white/20 text-center">
          <div className="mx-auto rounded-full bg-blue-500/20 p-6 inline-flex">
            <FaEnvelope className="h-12 w-12 text-blue-300" />
          </div>
          
          <h2 className="font-bold text-3xl text-white font-['Space_Grotesk']">Verify Your Email</h2>
          
          <p className="text-gray-200 text-lg">
            We've sent a verification link to <span className="text-blue-300 font-medium">{email}</span>
          </p>
          
          <p className="text-gray-300">
            Please check your inbox and click the link to verify your account. The link will expire in 24 hours.
          </p>
          
          <div className="pt-4">
            <Link 
              href="/signin" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300 font-medium hover:shadow-lg hover:scale-[1.01]"
            >
              Go to Sign In
              <FaArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <p className="text-gray-400 text-sm pt-6">
            Didn't receive the email? Check your spam folder or <button className="text-blue-300 hover:text-blue-400 underline" onClick={() => setStep(1)}>try again</button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-xl max-w-md w-full space-y-8 border border-white/20">
        <div className="text-center">
          <h2 className="font-bold text-3xl md:text-4xl text-white font-['Space_Grotesk']">Create Account</h2>
          <p className="mt-2 text-gray-200">Join the TIET-UQ Centre of Excellence</p>
          <div className="mt-2 mx-auto w-16 h-1 bg-blue-500 rounded"></div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white rounded-lg p-4">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Full Name"
                />
              </div>
            </div>
            
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
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Password (min. 8 characters)"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-200 mb-2">
                I am registering as a:
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="appearance-none relative block w-full pl-3 pr-10 py-3 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ENTREPRENEUR" className="bg-gray-800">Entrepreneur</option>
                <option value="MENTOR" className="bg-gray-800">Mentor</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 font-medium hover:shadow-lg hover:scale-[1.01]"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaUser className="h-5 w-5 text-blue-300 group-hover:text-blue-200" />
                )}
              </span>
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-white">
            Already have an account?{' '}
            <Link 
              href="/auth/signin" 
              className="text-blue-300 hover:text-blue-400 transition-colors font-medium inline-flex items-center"
            >
              Sign in <FaArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}