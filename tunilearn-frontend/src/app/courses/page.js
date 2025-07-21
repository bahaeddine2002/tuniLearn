'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const categories = ['All', 'Programming', 'Literature', 'Marketing', 'History', 'Languages', 'Business', 'Design'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const allCourses = [
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
      duration: "12 hours",
      description: "Master modern JavaScript ES6+ features, async programming, and build real-world applications."
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
      duration: "8 hours",
      description: "Explore the rich world of Arabic literature and poetry from classical to contemporary works."
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
      duration: "15 hours",
      description: "Complete digital marketing course covering SEO, SEM, social media, and analytics."
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
      duration: "10 hours",
      description: "Journey through Tunisia's rich history from ancient Carthage to modern times."
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
      duration: "18 hours",
      description: "Build modern web applications with React and Next.js from scratch to deployment."
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
      duration: "14 hours",
      description: "Master business French for professional communication and career advancement."
    },
    {
      id: 7,
      title: "Python for Data Science",
      instructor: "Karim Belhadj",
      rating: 4.8,
      students: 2156,
      price: 110,
      image: "/course-7.jpg",
      category: "Programming",
      level: "Beginner",
      duration: "20 hours",
      description: "Learn Python programming and data analysis with pandas, numpy, and matplotlib."
    },
    {
      id: 8,
      title: "Graphic Design Fundamentals",
      instructor: "Nadia Slim",
      rating: 4.7,
      students: 1678,
      price: 85,
      image: "/course-8.jpg",
      category: "Design",
      level: "Beginner",
      duration: "16 hours",
      description: "Master the principles of graphic design using Adobe Creative Suite and modern tools."
    },
    {
      id: 9,
      title: "Entrepreneurship in Tunisia",
      instructor: "Samir Chebil",
      rating: 4.6,
      students: 934,
      price: 95,
      image: "/course-9.jpg",
      category: "Business",
      level: "Intermediate",
      duration: "12 hours",
      description: "Start and grow your business in Tunisia with practical insights and real case studies."
    }
  ];

  const filteredCourses = allCourses.filter(course => {
    const categoryMatch = selectedCategory === 'All' || course.category === selectedCategory;
    const levelMatch = selectedLevel === 'All' || course.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <span className="text-lg font-bold text-white">TL</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">TuniLearn</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/courses" className="text-blue-600 font-medium">
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
            <div className="flex items-center space-x-4">
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
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Our Courses
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover high-quality courses taught by expert instructors. Learn at your own pace and advance your career.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="input-field pl-12"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field min-w-[150px]"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Level
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="input-field min-w-[150px]"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300">
              Showing {filteredCourses.length} of {allCourses.length} courses
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div key={course.id} className="card hover:shadow-xl transition-all duration-300 hover-scale cursor-pointer">
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
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  by {course.instructor}
                </p>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {course.description}
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
                      {course.rating} ({course.students})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {course.duration}
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {course.price} DT
                  </div>
                </div>

                <button className="btn-primary w-full">
                  Enroll Now
                </button>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No courses found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your filters to find more courses.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students and start your learning journey today with our expert-led courses.
          </p>
          <Link 
            href="/register" 
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <span className="text-lg font-bold text-white">TL</span>
              </div>
              <span className="text-xl font-bold">TuniLearn</span>
            </div>
            <p className="text-gray-400">
              © 2025 TuniLearn. All rights reserved. Made with ❤️ in Tunisia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
