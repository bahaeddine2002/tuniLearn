'use client';

import { useState, useEffect } from 'react';
import { fetchStudentEnrollments } from '../../../services/enrollmentService';
import { getUser, updateUser } from '../../../services/userService';
import Link from 'next/link';

function StudentProfileContent() {
  const [enrollments, setEnrollments] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [userLoading, setUserLoading] = useState(true);

  // Static student data (ID 3 as per our implementation)
  const studentId = 3;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchEnrollmentData();
  }, []);

  const fetchUserData = async () => {
    try {
      setUserLoading(true);
      const response = await getUser(studentId);
      console.log('User data received:', response);
      setUserData(response.data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data');
    } finally {
      setUserLoading(false);
    }
  };

  const fetchEnrollmentData = async () => {
    try {
      setLoading(true);
      // Fetch enrollments
      const enrollmentData = await fetchStudentEnrollments(studentId);
      console.log('Enrollment data received:', enrollmentData);
      
      const enrollments = enrollmentData.data || [];
      setEnrollments(enrollments);

      // Map the enrollment data to courses
      const courses = enrollments.map(enrollment => ({
        ...enrollment.course,
        enrollmentDate: enrollment.enrolledAt,
        enrollmentId: enrollment.id
      }));

      setEnrolledCourses(courses);
    } catch (err) {
      console.error('Error fetching enrollment data:', err);
      setError('Failed to load enrollment data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    totalCourses: enrolledCourses.length,
    totalSpent: enrolledCourses.reduce((sum, course) => sum + (course.price || 0), 0),
    averageRating: enrolledCourses.length > 0 
      ? (enrolledCourses.reduce((sum, course) => sum + (course.rating || 4.5), 0) / enrolledCourses.length).toFixed(1)
      : '0.0',
    totalHours: enrolledCourses.reduce((sum, course) => {
      const chapters = course.chapters || [];
      return sum + chapters.reduce((chapterSum, chapter) => chapterSum + (chapter.sections?.length || 0), 0);
    }, 0) * 1.5 // Estimate 1.5 hours per section
  };

  const handleEditProfile = () => {
    setEditedProfile({...userData});
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await updateUser(studentId, editedProfile);
      setUserData(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile changes');
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile({});
    setIsEditing(false);
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/student/dashboard" className="text-blue-600 hover:text-blue-800">
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              {/* Profile Picture */}
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-bold">
                  {userData?.name?.charAt(0) || 'S'}
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                  {userData?.name || 'Student User'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">Computer Science Student</p>
                {!isEditing ? (
                  <button 
                    onClick={handleEditProfile}
                    className="mt-2 inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
                  >
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <div className="mt-2 space-x-2">
                    <button 
                      onClick={handleSaveProfile}
                      className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full hover:bg-green-200"
                    >
                      ✅ Save
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="mt-6 space-y-3">
                {!isEditing ? (
                  <>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <span className="w-5 h-5 mr-3">📧</span>
                      <span>{userData?.email || 'student@tunilearn.com'}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <span className="w-5 h-5 mr-3">�</span>
                      <span>{userData?.role || 'STUDENT'}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <span className="w-5 h-5 mr-3">�</span>
                      <span>Joined {userData?.createdAt ? new Date(userData.createdAt).getFullYear() : new Date().getFullYear()}</span>
                    </div>
                    {userData?.bio && (
                      <div className="flex items-start text-gray-600 dark:text-gray-400">
                        <span className="w-5 h-5 mr-3 mt-1">�</span>
                        <span>{userData.bio}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <input
                          type="text"
                          value={editedProfile.name || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                          type="email"
                          value={editedProfile.email || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                        <textarea
                          value={editedProfile.bio || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalCourses}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Courses Enrolled</div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{Math.round(stats.totalHours)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Learning Hours</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'overview'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'courses'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Enrolled Courses ({stats.totalCourses})
                  </button>
                  <button
                    onClick={() => setActiveTab('achievements')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'achievements'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Achievements
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'settings'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Profile Settings
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">📚</span>
                          <div>
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Courses</p>
                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{stats.totalCourses}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">⏰</span>
                          <div>
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">Learning Hours</p>
                            <p className="text-2xl font-bold text-green-900 dark:text-green-300">{Math.round(stats.totalHours)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">💰</span>
                          <div>
                            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Spent</p>
                            <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">${stats.totalSpent}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">⭐</span>
                          <div>
                            <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Avg Rating</p>
                            <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">{stats.averageRating}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                      <div className="space-y-3">
                        {enrolledCourses.slice(0, 3).map((course, index) => (
                          <div key={course.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                              {course.title.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Enrolled in "{course.title}"
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(course.enrollmentDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'courses' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Enrolled Courses ({stats.totalCourses})
                      </h3>
                      <Link href="/courses" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Browse More Courses →
                      </Link>
                    </div>

                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading courses...</p>
                      </div>
                    ) : error ? (
                      <div className="text-center py-8 text-red-600">{error}</div>
                    ) : enrolledCourses.length === 0 ? (
                      <div className="text-center py-12">
                        <span className="text-6xl mb-4 block">📚</span>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses enrolled yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Start your learning journey by enrolling in a course!</p>
                        <Link href="/courses" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          Browse Courses
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {enrolledCourses.map((course) => (
                          <div key={course.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-lg transition-shadow">
                            {/* Course Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                  {course.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  By {course.teacher?.name || 'Unknown Instructor'}
                                </p>
                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                  {course.subject?.name || 'General'}
                                </p>
                              </div>
                              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                ${course.price}
                              </span>
                            </div>

                            {/* Course Image */}
                            {course.coverImageUrl && (
                              <img 
                                src={`http://localhost:5000${course.coverImageUrl.startsWith('/uploads') ? course.coverImageUrl : `/uploads/${course.coverImageUrl}`}`}
                                alt={course.title}
                                className="w-full h-32 object-cover rounded-lg mb-4"
                              />
                            )}

                            {/* Course Info */}
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <span className="w-4 h-4 mr-2">📅</span>
                                Enrolled: {new Date(course.enrollmentDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <span className="w-4 h-4 mr-2">📚</span>
                                {course.chapters?.length || 0} Chapters
                              </div>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <span className="w-4 h-4 mr-2">⏰</span>
                                ~{(course.chapters?.reduce((sum, ch) => sum + (ch.sections?.length || 0), 0) || 0) * 1.5}h content
                              </div>
                            </div>

                            {/* Course Description */}
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                              {course.description}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex space-x-3">
                              <Link 
                                href={`/course/${course.id}/learn`}
                                className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Continue Learning
                              </Link>
                              <Link 
                                href={`/courses/${course.id}`}
                                className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-center py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'achievements' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Achievements & Certificates</h3>
                    
                    {/* Achievement Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                        <span className="text-2xl mb-2 block">🎓</span>
                        <h4 className="font-semibold">First Course Completed</h4>
                        <p className="text-sm opacity-90">Completed your first course</p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
                        <span className="text-2xl mb-2 block">⭐</span>
                        <h4 className="font-semibold">Fast Learner</h4>
                        <p className="text-sm opacity-90">Enrolled in multiple courses</p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
                        <span className="text-2xl mb-2 block">📚</span>
                        <h4 className="font-semibold">Knowledge Seeker</h4>
                        <p className="text-sm opacity-90">Active learner badge</p>
                      </div>
                    </div>

                    {/* Certificates */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Certificates</h4>
                      <p className="text-gray-600 dark:text-gray-400">Complete courses to earn certificates!</p>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile Settings</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={userData?.name || ''}
                          onChange={(e) => setUserData({...userData, name: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={userData?.email || ''}
                          onChange={(e) => setUserData({...userData, email: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Bio
                        </label>
                        <textarea
                          value={userData?.bio || ''}
                          onChange={(e) => setUserData({...userData, bio: e.target.value})}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      <div className="flex justify-end">
                        <button 
                          onClick={() => handleSaveProfile()}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentProfile() {
  return <StudentProfileContent />;
}
