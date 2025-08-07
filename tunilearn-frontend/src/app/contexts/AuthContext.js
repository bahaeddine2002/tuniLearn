'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthStatus, logout as logoutUser } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await checkAuthStatus();
      if (response.authenticated) {
        setUser(response.user);
      }
    } catch (error) {
      // User not authenticated, clear any stored data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
    
    // Store in localStorage as backup
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Redirect based on profile completion and role
    if (!userData.profileCompleted) {
      router.push('/complete-profile');
    } else {
      redirectToDashboard(userData.role);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state regardless of API response
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/');
    }
  };

  const completeProfile = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    redirectToDashboard(userData.role);
  };

  const redirectToDashboard = (role) => {
    const dashboardRoutes = {
      STUDENT: '/student/dashboard',
      TEACHER: '/teacher/dashboard',
      ADMIN: '/admin/dashboard'
    };
    
    const redirectPath = dashboardRoutes[role] || '/';
    router.push(redirectPath);
  };

  const value = {
    user,
    login,
    logout,
    completeProfile,
    loading,
    profileCompleted: user?.profileCompleted || false,
    isAuthenticated: !!user,
    isTeacher: user?.role === 'TEACHER',
    isStudent: user?.role === 'STUDENT',
    isAdmin: user?.role === 'ADMIN',
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
