'use client';

import { useState } from 'react';
import SectionBuilder from './SectionBuilder';

export default function ChapterBuilder({ chapters, onUpdate, onNext, onPrev }) {
  const [expandedChapter, setExpandedChapter] = useState(null);

  const addChapter = () => {
    const newChapter = {
      id: Date.now(), // Temporary ID for frontend
      title: '',
      sections: []
    };
    onUpdate([...chapters, newChapter]);
    setExpandedChapter(chapters.length); // Expand the new chapter
  };

  const updateChapter = (index, field, value) => {
    const newChapters = [...chapters];
    newChapters[index] = { ...newChapters[index], [field]: value };
    onUpdate(newChapters);
  };

  const removeChapter = (index) => {
    if (confirm('Are you sure you want to delete this chapter? All sections will be lost.')) {
      const newChapters = chapters.filter((_, i) => i !== index);
      onUpdate(newChapters);
      if (expandedChapter === index) {
        setExpandedChapter(null);
      } else if (expandedChapter > index) {
        setExpandedChapter(expandedChapter - 1);
      }
    }
  };

  const moveChapter = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= chapters.length) return;

    const newChapters = [...chapters];
    [newChapters[index], newChapters[newIndex]] = [newChapters[newIndex], newChapters[index]];
    onUpdate(newChapters);

    // Update expanded chapter index
    if (expandedChapter === index) {
      setExpandedChapter(newIndex);
    } else if (expandedChapter === newIndex) {
      setExpandedChapter(index);
    }
  };

  const updateSections = (chapterIndex, sections) => {
    updateChapter(chapterIndex, 'sections', sections);
  };

  const canProceed = chapters.length > 0 && 
                    chapters.every(chapter => 
                      chapter.title.trim() && 
                      chapter.sections.length > 0 &&
                      chapter.sections.every(section => 
                        section.title.trim() && 
                        section.contentType &&
                        (section.videoUrl || section.pdfFile)
                      )
                    );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Build Course Structure</h2>
        <p className="text-gray-600">Create chapters and add sections with videos or PDF resources.</p>
      </div>

      {/* Chapters List */}
      <div className="space-y-4">
        {chapters.map((chapter, chapterIndex) => (
          <div key={chapter.id} className="border border-gray-200 rounded-lg bg-white">
            {/* Chapter Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-4">
                {/* Chapter Order */}
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveChapter(chapterIndex, 'up')}
                    disabled={chapterIndex === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveChapter(chapterIndex, 'down')}
                    disabled={chapterIndex === chapters.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Chapter Number */}
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Chapter {chapterIndex + 1}
                </div>

                {/* Chapter Title Input */}
                <input
                  type="text"
                  value={chapter.title}
                  onChange={(e) => updateChapter(chapterIndex, 'title', e.target.value)}
                  placeholder="Chapter title..."
                  className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                {/* Chapter Actions */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedChapter(expandedChapter === chapterIndex ? null : chapterIndex)}
                    className="text-blue-600 hover:text-blue-700 p-1"
                  >
                    <svg className={`w-5 h-5 transition-transform ${expandedChapter === chapterIndex ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeChapter(chapterIndex)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Chapter Summary */}
              <div className="mt-2 text-sm text-gray-600">
                {chapter.sections.length} section{chapter.sections.length !== 1 ? 's' : ''}
                {chapter.sections.length > 0 && (
                  <span className="ml-2">
                    ({chapter.sections.filter(s => s.videoUrl).length} video{chapter.sections.filter(s => s.videoUrl).length !== 1 ? 's' : ''}, {chapter.sections.filter(s => s.pdfFile).length} PDF{chapter.sections.filter(s => s.pdfFile).length !== 1 ? 's' : ''})
                  </span>
                )}
              </div>
            </div>

            {/* Chapter Content */}
            {expandedChapter === chapterIndex && (
              <div className="p-4">
                <SectionBuilder
                  sections={chapter.sections}
                  onUpdate={(sections) => updateSections(chapterIndex, sections)}
                />
              </div>
            )}
          </div>
        ))}

        {/* Add Chapter Button */}
        <button
          type="button"
          onClick={addChapter}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 text-gray-600 hover:text-gray-700 transition-colors"
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Chapter
          </div>
        </button>
      </div>

      {/* Validation Messages */}
      {chapters.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-yellow-800">Please add at least one chapter to your course.</p>
          </div>
        </div>
      )}

      {chapters.some(chapter => !chapter.title.trim()) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800">All chapters must have a title.</p>
          </div>
        </div>
      )}

      {chapters.some(chapter => chapter.sections.length === 0) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800">All chapters must have at least one section.</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button
          onClick={onPrev}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 font-medium"
        >
          Back to Course Info
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}
