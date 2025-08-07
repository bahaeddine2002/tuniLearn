'use client';

import { useState } from 'react';
import YouTubePreview from './YouTubePreview';

export default function SectionBuilder({ sections, onUpdate }) {
  const [editingSection, setEditingSection] = useState(null);

  const addSection = () => {
    const newSection = {
      id: Date.now(), // Temporary ID for frontend
      title: '',
      contentType: '', // 'video' or 'pdf'
      videoUrl: '',
      pdfFile: null,
      pdfFileName: ''
    };
    onUpdate([...sections, newSection]);
    setEditingSection(sections.length); // Edit the new section
  };

  const updateSection = (index, field, value) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    
    // Clear other content type when one is selected
    if (field === 'contentType') {
      if (value === 'video') {
        newSections[index].pdfFile = null;
        newSections[index].pdfFileName = '';
      } else if (value === 'pdf') {
        newSections[index].videoUrl = '';
      }
    }
    
    onUpdate(newSections);
  };

  const removeSection = (index) => {
    if (confirm('Are you sure you want to delete this section?')) {
      const newSections = sections.filter((_, i) => i !== index);
      onUpdate(newSections);
      if (editingSection === index) {
        setEditingSection(null);
      } else if (editingSection > index) {
        setEditingSection(editingSection - 1);
      }
    }
  };

  const moveSection = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const newSections = [...sections];
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    onUpdate(newSections);

    // Update editing section index
    if (editingSection === index) {
      setEditingSection(newIndex);
    } else if (editingSection === newIndex) {
      setEditingSection(index);
    }
  };

  const handleVideoUrlChange = (index, url) => {
    updateSection(index, 'videoUrl', url);
  };

  const handlePdfUpload = (index, file) => {
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file');
        return;
      }
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('PDF file must be smaller than 10MB');
        return;
      }

      updateSection(index, 'pdfFile', file);
      updateSection(index, 'pdfFileName', file.name);
    }
  };

  const extractYouTubeId = (url) => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  };

  const validateYouTubeUrl = (url) => {
    return extractYouTubeId(url) !== null;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Sections</h3>
        <button
          type="button"
          onClick={addSection}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          Add Section
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No sections yet. Add your first section to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section, index) => (
            <div key={section.id} className="border border-gray-200 rounded-lg bg-gray-50">
              {/* Section Header */}
              <div className="p-3 flex items-center gap-3">
                {/* Section Order */}
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveSection(index, 'up')}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(index, 'down')}
                    disabled={index === sections.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Section Number */}
                <div className="bg-gray-600 text-white px-2 py-1 rounded text-xs font-medium">
                  {index + 1}
                </div>

                {/* Section Summary */}
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {section.title || `Section ${index + 1}`}
                  </div>
                  <div className="text-xs text-gray-500">
                    {section.contentType === 'video' && section.videoUrl && (
                      <span className="text-blue-600">🎥 Video</span>
                    )}
                    {section.contentType === 'pdf' && section.pdfFileName && (
                      <span className="text-red-600">📄 {section.pdfFileName}</span>
                    )}
                    {!section.contentType && (
                      <span className="text-gray-400">No content</span>
                    )}
                  </div>
                </div>

                {/* Section Actions */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingSection(editingSection === index ? null : index)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    {editingSection === index ? 'Collapse' : 'Edit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Section Editing Form */}
              {editingSection === index && (
                <div className="border-t border-gray-200 p-4 bg-white">
                  <div className="space-y-4">
                    {/* Section Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Section Title *
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(index, 'title', e.target.value)}
                        placeholder="Enter section title..."
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Content Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content Type *
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`contentType-${index}`}
                            value="video"
                            checked={section.contentType === 'video'}
                            onChange={(e) => updateSection(index, 'contentType', e.target.value)}
                            className="mr-2"
                          />
                          🎥 YouTube Video
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`contentType-${index}`}
                            value="pdf"
                            checked={section.contentType === 'pdf'}
                            onChange={(e) => updateSection(index, 'contentType', e.target.value)}
                            className="mr-2"
                          />
                          📄 PDF Document
                        </label>
                      </div>
                    </div>

                    {/* Video Content */}
                    {section.contentType === 'video' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            YouTube URL *
                          </label>
                          <input
                            type="url"
                            value={section.videoUrl}
                            onChange={(e) => handleVideoUrlChange(index, e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              section.videoUrl && !validateYouTubeUrl(section.videoUrl)
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-300'
                            }`}
                          />
                          {section.videoUrl && !validateYouTubeUrl(section.videoUrl) && (
                            <p className="text-red-600 text-xs mt-1">Please enter a valid YouTube URL</p>
                          )}
                        </div>
                        
                        {/* YouTube Preview */}
                        {section.videoUrl && validateYouTubeUrl(section.videoUrl) && (
                          <YouTubePreview 
                            url={section.videoUrl} 
                            videoId={extractYouTubeId(section.videoUrl)} 
                          />
                        )}
                      </div>
                    )}

                    {/* PDF Content */}
                    {section.contentType === 'pdf' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PDF Document *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                          {section.pdfFile ? (
                            <div className="space-y-2">
                              <div className="text-green-600">
                                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <p className="text-sm text-gray-900">📄 {section.pdfFileName}</p>
                              <p className="text-xs text-gray-500">{(section.pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                              <button
                                type="button"
                                onClick={() => {
                                  updateSection(index, 'pdfFile', null);
                                  updateSection(index, 'pdfFileName', '');
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
                                <label htmlFor={`pdf-${index}`} className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                                  Upload PDF file
                                </label>
                                <p className="text-xs mt-1">Maximum 10MB</p>
                              </div>
                            </div>
                          )}
                          <input
                            type="file"
                            id={`pdf-${index}`}
                            accept=".pdf"
                            onChange={(e) => handlePdfUpload(index, e.target.files[0])}
                            className="hidden"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
