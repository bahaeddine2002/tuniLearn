'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, requireRole = null, requireProfileCompletion = true }) {
  const { user, loading, profileCompleted } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User not logged in, redirect to login
        router.push('/login');
        return;
      }

      if (requireProfileCompletion && !profileCompleted) {
        // Profile not completed, redirect to complete profile
        router.push('/complete-profile');
        return;
      }

      if (requireRole) {
        // Check if user has required role
        const hasRequiredRole = requireRole === 'TEACHER' 
          ? (user.role === 'TEACHER' || user.role === 'INSTRUCTOR')
          : user.role === requireRole;

        if (!hasRequiredRole) {
          // User doesn't have required role, redirect to appropriate dashboard
          if (user.role === 'TEACHER' || user.role === 'INSTRUCTOR') {
            router.push('/teacher/dashboard');
          } else if (user.role === 'STUDENT') {
            router.push('/student/dashboard');
          } else if (user.role === 'ADMIN') {
            router.push('/admin/dashboard');
          } else {
            router.push('/complete-profile');
          }
          return;
        }
      }
    }
  }, [user, loading, requireRole, requireProfileCompletion, profileCompleted, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">TL</span>
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Loading...
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Verifying your authentication...
          </div>
        </div>
      </div>
    );
  }

  // Don't render children if user is not authenticated or doesn't meet requirements
  if (!user || (requireProfileCompletion && !profileCompleted)) {
    return null;
  }

  if (requireRole) {
    const hasRequiredRole = requireRole === 'TEACHER' 
      ? (user.role === 'TEACHER' || user.role === 'INSTRUCTOR')
      : user.role === requireRole;
    
    if (!hasRequiredRole) {
      return null;
    }
  }

  return children;
}
