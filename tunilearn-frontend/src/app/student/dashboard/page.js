'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

function StudentDashboardContent() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  if (!user || user.role !== 'STUDENT') {
    return <div className="text-center py-20 text-red-600 font-bold">Not authorized</div>;
  }

  // Enhanced student data for SRS requirements
  const studentData = {
    name: user?.name || 'Ahmed Ben Ali',
    enrolledCourses: 5,
    completedCourses: 2,
    certificates: 2,
    studyHours: 47,
    currentStreak: 12,
    totalSpent: 650 // in DT
  };

  const enrolledCourses = [
    {
      id: 1,
      title: 'Complete Web Development',
      instructor: 'Sarah Johnson',
      category: 'Programming',
      progress: 65,
      totalLessons: 45,
      completedLessons: 29,
      nextLesson: 'React Hooks Deep Dive',
      thumbnail: '👨‍💻',
      rating: 4.8,
      price: 150,
      isPaid: true,
      enrolledAt: '2025-01-10',
      chapters: [
        { title: 'HTML Fundamentals', lessons: 8, completed: 8 },
        { title: 'CSS & Styling', lessons: 12, completed: 12 },
        { title: 'JavaScript Basics', lessons: 15, completed: 9 },
        { title: 'React Framework', lessons: 10, completed: 0 }
      ]
    },
    {
      id: 2,
      title: 'BAC Mathematics Preparation',
      instructor: 'Dr. Omar Mansouri',
      category: 'BAC Preparation',
      progress: 40,
      totalLessons: 30,
      completedLessons: 12,
      nextLesson: 'Differential Equations',
      thumbnail: '�',
      rating: 4.9,
      price: 120,
      isPaid: true,
      enrolledAt: '2025-01-05',
      chapters: [
        { title: 'Algebra Review', lessons: 8, completed: 8 },
        { title: 'Calculus', lessons: 12, completed: 4 },
        { title: 'Statistics', lessons: 10, completed: 0 }
      ]
    },
    {
      id: 3,
      title: 'University Physics - Mechanics',
      instructor: 'Prof. Lisa Chen',
      category: 'University',
      progress: 85,
      totalLessons: 25,
      completedLessons: 21,
      nextLesson: 'Rotational Motion',
      thumbnail: '⚛️',
      rating: 4.7,
      price: 100,
      isPaid: true,
      enrolledAt: '2025-01-01',
      chapters: [
        { title: 'Kinematics', lessons: 8, completed: 8 },
        { title: 'Dynamics', lessons: 10, completed: 10 },
        { title: 'Energy & Work', lessons: 7, completed: 3 }
      ]
    }
  ];

  const completedCourses = [
    {
      id: 4,
      title: 'JavaScript for Beginners',
      instructor: 'Mike Wilson',
      completedDate: '2025-01-15',
      certificate: true,
      rating: 4.8,
      thumbnail: '🟨',
      finalGrade: 'A',
      reviewGiven: true
    },
    {
      id: 5,
      title: 'French Language Basics',
      instructor: 'Prof. Amina Khlifi',
      completedDate: '2025-01-10',
      certificate: true,
      rating: 4.9,
      thumbnail: '🇫�',
      finalGrade: 'A+',
      reviewGiven: false
    }
  ];

  const recentActivity = [
    { action: 'Completed lesson', course: 'Complete Web Development', time: '2 hours ago' },
    { action: 'Started new course', course: 'Digital Marketing Fundamentals', time: '1 day ago' },
    { action: 'Earned certificate', course: 'JavaScript for Beginners', time: '3 days ago' },
    { action: 'Completed quiz', course: 'Arabic Literature Masterclass', time: '5 days ago' }
  ];

  const recommendations = [
    {
      id: 6,
      title: 'Advanced React Development',
      instructor: 'John Smith',
      rating: 4.9,
      students: 1234,
      price: '199 DT',
      thumbnail: '⚛️',
      reason: 'Based on your progress in Web Development'
    },
    {
      id: 7,
      title: 'Modern Arabic Poetry',
      instructor: 'Dr. Fatima Zahra',
      rating: 4.8,
      students: 856,
      price: '149 DT',
      thumbnail: '🎭',
      reason: 'Matches your interest in Arabic Literature'
    }
  ];

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

            <div className="flex items-center space-x-6">
              <Link href="/courses" className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100">
                Browse Courses
              </Link>
              <Link href="/student/certificates" className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100">
                Certificates
              </Link>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {studentData.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Continue your learning journey and achieve your goals
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{studentData.enrolledCourses}</div>
            <div className="text-gray-600 dark:text-gray-300">Enrolled Courses</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{studentData.completedCourses}</div>
            <div className="text-gray-600 dark:text-gray-300">Completed</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{studentData.certificates}</div>
            <div className="text-gray-600 dark:text-gray-300">Certificates</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{studentData.studyHours}h</div>
            <div className="text-gray-600 dark:text-gray-300">Study Hours</div>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="card mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                🔥 Learning Streak
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {studentData.currentStreak} days of continuous learning! Keep it up!
              </p>
            </div>
            <div className="text-4xl font-bold text-orange-500">
              {studentData.currentStreak}
            </div>
          </div>
          <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: '80%' }}></div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            8 more days to reach your 20-day goal!
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Continue Learning', icon: '📚' },
                { id: 'completed', label: 'Completed Courses', icon: '✅' },
                { id: 'activity', label: 'Recent Activity', icon: '📊' },
                { id: 'recommendations', label: 'Recommendations', icon: '💡' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Continue Learning
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {enrolledCourses.map(course => (
                <div key={course.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="text-4xl">{course.thumbnail}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        by {course.instructor}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                          {course.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {course.completedLessons} of {course.totalLessons} lessons completed
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Next: {course.nextLesson}
                    </div>
                  </div>

                  <Link href={`/course/${course.id}/learn`} className="btn-primary w-full text-center">
                    Continue Learning
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'completed' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Completed Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses.map(course => (
                <div key={course.id} className="card">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="text-4xl">{course.thumbnail}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        by {course.instructor}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                          {course.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Completed on {new Date(course.completedDate).toLocaleDateString()}
                  </div>

                  <div className="flex space-x-3">
                    {course.certificate && (
                      <Link href={`/certificates/${course.id}`} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-center text-sm font-medium">
                        View Certificate
                      </Link>
                    )}
                    <Link href={`/course/${course.id}`} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-center text-sm font-medium">
                      Review Course
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recent Activity
            </h2>
            <div className="card">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400">📚</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {activity.action}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {activity.course}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recommended for You
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recommendations.map(course => (
                <div key={course.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="text-4xl">{course.thumbnail}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        by {course.instructor}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                          {course.rating} • {course.students} students
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg mb-4">
                    <div className="text-sm text-green-800 dark:text-green-200">
                      💡 {course.reason}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {course.price}
                    </div>
                    <Link href={`/course/${course.id}`} className="btn-primary">
                      Enroll Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <ProtectedRoute requireRole="STUDENT">
      <StudentDashboardContent />
    </ProtectedRoute>
  );
}
