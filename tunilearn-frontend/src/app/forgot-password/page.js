'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // TODO: Replace with actual API call
      // await resetPassword(email);
      
      // Simulate API call
      setTimeout(() => {
        console.log('Reset password for:', email);
        setIsSubmitted(true);
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      setError('Unable to send reset email. Please try again.');
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Check Your Email
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We&apos;ve sent a password reset link to
            </p>
            <p className="text-blue-600 font-medium mb-6">{email}</p>
          </div>

          <div className="card">
            <div className="text-center space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  Please check your email and click the reset link to create a new password.
                </p>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Didn&apos;t receive the email? Check your spam folder or{' '}
                <button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  try again
                </button>
              </p>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                <Link 
                  href="/login"
                  className="btn-primary w-full inline-flex items-center justify-center"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">TL</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            No worries! Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {/* Reset Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending reset link...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>

            {/* Back to Login */}
            <div className="text-center">
              <Link 
                href="/login" 
                className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 inline-flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Need help? Contact our{' '}
            <Link href="/support" className="text-blue-600 hover:text-blue-500">
              support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
