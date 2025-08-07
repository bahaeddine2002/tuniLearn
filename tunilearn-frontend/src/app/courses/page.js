'use client';

// ...existing code...
import { useState, useEffect } from 'react';
import { getCourses, getSubjects } from '../../services/crudService';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import EnrollButton from './EnrollButton';

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const { user } = useAuth();

  const categories = ['All', 'Programming', 'Literature', 'Marketing', 'History', 'Languages', 'Business', 'Design'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];


  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [coursesRes, subjectsRes] = await Promise.all([
          getCourses(),
          getSubjects()
        ]);
        setCourses(coursesRes.data.data);
        setSubjects(subjectsRes.data);
      } catch (err) {
        setError('Failed to fetch courses or subjects');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredCourses = courses.filter(course => {
    const categoryMatch = selectedCategory === 'All' || course.category === selectedCategory;
    const levelMatch = selectedLevel === 'All' || course.level === selectedLevel;
    const subjectMatch = selectedSubject === 'All' || course.subject?.name === selectedSubject;
    const searchMatch =
      search.trim() === '' ||
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description?.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && levelMatch && subjectMatch && searchMatch;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">All Courses</h1>
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                className="input-field min-w-[150px]"
              >
                <option value="All">All</option>
                {Array.isArray(subjects) && subjects.map(subject => (
                  <option key={subject.id || subject.name} value={subject.name}>{subject.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="input-field min-w-[150px]"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Level</label>
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
                className="input-field min-w-[150px]"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="max-w-md w-full">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="input-field w-full"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredCourses.length === 0 ? (
            <div className="col-span-3 text-center">No courses found.</div>
          ) : (
            filteredCourses.map((course) => (
              <div key={course.id} className="block bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">{course.subject?.name}</span>
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full">{course.level}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">{course.shortDescription || course.description?.slice(0, 80) + '...'}</p>
                <div className="flex items-center justify-between mt-4 mb-2">
                  <span className="text-blue-700 dark:text-blue-300 font-semibold text-lg">${course.price}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">By {course.teacher?.name}</span>
                </div>
                <EnrollButton courseId={course.id} />
                <Link href={`/courses/${course.id}`} className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-center w-full">View Details</Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
