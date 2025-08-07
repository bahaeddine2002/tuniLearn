'use client';

import { useState } from 'react';
import { createSubject } from '../../../services/crudService';

export default function SubjectSelection({ 
  subjects, 
  selectedSubjectId, 
  onSubjectSelect, 
  onNext,
  onLoadSubjects 
}) {
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubjectChange = (e) => {
    const subjectId = e.target.value;
    onSubjectSelect(subjectId);
    // Clear messages when user selects a subject
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    setIsCreating(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const response = await createSubject({ name: newSubjectName.trim() });
      await onLoadSubjects(); // Reload subjects
      
      // Auto-select the newly created subject
      const newSubject = response.data;
      onSubjectSelect(newSubject.id.toString());
      
      setSuccessMessage(`Subject "${newSubject.name}" created and selected successfully!`);
      setNewSubjectName('');
      setShowAddSubject(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to create subject:', error);
      const errorMsg = error.response?.data?.error || 'Failed to create subject. Please try again.';
      setErrorMessage(errorMsg);
    } finally {
      setIsCreating(false);
    }
  };

  const canProceed = selectedSubjectId !== '';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Choose Course Subject</h2>
        <p className="text-gray-600">Select the subject category for your course.</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-700 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700 font-medium">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Subject Selection */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject Category *
          </label>
          <select
            id="subject"
            value={selectedSubjectId}
            onChange={handleSubjectChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a subject...</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add New Subject */}
        <div>
          {!showAddSubject ? (
            <button
              type="button"
              onClick={() => {
                setShowAddSubject(true);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Subject
            </button>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <form onSubmit={handleAddSubject} className="space-y-3">
                <div>
                  <label htmlFor="newSubject" className="block text-sm font-medium text-gray-700 mb-1">
                    New Subject Name
                  </label>
                  <input
                    type="text"
                    id="newSubject"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    placeholder="e.g., Web Development, Data Science, Mathematics"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isCreating || !newSubjectName.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-1"
                  >
                    {isCreating ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating...
                      </>
                    ) : (
                      'Create Subject'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddSubject(false);
                      setNewSubjectName('');
                      setErrorMessage('');
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Subject Preview */}
      {selectedSubjectId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-1">Selected Subject</h3>
          <p className="text-blue-700">
            {subjects.find(s => s.id === parseInt(selectedSubjectId))?.name}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Continue to Course Info
        </button>
      </div>
    </div>
  );
}
