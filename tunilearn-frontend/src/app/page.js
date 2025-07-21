'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isTeacher, isStudent } = useAuth();

  const featuredCourses = [
    {
      id: 1,
      title: "Modern JavaScript Development",
      instructor: "Ahmed Ben Salem",
      rating: 4.8,
      students: 2547,
      price: 89,
      image: "/course-1.jpg",
      category: "Programming",
      level: "Intermediate",
      duration: "12 hours"
    },
    {
      id: 2,
      title: "Arabic Literature & Poetry",
      instructor: "Fatma Khelifi",
      rating: 4.9,
      students: 1834,
      price: 65,
      image: "/course-2.jpg",
      category: "Literature",
      level: "Beginner",
      duration: "8 hours"
    },
    {
      id: 3,
      title: "Digital Marketing Mastery",
      instructor: "Mohamed Triki",
      rating: 4.7,
      students: 3421,
      price: 120,
      image: "/course-3.jpg",
      category: "Marketing",
      level: "Advanced",
      duration: "15 hours"
    },
    {
      id: 4,
      title: "Tunisian History & Heritage",
      instructor: "Leila Mansouri",
      rating: 4.6,
      students: 892,
      price: 55,
      image: "/course-4.jpg",
      category: "History",
      level: "Beginner",
      duration: "10 hours"
    },
    {
      id: 5,
      title: "React & Next.js Development",
      instructor: "Youssef Hamdani",
      rating: 4.9,
      students: 1967,
      price: 99,
      image: "/course-5.jpg",
      category: "Programming",
      level: "Intermediate",
      duration: "18 hours"
    },
    {
      id: 6,
      title: "Business French for Professionals",
      instructor: "Amira Zouari",
      rating: 4.5,
      students: 1456,
      price: 75,
      image: "/course-6.jpg",
      category: "Languages",
      level: "Intermediate",
      duration: "14 hours"
    }
  ];

  const testimonials = [
    {
      name: "Sarra Ben Ahmed",
      role: "Software Developer",
      content: "TuniLearn helped me transition from traditional studies to modern tech skills. The quality of courses is exceptional!",
      avatar: "/avatar-1.jpg",
      rating: 5
    },
    {
      name: "Karim Mestiri",
      role: "Marketing Manager",
      content: "As a busy professional, I love the flexibility of learning at my own pace. The instructors are top-notch.",
      avatar: "/avatar-2.jpg",
      rating: 5
    },
    {
      name: "Nour Belhadj",
      role: "University Student",
      content: "The courses complement my university studies perfectly. Great platform for Tunisian learners!",
      avatar: "/avatar-3.jpg",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
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
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700 dark:text-gray-200">
                    Welcome, {user?.name}
                  </span>
                  {isTeacher && (
                    <Link 
                      href="/teacher/dashboard" 
                      className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors font-medium"
                    >
                      Dashboard
                    </Link>
                  )}
                  {isStudent && (
                    <Link 
                      href="/student/dashboard" 
                      className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors font-medium"
                    >
                      My Learning
                    </Link>
                  )}
                  <button 
                    onClick={logout}
                    className="btn-primary"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/register" 
                    className="btn-primary"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-4">
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
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  {isAuthenticated ? (
                    <>
                      <div className="mb-3 text-gray-700 dark:text-gray-200">
                        Welcome, {user?.name}
                      </div>
                      {isTeacher && (
                        <Link 
                          href="/teacher/dashboard" 
                          className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors mb-2"
                        >
                          Dashboard
                        </Link>
                      )}
                      {isStudent && (
                        <Link 
                          href="/student/dashboard" 
                          className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors mb-2"
                        >
                          My Learning
                        </Link>
                      )}
                      <button 
                        onClick={logout}
                        className="btn-primary inline-block"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/login" 
                        className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors mb-2"
                      >
                        Sign In
                      </Link>
                      <Link 
                        href="/register" 
                        className="btn-primary inline-block"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Learn, Grow, and Excel with{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                TuniLearn
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              The premier Tunisian learning platform offering high-quality courses in Arabic, French, and English. 
              Master new skills from expert instructors and join thousands of successful learners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="btn-primary text-lg px-8 py-4"
              >
                Start Learning Today
              </Link>
              <Link 
                href="/courses" 
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-lg font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">25K+</div>
              <div className="text-gray-600 dark:text-gray-300">Active Students</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-300">Expert Instructors</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">1,200+</div>
              <div className="text-gray-600 dark:text-gray-300">Quality Courses</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600 dark:text-gray-300">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our most popular courses designed by industry experts and loved by students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div key={course.id} className="card hover:shadow-xl transition-shadow cursor-pointer">
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 h-48 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-4xl">📚</div>
                </div>
                
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                    {course.category}
                  </span>
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full ml-2">
                    {course.level}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {course.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  by {course.instructor}
                </p>

                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                      {course.rating} ({course.students} students)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {course.duration}
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {course.price} DT
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/courses" 
              className="btn-primary text-lg px-8 py-4"
            >
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose TuniLearn */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose TuniLearn?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We&apos;re committed to providing the best learning experience for Tunisian students and professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Quality Content
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Expertly crafted courses by industry professionals with real-world experience and proven track records.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Flexible Learning
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Learn at your own pace, anytime, anywhere. Perfect for busy professionals and students with varying schedules.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Certified Learning
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Earn recognized certificates upon completion to boost your career and validate your newly acquired skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of satisfied learners who have transformed their careers with TuniLearn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <blockquote className="text-gray-600 dark:text-gray-300 mb-6">
                  &quot;{testimonial.content}&quot;
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students already learning on TuniLearn. Start with a free course today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </Link>
            <Link 
              href="/courses" 
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <span className="text-lg font-bold text-white">TL</span>
                </div>
                <span className="text-xl font-bold">TuniLearn</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering Tunisian minds through quality education and innovative learning experiences.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/courses" className="text-gray-400 hover:text-white transition-colors">All Courses</Link></li>
                <li><Link href="/instructors" className="text-gray-400 hover:text-white transition-colors">Become an Instructor</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Subscribe to get updates on new courses and features.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 TuniLearn. All rights reserved. Made with ❤️ in Tunisia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
