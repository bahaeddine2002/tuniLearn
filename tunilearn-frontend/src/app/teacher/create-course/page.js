'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function CreateCoursePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    price: '',
    duration: '',
    language: 'Arabic',
    prerequisites: '',
    learningObjectives: [''],
    courseOutline: [{ title: '', duration: '', lessons: [''] }]
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const categories = [
    'Programming', 'Literature', 'Marketing', 'History', 'Languages', 
    'Business', 'Design', 'Mathematics', 'Science', 'Arts'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addLearningObjective = () => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, '']
    }));
  };

  const updateLearningObjective = (index, value) => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const removeLearningObjective = (index) => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index)
    }));
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      courseOutline: [...prev.courseOutline, { title: '', duration: '', lessons: [''] }]
    }));
  };

  const updateSection = (sectionIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      courseOutline: prev.courseOutline.map((section, i) => 
        i === sectionIndex ? { ...section, [field]: value } : section
      )
    }));
  };

  const addLesson = (sectionIndex) => {
    setFormData(prev => ({
      ...prev,
      courseOutline: prev.courseOutline.map((section, i) => 
        i === sectionIndex 
          ? { ...section, lessons: [...section.lessons, ''] }
          : section
      )
    }));
  };

  const updateLesson = (sectionIndex, lessonIndex, value) => {
    setFormData(prev => ({
      ...prev,
      courseOutline: prev.courseOutline.map((section, i) => 
        i === sectionIndex 
          ? { 
              ...section, 
              lessons: section.lessons.map((lesson, j) => j === lessonIndex ? value : lesson)
            }
          : section
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Course data:', formData);
    // TODO: Submit to API
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/teacher/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <span className="text-lg font-bold text-white">TL</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">TuniLearn</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/teacher/dashboard" className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100">
                Back to Dashboard
              </Link>
              <button className="btn-primary" form="course-form">
                Save & Publish
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Course
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Share your expertise and help students learn new skills
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i + 1 <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    i + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Step {currentStep} of {totalSteps}: {
              currentStep === 1 ? 'Basic Information' :
              currentStep === 2 ? 'Course Content' :
              currentStep === 3 ? 'Pricing & Details' :
              'Review & Publish'
            }
          </div>
        </div>

        <form id="course-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Basic Course Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Complete Web Development Bootcamp"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Course Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Describe what students will learn and why they should take this course..."
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="level" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Difficulty Level *
                    </label>
                    <select
                      id="level"
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="language" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Course Language *
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    >
                      <option value="Arabic">Arabic</option>
                      <option value="French">French</option>
                      <option value="English">English</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Total Duration
                    </label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="e.g., 12 hours"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Course Content */}
          {currentStep === 2 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Course Content & Structure
              </h2>

              {/* Learning Objectives */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Learning Objectives
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  What will students be able to do after completing this course?
                </p>
                
                <div className="space-y-3">
                  {formData.learningObjectives.map((objective, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => updateLearningObjective(index, e.target.value)}
                        className="input-field flex-1"
                        placeholder="Students will be able to..."
                      />
                      {formData.learningObjectives.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLearningObjective(index)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={addLearningObjective}
                  className="mt-4 text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  + Add Learning Objective
                </button>
              </div>

              {/* Prerequisites */}
              <div className="mb-8">
                <label htmlFor="prerequisites" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Prerequisites
                </label>
                <textarea
                  id="prerequisites"
                  name="prerequisites"
                  value={formData.prerequisites}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="What knowledge or experience should students have before taking this course?"
                ></textarea>
              </div>

              {/* Course Outline */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Course Outline
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Organize your course into sections and lessons
                </p>

                <div className="space-y-6">
                  {formData.courseOutline.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                          className="input-field"
                          placeholder="Section title"
                        />
                        <input
                          type="text"
                          value={section.duration}
                          onChange={(e) => updateSection(sectionIndex, 'duration', e.target.value)}
                          className="input-field"
                          placeholder="Duration (e.g., 2 hours)"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Lessons
                        </label>
                        {section.lessons.map((lesson, lessonIndex) => (
                          <input
                            key={lessonIndex}
                            type="text"
                            value={lesson}
                            onChange={(e) => updateLesson(sectionIndex, lessonIndex, e.target.value)}
                            className="input-field"
                            placeholder="Lesson title"
                          />
                        ))}
                        <button
                          type="button"
                          onClick={() => addLesson(sectionIndex)}
                          className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                        >
                          + Add Lesson
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addSection}
                  className="mt-4 text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  + Add Section
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Pricing & Details */}
          {currentStep === 3 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Pricing & Additional Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Course Price (DT) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="99"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Set your course price in Tunisian Dinars
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
                    Course Features
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">Lifetime access</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">Certificate of completion</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">Downloadable resources</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">Q&A support</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Course Thumbnail
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Upload course thumbnail</p>
                    <button type="button" className="text-blue-600 hover:text-blue-500 text-sm">
                      Choose file
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Publish */}
          {currentStep === 4 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Review & Publish
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Course Summary
                  </h3>
                  <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    <p><span className="font-medium">Title:</span> {formData.title || 'Not specified'}</p>
                    <p><span className="font-medium">Category:</span> {formData.category || 'Not specified'}</p>
                    <p><span className="font-medium">Level:</span> {formData.level}</p>
                    <p><span className="font-medium">Language:</span> {formData.language}</p>
                    <p><span className="font-medium">Price:</span> {formData.price || 'Not specified'} DT</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Publishing Options
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="radio" name="publish" value="draft" className="mr-3" defaultChecked />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Save as Draft</div>
                        <div className="text-sm text-gray-500">Continue working on your course later</div>
                      </div>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="publish" value="review" className="mr-3" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Submit for Review</div>
                        <div className="text-sm text-gray-500">Send to our team for approval (1-2 business days)</div>
                      </div>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="publish" value="publish" className="mr-3" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Publish Immediately</div>
                        <div className="text-sm text-gray-500">Make your course available to students right away</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary px-6 py-2"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="btn-primary px-6 py-2"
              >
                Create Course
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
