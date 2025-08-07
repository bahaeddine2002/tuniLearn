/**
 * Course Creation API Test Script
 * 
 * This script demonstrates the complete course creation flow:
 * 1. Create a course
 * 2. Add chapters to the course
 * 3. Add sections with YouTube videos or PDF uploads
 * 
 * Prerequisites:
 * - Server must be running
 * - Valid JWT token for a teacher account
 * - Subject with ID 1 must exist
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:8000/api';
const JWT_TOKEN = 'your-teacher-jwt-token-here'; // Replace with actual teacher token

// Axios instance with authentication
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${JWT_TOKEN}`,
  }
});

// Test data
const courseData = {
  title: 'Advanced Web Development with React and Node.js',
  description: 'A comprehensive course covering modern web development techniques using React for frontend and Node.js for backend development.',
  subjectId: 1, // Assumes subject with ID 1 exists
  price: 99.99,
  prerequisites: 'Basic knowledge of JavaScript, HTML, and CSS',
  learningObjectives: [
    'Build full-stack web applications',
    'Master React hooks and state management',
    'Create RESTful APIs with Node.js',
    'Implement authentication and authorization'
  ],
  features: [
    'Hands-on projects',
    'Code reviews',
    'Community access',
    'Certificate of completion'
  ]
};

const chaptersData = [
  {
    title: 'Introduction to Modern Web Development',
    order: 1
  },
  {
    title: 'React Fundamentals',
    order: 2
  },
  {
    title: 'Node.js Backend Development',
    order: 3
  },
  {
    title: 'Full-Stack Integration',
    order: 4
  }
];

const sectionsData = [
  // Chapter 1 sections
  {
    chapterIndex: 0,
    sections: [
      {
        title: 'Course Overview and Setup',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Example YouTube URL
        order: 1
      },
      {
        title: 'Development Environment Setup',
        videoUrl: 'https://youtu.be/dQw4w9WgXcQ', // Another format
        order: 2
      }
    ]
  },
  // Chapter 2 sections
  {
    chapterIndex: 1,
    sections: [
      {
        title: 'React Components and JSX',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        order: 1
      },
      {
        title: 'Course Resources and Exercises',
        // This will be a PDF upload example
        isPdf: true,
        order: 2
      }
    ]
  }
];

async function runCourseCreationTest() {
  try {
    console.log('🚀 Starting Course Creation Flow Test...\n');

    // Step 1: Create Course
    console.log('📚 Step 1: Creating Course...');
    const courseResponse = await api.post('/courses', courseData);
    const course = courseResponse.data.data;
    console.log(`✅ Course created successfully: "${course.title}" (ID: ${course.id})\n`);

    // Step 2: Add Chapters
    console.log('📖 Step 2: Adding Chapters...');
    const createdChapters = [];
    
    for (const chapterData of chaptersData) {
      const chapterResponse = await api.post(`/courses/${course.id}/chapters`, chapterData);
      const chapter = chapterResponse.data.data;
      createdChapters.push(chapter);
      console.log(`✅ Chapter added: "${chapter.title}" (ID: ${chapter.id})`);
    }
    console.log('');

    // Step 3: Add Sections
    console.log('📝 Step 3: Adding Sections...');
    
    for (const chapterSections of sectionsData) {
      const chapter = createdChapters[chapterSections.chapterIndex];
      console.log(`\n  Adding sections to chapter: "${chapter.title}"`);
      
      for (const sectionData of chapterSections.sections) {
        if (sectionData.isPdf) {
          // Example PDF upload - create a dummy PDF for testing
          console.log(`    📄 Adding PDF section: "${sectionData.title}"`);
          
          // For demo purposes, we'll skip actual PDF upload
          // In real scenario, you would create FormData and upload a PDF file
          console.log(`    ⚠️  Skipping PDF upload for demo purposes`);
          
        } else {
          // Video section
          console.log(`    🎥 Adding video section: "${sectionData.title}"`);
          
          const sectionPayload = {
            title: sectionData.title,
            chapterId: chapter.id,
            videoUrl: sectionData.videoUrl,
            order: sectionData.order
          };
          
          const sectionResponse = await api.post('/sections', sectionPayload);
          const section = sectionResponse.data.data;
          console.log(`    ✅ Video section added: "${section.title}" (ID: ${section.id})`);
        }
      }
    }

    // Step 4: Retrieve Complete Course
    console.log('\n🔍 Step 4: Retrieving Complete Course Structure...');
    const fullCourseResponse = await api.get(`/courses/${course.id}`);
    const fullCourse = fullCourseResponse.data.data;
    
    console.log('\n📋 Course Structure:');
    console.log(`Course: ${fullCourse.title}`);
    console.log(`Chapters: ${fullCourse.chapters.length}`);
    
    fullCourse.chapters.forEach((chapter, chapterIndex) => {
      console.log(`  ${chapterIndex + 1}. ${chapter.title} (${chapter.sections.length} sections)`);
      chapter.sections.forEach((section, sectionIndex) => {
        const contentType = section.videoUrl ? '🎥 Video' : section.pdfUrl ? '📄 PDF' : '❓ Unknown';
        console.log(`     ${sectionIndex + 1}. ${section.title} [${contentType}]`);
      });
    });

    console.log('\n🎉 Course Creation Flow Test Completed Successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Course ID: ${course.id}`);
    console.log(`   - Total Chapters: ${fullCourse.chapters.length}`);
    console.log(`   - Total Sections: ${fullCourse.chapters.reduce((total, ch) => total + ch.sections.length, 0)}`);

  } catch (error) {
    console.error('❌ Test Failed:', error.response?.data || error.message);
    
    if (error.response?.data?.error) {
      console.error('Error Details:', error.response.data.error);
    }
  }
}

// Helper function to test YouTube URL validation
async function testYouTubeValidation() {
  console.log('\n🎬 Testing YouTube URL Validation...\n');
  
  const testUrls = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://youtube.com/watch?v=dQw4w9WgXcQ',
    'invalid-url',
    'https://vimeo.com/123456789' // Should fail
  ];
  
  for (const url of testUrls) {
    try {
      const response = await api.post('/sections', {
        title: 'Test Section',
        chapterId: 1, // Assumes chapter with ID 1 exists
        videoUrl: url,
        order: 1
      });
      console.log(`✅ Valid: ${url}`);
    } catch (error) {
      console.log(`❌ Invalid: ${url} - ${error.response?.data?.error || error.message}`);
    }
  }
}

// Helper function to demonstrate PDF upload
async function demonstratePdfUpload() {
  console.log('\n📄 PDF Upload Demonstration...\n');
  
  // Create a dummy PDF file for testing
  const dummyPdfContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000010 00000 n \n0000000079 00000 n \n0000000173 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n253\n%%EOF';
  const tempPdfPath = path.join(__dirname, 'temp-test.pdf');
  
  try {
    // Write temporary PDF file
    fs.writeFileSync(tempPdfPath, dummyPdfContent);
    
    // Create form data
    const formData = new FormData();
    formData.append('title', 'Test PDF Section');
    formData.append('chapterId', '1'); // Assumes chapter with ID 1 exists
    formData.append('order', '1');
    formData.append('pdf', fs.createReadStream(tempPdfPath));
    
    // Upload PDF
    const response = await api.post('/sections', formData, {
      headers: formData.getHeaders()
    });
    
    console.log('✅ PDF uploaded successfully:', response.data.data.title);
    
  } catch (error) {
    console.log('❌ PDF upload failed:', error.response?.data?.error || error.message);
  } finally {
    // Clean up temporary file
    if (fs.existsSync(tempPdfPath)) {
      fs.unlinkSync(tempPdfPath);
    }
  }
}

// Main execution
if (require.main === module) {
  console.log('🧪 TuniLearn Course Creation API Test Suite\n');
  console.log('⚠️  Make sure to:');
  console.log('   1. Update JWT_TOKEN with a valid teacher token');
  console.log('   2. Ensure server is running on localhost:8000');
  console.log('   3. Have at least one subject in the database\n');
  
  // Uncomment the test you want to run:
  runCourseCreationTest();
  // testYouTubeValidation();
  // demonstratePdfUpload();
}

module.exports = {
  runCourseCreationTest,
  testYouTubeValidation,
  demonstratePdfUpload
};
