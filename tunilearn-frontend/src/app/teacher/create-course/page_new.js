'use client';

import MultiStepCourseCreator from './MultiStepCourseCreator';

export default function CreateCoursePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Course</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Follow the steps below to create and publish your course
          </p>
        </div>
        <MultiStepCourseCreator />
      </div>
    </div>
  );
}
