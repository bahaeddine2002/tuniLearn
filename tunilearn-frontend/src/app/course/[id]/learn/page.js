'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export default function CourseLearnPage({ params }) {
  const { user } = useAuth();
  const [activeChapter, setActiveChapter] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set([0, 1, 2, 8, 9, 10, 11, 12, 13, 14, 15])); // Mock completed lessons

  // Mock course data based on SRS requirements
  const courseData = {
    id: 1,
    title: 'Complete Web Development',
    instructor: 'Sarah Johnson',
    rating: 4.8,
    totalStudents: 2547,
    progress: 65,
    chapters: [
      {
        id: 0,
        title: 'HTML Fundamentals',
        duration: '3 hours',
        lessons: [
          {
            id: 0,
            title: 'Introduction to HTML',
            duration: '15 min',
            type: 'video',
            videoUrl: 'https://example.com/video1.mp4',
            pdfUrl: null,
            isCompleted: true
          },
          {
            id: 1,
            title: 'HTML Structure & Elements',
            duration: '25 min',
            type: 'video',
            videoUrl: 'https://example.com/video2.mp4',
            pdfUrl: '/pdfs/html-elements.pdf',
            isCompleted: true
          },
          {
            id: 2,
            title: 'Forms & Input Elements',
            duration: '30 min',
            type: 'video',
            videoUrl: 'https://example.com/video3.mp4',
            pdfUrl: '/pdfs/html-forms.pdf',
            isCompleted: true
          },
          {
            id: 3,
            title: 'HTML Exercise - Build a Portfolio',
            duration: '45 min',
            type: 'exercise',
            videoUrl: null,
            pdfUrl: '/exercises/html-portfolio.pdf',
            solutionUrl: '/solutions/html-portfolio-solution.pdf',
            isCompleted: false
          }
        ]
      },
      {
        id: 1,
        title: 'CSS & Styling',
        duration: '4 hours',
        lessons: [
          {
            id: 8,
            title: 'CSS Basics & Selectors',
            duration: '20 min',
            type: 'video',
            videoUrl: 'https://example.com/video4.mp4',
            pdfUrl: '/pdfs/css-basics.pdf',
            isCompleted: true
          },
          {
            id: 9,
            title: 'Layout with Flexbox',
            duration: '35 min',
            type: 'video',
            videoUrl: 'https://example.com/video5.mp4',
            pdfUrl: '/pdfs/flexbox-guide.pdf',
            isCompleted: true
          },
          {
            id: 10,
            title: 'CSS Grid System',
            duration: '40 min',
            type: 'video',
            videoUrl: 'https://example.com/video6.mp4',
            pdfUrl: '/pdfs/css-grid.pdf',
            isCompleted: true
          },
          {
            id: 11,
            title: 'Responsive Design',
            duration: '30 min',
            type: 'video',
            videoUrl: 'https://example.com/video7.mp4',
            pdfUrl: '/pdfs/responsive-design.pdf',
            isCompleted: true
          },
          {
            id: 12,
            title: 'CSS Exercise - Responsive Layout',
            duration: '60 min',
            type: 'exercise',
            videoUrl: null,
            pdfUrl: '/exercises/responsive-layout.pdf',
            solutionUrl: '/solutions/responsive-layout-solution.mp4', // Video solution
            isCompleted: true
          }
        ]
      },
      {
        id: 2,
        title: 'JavaScript Fundamentals',
        duration: '6 hours',
        lessons: [
          {
            id: 13,
            title: 'JavaScript Introduction',
            duration: '25 min',
            type: 'video',
            videoUrl: 'https://example.com/video8.mp4',
            pdfUrl: '/pdfs/js-intro.pdf',
            isCompleted: true
          },
          {
            id: 14,
            title: 'Variables & Data Types',
            duration: '30 min',
            type: 'video',
            videoUrl: 'https://example.com/video9.mp4',
            pdfUrl: '/pdfs/js-variables.pdf',
            isCompleted: true
          },
          {
            id: 15,
            title: 'Functions & Scope',
            duration: '45 min',
            type: 'video',
            videoUrl: 'https://example.com/video10.mp4',
            pdfUrl: '/pdfs/js-functions.pdf',
            isCompleted: true
          },
          {
            id: 16,
            title: 'DOM Manipulation',
            duration: '50 min',
            type: 'video',
            videoUrl: 'https://example.com/video11.mp4',
            pdfUrl: '/pdfs/dom-manipulation.pdf',
            isCompleted: false
          },
          {
            id: 17,
            title: 'JavaScript Exercise - Interactive Calculator',
            duration: '90 min',
            type: 'exercise',
            videoUrl: null,
            pdfUrl: '/exercises/js-calculator.pdf',
            solutionUrl: '/solutions/js-calculator-solution.pdf',
            isCompleted: false
          }
        ]
      },
      {
        id: 3,
        title: 'React Framework',
        duration: '5 hours',
        lessons: [
          {
            id: 18,
            title: 'React Introduction & Setup',
            duration: '30 min',
            type: 'video',
            videoUrl: 'https://example.com/video12.mp4',
            pdfUrl: '/pdfs/react-intro.pdf',
            isCompleted: false
          },
          {
            id: 19,
            title: 'Components & JSX',
            duration: '40 min',
            type: 'video',
            videoUrl: 'https://example.com/video13.mp4',
            pdfUrl: '/pdfs/react-components.pdf',
            isCompleted: false
          },
          {
            id: 20,
            title: 'State & Props',
            duration: '45 min',
            type: 'video',
            videoUrl: 'https://example.com/video14.mp4',
            pdfUrl: '/pdfs/react-state-props.pdf',
            isCompleted: false
          }
        ]
      }
    ]
  };

  const currentChapter = courseData.chapters[activeChapter];
  const currentLesson = currentChapter?.lessons[activeLesson];

  const markLessonComplete = (lessonId) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
  };

  const downloadPDF = (url, filename) => {
    // Simulate PDF download
    console.log(`Downloading PDF: ${filename} from ${url}`);
    alert(`Downloading: ${filename}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/student/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-white">TL</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">TuniLearn</span>
              </Link>
              <span className="text-gray-400">|</span>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {courseData.title}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Progress: {courseData.progress}%
              </div>
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                  style={{ width: `${courseData.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar - Course Content */}
        <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Course Content
            </h2>
            
            <div className="space-y-2">
              {courseData.chapters.map((chapter, chapterIndex) => (
                <div key={chapter.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                  <button
                    onClick={() => {
                      setActiveChapter(chapterIndex);
                      setActiveLesson(0);
                    }}
                    className={`w-full text-left p-3 flex items-center justify-between ${
                      activeChapter === chapterIndex 
                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {chapter.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {chapter.lessons.length} lessons • {chapter.duration}
                      </div>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        activeChapter === chapterIndex ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {activeChapter === chapterIndex && (
                    <div className="border-t border-gray-200 dark:border-gray-700">
                      {chapter.lessons.map((lesson, lessonIndex) => (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLesson(lessonIndex)}
                          className={`w-full text-left p-3 pl-6 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                            activeLesson === lessonIndex 
                              ? 'bg-gray-50 dark:bg-gray-800 border-r-2 border-blue-500' 
                              : ''
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            completedLessons.has(lesson.id)
                              ? 'bg-green-500 text-white'
                              : lesson.type === 'exercise'
                              ? 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300'
                              : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                          }`}>
                            {completedLessons.has(lesson.id) ? (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : lesson.type === 'exercise' ? (
                              '📝'
                            ) : (
                              '▶'
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {lesson.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {lesson.duration}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {currentLesson ? (
            <>
              {/* Lesson Header */}
              <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {currentLesson.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <span>{currentChapter.title}</span>
                      <span>•</span>
                      <span>{currentLesson.duration}</span>
                      <span>•</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        currentLesson.type === 'exercise' 
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {currentLesson.type === 'exercise' ? 'Exercise' : 'Video Lesson'}
                      </span>
                    </div>
                  </div>
                  
                  {!completedLessons.has(currentLesson.id) && (
                    <button
                      onClick={() => markLessonComplete(currentLesson.id)}
                      className="btn-primary"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>

              {/* Video/Content Area */}
              <div className="flex-1 p-6">
                {currentLesson.type === 'video' && currentLesson.videoUrl ? (
                  <div className="bg-black rounded-lg aspect-video mb-6 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-4xl mb-4">📹</div>
                      <div className="text-lg mb-2">Video Player</div>
                      <div className="text-sm text-gray-300">
                        {currentLesson.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        URL: {currentLesson.videoUrl}
                      </div>
                    </div>
                  </div>
                ) : currentLesson.type === 'exercise' ? (
                  <div className="bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 rounded-lg p-6 mb-6">
                    <div className="flex items-center mb-4">
                      <div className="text-3xl mr-4">📝</div>
                      <div>
                        <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-200">
                          Practice Exercise
                        </h4>
                        <p className="text-orange-700 dark:text-orange-300">
                          Download the exercise materials and complete the tasks
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Downloadable Materials */}
                <div className="space-y-4">
                  {currentLesson.pdfUrl && (
                    <div className="card">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                            <span className="text-red-600 dark:text-red-300">📄</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {currentLesson.type === 'exercise' ? 'Exercise Instructions' : 'Lesson Notes'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              PDF Document
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => downloadPDF(currentLesson.pdfUrl, `${currentLesson.title}.pdf`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  )}

                  {currentLesson.solutionUrl && (
                    <div className="card">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 dark:text-green-300">
                              {currentLesson.solutionUrl.includes('.mp4') ? '🎥' : '📄'}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              Exercise Solution
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {currentLesson.solutionUrl.includes('.mp4') ? 'Video Solution' : 'PDF Solution'}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => downloadPDF(currentLesson.solutionUrl, `${currentLesson.title}-solution`)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                          {currentLesson.solutionUrl.includes('.mp4') ? 'Watch Solution' : 'Download'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => {
                      if (activeLesson > 0) {
                        setActiveLesson(activeLesson - 1);
                      } else if (activeChapter > 0) {
                        setActiveChapter(activeChapter - 1);
                        setActiveLesson(courseData.chapters[activeChapter - 1].lessons.length - 1);
                      }
                    }}
                    disabled={activeChapter === 0 && activeLesson === 0}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={() => {
                      const nextLessonIndex = activeLesson + 1;
                      if (nextLessonIndex < currentChapter.lessons.length) {
                        setActiveLesson(nextLessonIndex);
                      } else if (activeChapter + 1 < courseData.chapters.length) {
                        setActiveChapter(activeChapter + 1);
                        setActiveLesson(0);
                      }
                    }}
                    disabled={
                      activeChapter === courseData.chapters.length - 1 && 
                      activeLesson === currentChapter.lessons.length - 1
                    }
                    className="flex items-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Next</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-4">📚</div>
                <div className="text-lg">Select a lesson to start learning</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
