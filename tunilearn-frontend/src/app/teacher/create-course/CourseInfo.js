'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function CourseInfo({ courseData, onUpdate, onNext, onPrev }) {
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const handleInputChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...courseData[field]];
    newArray[index] = value;
    onUpdate({ [field]: newArray });
  };

  const addArrayItem = (field) => {
    onUpdate({ [field]: [...courseData[field], ''] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = courseData[field].filter((_, i) => i !== index);
    onUpdate({ [field]: newArray });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be smaller than 5MB');
        return;
      }

      onUpdate({ thumbnail: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setThumbnailPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const canProceed = courseData.title && courseData.description && courseData.price;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Information</h2>
        <p className="text-gray-600">Provide basic details about your course.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Course Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Course Title *
            </label>
            <input
              type="text"
              id="title"
              value={courseData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Complete React Development Course"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Course Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Course Description *
            </label>
            <textarea
              id="description"
              rows={4}
              value={courseData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what students will learn in this course..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Course Price (TND) *
            </label>
            <input
              type="number"
              id="price"
              min="0"
              step="0.01"
              value={courseData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="99.99"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Prerequisites */}
          <div>
            <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700 mb-2">
              Prerequisites
            </label>
            <textarea
              id="prerequisites"
              rows={3}
              value={courseData.prerequisites}
              onChange={(e) => handleInputChange('prerequisites', e.target.value)}
              placeholder="What should students know before taking this course?"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Thumbnail Upload */}
          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
              Course Thumbnail
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              {thumbnailPreview ? (
                <div className="space-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-32 object-cover rounded-lg mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnailPreview(null);
                      onUpdate({ thumbnail: null });
                    }}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-gray-400">
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600">
                    <label htmlFor="thumbnail" className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                      Upload an image
                    </label>
                    <p className="text-xs mt-1">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>
              )}
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Learning Objectives */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learning Objectives
            </label>
            <div className="space-y-2">
              {courseData.learningObjectives.map((objective, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => handleArrayChange('learningObjectives', index, e.target.value)}
                    placeholder={`Learning objective ${index + 1}`}
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {courseData.learningObjectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('learningObjectives', index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('learningObjectives')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Learning Objective
              </button>
            </div>
          </div>

          {/* Course Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Features
            </label>
            <div className="space-y-2">
              {courseData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleArrayChange('features', index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {courseData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('features', index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('features')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Feature
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button
          onClick={onPrev}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 font-medium"
        >
          Back to Subject
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Continue to Chapters
        </button>
      </div>
    </div>
  );
}
