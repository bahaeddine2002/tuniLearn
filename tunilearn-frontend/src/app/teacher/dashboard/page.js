'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

function TeacherDashboardContent() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  if (!user || (user.role !== 'TEACHER' && user.role !== 'INSTRUCTOR')) {
    return <div className="text-center py-20 text-red-600 font-bold">Not authorized</div>;
  }

  // Enhanced data for SRS requirements
  const teacherStats = {
    totalCourses: 8,
    totalStudents: 247,
    totalRevenue: 12450, // in DT
    averageRating: 4.7,
    pendingApprovals: 2, // courses waiting for admin approval
    totalEnrollments: 347
  };

  const myCourses = [
    {
      id: 1,
      title: 'Advanced JavaScript & ES6',
      category: 'Programming',
      status: 'APPROVED', // PENDING, APPROVED, REJECTED
      students: 89,
      revenue: 3560,
      rating: 4.8,
      chapters: 12,
      lessons: 45,
      lastUpdated: '2025-01-15',
      price: 120,
      enrollments: 89
    },
    {
      id: 2,
      title: 'React Development Mastery',
      category: 'Programming', 
      status: 'APPROVED',
      students: 76,
      revenue: 4180,
      rating: 4.9,
      chapters: 15,
      lessons: 52,
      lastUpdated: '2025-01-10',
      price: 150,
      enrollments: 76
    },
    {
      id: 3,
      title: 'Preparation BAC Mathematics',
      category: 'BAC Preparation',
      status: 'PENDING', // waiting for admin approval
      students: 0,
      revenue: 0,
      rating: 0,
      chapters: 8,
      lessons: 24,
      lastUpdated: '2025-01-18',
      price: 80,
      enrollments: 0
    },
    {
      id: 4,
      title: 'University Physics - Mechanics',
      category: 'University',
      status: 'APPROVED',
      students: 43,
      revenue: 2150,
      rating: 4.6,
      chapters: 10,
      lessons: 38,
      lastUpdated: '2025-01-12',
      price: 100,
      enrollments: 43
    }
  ];

  const recentEnrollments = [
    { studentName: 'Ahmed Ben Salem', course: 'Advanced JavaScript & ES6', enrolledAt: '2025-01-18', isPaid: true },
    { studentName: 'Fatma Khelifi', course: 'React Development Mastery', enrolledAt: '2025-01-17', isPaid: true },
    { studentName: 'Mohamed Triki', course: 'University Physics - Mechanics', enrolledAt: '2025-01-16', isPaid: false },
    { studentName: 'Leila Mansouri', course: 'Advanced JavaScript & ES6', enrolledAt: '2025-01-15', isPaid: true }
  ];


  const courseReviews = [
    {
      id: 1,
      studentName: 'Sarra Ben Ahmed',
      course: 'Advanced JavaScript & ES6',
      rating: 5,
      comment: 'Excellent course! Very clear explanations and practical examples.',
      reviewedAt: '2025-01-17'
    },
    {
      id: 2,
      studentName: 'Karim Mestiri',
      course: 'React Development Mastery',
      rating: 5,
      comment: 'Best React course I have taken. Highly recommended!',
      reviewedAt: '2025-01-16'
    },
    {
      id: 3,
      studentName: 'Nour Belhadj',
      course: 'University Physics - Mechanics',
      rating: 4,
      comment: 'Good course but could use more examples for complex topics.',
      reviewedAt: '2025-01-15'
    }
  ];

  // Combine enrollments and reviews for recent activity
  const recentActivity = [
    ...recentEnrollments.map((enroll) => ({
      type: 'enrollment',
      message: `${enroll.studentName} enrolled in ${enroll.course}${enroll.isPaid ? ' (Paid)' : ''}`,
      time: enroll.enrolledAt
    })),
    ...courseReviews.map((review) => ({
      type: 'review',
      message: `${review.studentName} reviewed ${review.course}: "${review.comment}"`,
      time: review.reviewedAt
    }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <span className="text-lg font-bold text-white">TL</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">TuniLearn</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/teacher/create-course" className="btn-primary">
                Create Course
              </Link>
              <div className="relative">
                <button className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">AS</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Teacher Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Welcome back, Ahmed! Here&apos;s how your courses are performing.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{teacherStats.totalCourses}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{teacherStats.totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{teacherStats.totalRevenue} DT</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{teacherStats.averageRating}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'courses', 'analytics', 'students'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/teacher/create-course" className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center hover:border-blue-500 transition-colors">
                      <div className="text-2xl mb-2">➕</div>
                      <div className="font-medium text-gray-900 dark:text-white">Create New Course</div>
                      <div className="text-sm text-gray-500">Start building your next course</div>
                    </Link>
                    <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center hover:border-blue-500 transition-colors">
                      <div className="text-2xl mb-2">📊</div>
                      <div className="font-medium text-gray-900 dark:text-white">View Analytics</div>
                      <div className="text-sm text-gray-500">Track your performance</div>
                    </button>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    My Courses
                  </h3>
                  <div className="space-y-4">
                    {myCourses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{course.title}</h4>
                          <p className="text-sm text-gray-500">{course.students} students • {course.rating}⭐</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900 dark:text-white">{course.revenue} DT</div>
                          <div className={`text-sm px-2 py-1 rounded ${
                            course.status === 'Published' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {course.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    All Courses
                  </h3>
                  <Link href="/teacher/create-course" className="btn-primary">
                    Create Course
                  </Link>
                </div>
                <div className="space-y-4">
                  {myCourses.map((course) => (
                    <div key={course.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {course.title}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{course.students} students</span>
                            <span>{course.rating}⭐ rating</span>
                            <span>Updated {course.lastUpdated}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded text-sm ${
                            course.status === 'Published' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {course.status}
                          </span>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {course.revenue} DT revenue
                        </div>
                        <div className="space-x-2">
                          <button className="text-blue-600 hover:text-blue-500 text-sm">Edit</button>
                          <button className="text-gray-600 hover:text-gray-500 text-sm">View</button>
                          <button className="text-red-600 hover:text-red-500 text-sm">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      activity.type === 'enrollment' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {activity.type === 'enrollment' ? '👤' : activity.type === 'review' ? '⭐' : '❓'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tips for Success
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 Upload course videos in HD quality for better student engagement
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    📝 Add quizzes and assignments to improve learning outcomes
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900 rounded-lg">
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    🎯 Respond to student questions within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  return (
    <ProtectedRoute requireRole="TEACHER">
      <TeacherDashboardContent />
    </ProtectedRoute>
  );
}
