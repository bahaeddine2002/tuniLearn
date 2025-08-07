'use client';

export default function ReviewSubmit({ courseData, subjects, onSubmit, onPrev, isSubmitting }) {
  const selectedSubject = subjects.find(s => s.id === parseInt(courseData.subjectId));
  
  const totalSections = courseData.chapters.reduce((total, chapter) => total + chapter.sections.length, 0);
  const totalVideos = courseData.chapters.reduce((total, chapter) => 
    total + chapter.sections.filter(section => section.contentType === 'video').length, 0
  );
  const totalPdfs = courseData.chapters.reduce((total, chapter) => 
    total + chapter.sections.filter(section => section.contentType === 'pdf').length, 0
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Review Your Course</h2>
        <p className="text-gray-600">Please review all details before publishing your course.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Overview */}
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">Course Overview</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-blue-800">Subject:</span>
                <span className="ml-2 text-blue-700">{selectedSubject?.name}</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Title:</span>
                <span className="ml-2 text-blue-700">{courseData.title}</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Price:</span>
                <span className="ml-2 text-blue-700">{courseData.price} TND</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Chapters:</span>
                <span className="ml-2 text-blue-700">{courseData.chapters.length}</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Total Sections:</span>
                <span className="ml-2 text-blue-700">{totalSections}</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Content:</span>
                <span className="ml-2 text-blue-700">{totalVideos} videos, {totalPdfs} PDFs</span>
              </div>
            </div>
          </div>

          {/* Course Description */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 text-sm">{courseData.description}</p>
          </div>

          {/* Prerequisites */}
          {courseData.prerequisites && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Prerequisites</h3>
              <p className="text-gray-700 text-sm">{courseData.prerequisites}</p>
            </div>
          )}

          {/* Learning Objectives */}
          {courseData.learningObjectives.some(obj => obj.trim()) && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Learning Objectives</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {courseData.learningObjectives.filter(obj => obj.trim()).map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Features */}
          {courseData.features.some(feature => feature.trim()) && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Course Features</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {courseData.features.filter(feature => feature.trim()).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Course Structure */}
        <div className="space-y-4">
          {/* Thumbnail */}
          {courseData.thumbnail && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Course Thumbnail</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(courseData.thumbnail)}
                alt="Course thumbnail"
                className="w-full h-32 object-cover rounded border"
              />
            </div>
          )}

          {/* Course Structure */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Course Structure</h3>
            <div className="space-y-3">
              {courseData.chapters.map((chapter, chapterIndex) => (
                <div key={chapter.id} className="border border-gray-300 rounded bg-white">
                  <div className="p-3 bg-gray-100 border-b border-gray-300">
                    <div className="font-medium text-sm text-gray-900">
                      Chapter {chapterIndex + 1}: {chapter.title}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {chapter.sections.length} section{chapter.sections.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    {chapter.sections.map((section, sectionIndex) => (
                      <div key={section.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">{sectionIndex + 1}.</span>
                          <span className="text-gray-900">{section.title}</span>
                        </div>
                        <div className="flex items-center">
                          {section.contentType === 'video' ? (
                            <span className="text-blue-600 text-xs">🎥 Video</span>
                          ) : (
                            <span className="text-red-600 text-xs">📄 PDF</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="font-medium text-yellow-800">Important Notes</h3>
            <div className="mt-2 text-sm text-yellow-700 space-y-1">
              <p>• Your course will be submitted for admin review before being published.</p>
              <p>• Make sure all video links are accessible and PDFs are properly uploaded.</p>
              <p>• You can edit your course after submission, but changes will require re-approval.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button
          onClick={onPrev}
          disabled={isSubmitting}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Back to Chapters
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Course...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Publish Course
            </>
          )}
        </button>
      </div>
    </div>
  );
}
