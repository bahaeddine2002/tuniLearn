"use client";
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

export default function RoleNavbar() {
  const { user, logout } = useAuth();

  if (!user || !user.profileCompleted) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (user.role === 'ADMIN') {
    return (
      <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div className="font-bold text-xl">TuniLearn Admin</div>
        <div className="flex gap-4 items-center">
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/pending">Pending Courses</Link>
          <Link href="/courses">All Courses</Link>
          <Link href="/teacher/dashboard">Teachers</Link>
          <Link href="/student/dashboard">Students</Link>
          {user.profileImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={user.profileImageUrl} 
              alt="Profile" 
              className="w-8 h-8 rounded-full"
            />
          )}
          <button onClick={handleLogout} className="ml-4 text-red-400 hover:text-red-300">
            Logout
          </button>
        </div>
      </nav>
    );
  }

  if (user.role === 'TEACHER' || user.role === 'INSTRUCTOR') {
    return (
      <nav className="bg-blue-900 text-white p-4 flex justify-between items-center">
        <div className="font-bold text-xl">TuniLearn Teacher</div>
        <div className="flex gap-4 items-center">
          <Link href="/teacher/dashboard">Dashboard</Link>
          <Link href="/teacher/profile">My Profile</Link>
          <Link href="/teacher/courses">My Courses</Link>
          <Link href="/teacher/create-course">Create Course</Link>
          <Link href="/courses">All Courses</Link>
          {user.profileImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={user.profileImageUrl} 
              alt="Profile" 
              className="w-8 h-8 rounded-full"
            />
          )}
          <button onClick={handleLogout} className="ml-4 text-red-400 hover:text-red-300">
            Logout
          </button>
        </div>
      </nav>
    );
  }

  if (user.role === 'STUDENT') {
    return (
      <nav className="bg-green-900 text-white p-4 flex justify-between items-center">
        <div className="font-bold text-xl">TuniLearn Student</div>
        <div className="flex gap-4 items-center">
          <Link href="/student/dashboard">Dashboard</Link>
          <Link href="/courses">All Courses</Link>
          <Link href="/teacher/dashboard">Teachers</Link>
          {user.profileImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={user.profileImageUrl} 
              alt="Profile" 
              className="w-8 h-8 rounded-full"
            />
          )}
          <button onClick={handleLogout} className="ml-4 text-red-400 hover:text-red-300">
            Logout
          </button>
        </div>
      </nav>
    );
  }

  return null;
}
