'use client';

import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { useState } from 'react';

export default function PublicNavbar() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Don't show public navbar if user is authenticated and has completed profile
  if (user && user.profileCompleted) {
    return null;
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-white">TL</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">TuniLearn</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/courses" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors">
              Courses
            </Link>
            <Link href="/about" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </div>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/courses"
                className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors"
              >
                Courses
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors"
              >
                Contact
              </Link>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/login"
                  className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
