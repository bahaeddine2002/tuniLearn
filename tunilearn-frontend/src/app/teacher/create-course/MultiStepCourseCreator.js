'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { getSubjects, createCourse, createChapter, createSection } from '../../../services/crudService';
import StepIndicator from './StepIndicator';
import SubjectSelection from './SubjectSelection';
import CourseInfo from './CourseInfo';
import ChapterBuilder from './ChapterBuilder';
import ReviewSubmit from './ReviewSubmit';

const STEPS = [
  { id: 1, title: 'Subject', description: 'Choose course subject' },
  { id: 2, title: 'Course Info', description: 'Basic course details' },
  { id: 3, title: 'Chapters', description: 'Build course structure' },
  { id: 4, title: 'Review', description: 'Review and publish' }
];

export default function MultiStepCourseCreator() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjects, setSubjects] = useState([]);

  // Course state
  const [courseData, setCourseData] = useState({
    subjectId: '',
    title: '',
    description: '',
    price: '',
    prerequisites: '',
    learningObjectives: [''],
    features: [''],
    thumbnail: null,
    chapters: []
  });

  // Load subjects on component mount
  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const response = await getSubjects();
      setSubjects(response.data || []);
    } catch (error) {
      console.error('Failed to load subjects:', error);
      setSubjects([]);
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateCourseData = (data) => {
    setCourseData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    if (!validateCourseData()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare form data for submission
      const formData = new FormData();
      
      // Basic course info
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('subjectId', courseData.subjectId);
      formData.append('price', courseData.price);
      formData.append('prerequisites', courseData.prerequisites);
      formData.append('learningObjectives', JSON.stringify(courseData.learningObjectives.filter(obj => obj.trim())));
      formData.append('features', JSON.stringify(courseData.features.filter(feature => feature.trim())));
      
      // Thumbnail
      if (courseData.thumbnail) {
        formData.append('thumbnail', courseData.thumbnail);
      }

      // Create course first
      const courseResponse = await createCourse(formData);
      const course = courseResponse.data.data;

      // Create chapters and sections
      await createChaptersAndSections(course.id);

      // Redirect to course management or dashboard
      router.push(`/teacher/courses/${course.id}`);
      
    } catch (error) {
      console.error('Course creation failed:', error);
      alert('Failed to create course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const createChaptersAndSections = async (courseId) => {
    for (const [chapterIndex, chapter] of courseData.chapters.entries()) {
      try {
        // Create chapter using crudService
        const chapterData = {
          title: chapter.title,
          order: chapterIndex + 1
        };
        
        const chapterResponse = await createChapter(courseId, chapterData);
        const createdChapter = chapterResponse.data?.data || chapterResponse.data;

        // Create sections for this chapter
        for (const [sectionIndex, section] of chapter.sections.entries()) {
          await createSectionForChapter(createdChapter.id, section, sectionIndex + 1);
        }

      } catch (error) {
        console.error(`Error creating chapter ${chapter.title}:`, error);
        throw error;
      }
    }
  };

  const createSectionForChapter = async (chapterId, section, order) => {
    try {
      if (section.contentType === 'video' && section.videoUrl) {
        // Create video section
        const sectionData = {
          title: section.title,
          videoUrl: section.videoUrl,
          order: order
        };
        
        await createSection(chapterId, sectionData);

      } else if (section.contentType === 'pdf' && section.pdfFile) {
        // Create PDF section
        const formData = new FormData();
        formData.append('title', section.title);
        formData.append('order', order);
        formData.append('pdf', section.pdfFile);

        await createSection(chapterId, formData);
      }

    } catch (error) {
      console.error(`Error creating section ${section.title}:`, error);
      throw error;
    }
  };

  const validateCourseData = () => {
    if (!courseData.subjectId) {
      alert('Please select a subject');
      setCurrentStep(1);
      return false;
    }
    
    if (!courseData.title || !courseData.description || !courseData.price) {
      alert('Please fill in all required course information');
      setCurrentStep(2);
      return false;
    }
    
    if (courseData.chapters.length === 0) {
      alert('Please add at least one chapter');
      setCurrentStep(3);
      return false;
    }
    
    // Validate chapters have sections
    for (const chapter of courseData.chapters) {
      if (chapter.sections.length === 0) {
        alert(`Chapter "${chapter.title}" must have at least one section`);
        setCurrentStep(3);
        return false;
      }
      
      // Validate sections have content
      for (const section of chapter.sections) {
        if (!section.title || 
            (!section.videoUrl && !section.pdfFile) ||
            !section.contentType) {
          alert(`Please complete all sections in chapter "${chapter.title}"`);
          setCurrentStep(3);
          return false;
        }
      }
    }
    
    return true;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <SubjectSelection
            subjects={subjects}
            selectedSubjectId={courseData.subjectId}
            onSubjectSelect={(subjectId) => updateCourseData({ subjectId })}
            onNext={nextStep}
            onLoadSubjects={loadSubjects}
          />
        );
      case 2:
        return (
          <CourseInfo
            courseData={courseData}
            onUpdate={updateCourseData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <ChapterBuilder
            chapters={courseData.chapters}
            onUpdate={(chapters) => updateCourseData({ chapters })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <ReviewSubmit
            courseData={courseData}
            subjects={subjects}
            onSubmit={handleSubmit}
            onPrev={prevStep}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  if (!user || user.role !== 'TEACHER') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Only teachers can create courses.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
            <p className="text-gray-600 mt-1">Build your course step by step</p>
          </div>

          {/* Step Indicator */}
          <div className="px-6 py-4 border-b border-gray-200">
            <StepIndicator steps={STEPS} currentStep={currentStep} />
          </div>

          {/* Step Content */}
          <div className="p-6">
            {renderStepContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
