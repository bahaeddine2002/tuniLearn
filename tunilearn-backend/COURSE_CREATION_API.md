# TuniLearn Course Creation API Documentation

## Overview

This documentation covers the comprehensive course creation flow for TuniLearn, a course marketplace platform. The system implements a modular structure: **Subjects → Courses → Chapters → Sections**, where each section can contain either a YouTube video or a PDF file.

## Architecture

### Data Flow
```
Subject (Programming, Design, etc.)
  └── Course (React Fundamentals)
      └── Chapter (Getting Started)
          └── Section (Introduction Video | PDF Resource)
```

### Technology Stack
- **Backend**: Express.js 5.1.0 + Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT + Passport.js (Google OAuth)
- **File Upload**: Multer with validation
- **Validation**: Custom validation utilities

## Authentication & Authorization

### Required Headers
```javascript
Authorization: Bearer <jwt_token>
```

### Role-Based Access
- **TEACHER**: Can create, update, delete their own courses
- **ADMIN**: Full access to all courses
- **STUDENT**: Read-only access to approved courses

## API Endpoints

### Course Management

#### Create Course
```http
POST /api/courses
Content-Type: multipart/form-data
Authorization: Bearer <teacher_token>
```

**Form Data:**
```javascript
{
  title: "Advanced React Development",
  description: "Comprehensive React course...",
  subjectId: 1,
  price: 99.99,
  prerequisites: "Basic JavaScript knowledge",
  learningObjectives: ["Build React apps", "Master hooks"],
  features: ["Projects", "Code reviews"],
  thumbnail: <file>, // Optional image file
  resources: [<file1>, <file2>] // Optional resource files
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "id": 1,
    "title": "Advanced React Development",
    "description": "Comprehensive React course...",
    "price": 99.99,
    "approved": false,
    "teacher": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### Get Courses
```http
GET /api/courses?teacherId=1&approved=true&my=true
```

**Query Parameters:**
- `teacherId`: Filter by teacher ID
- `approved`: Filter by approval status (true/false/all)
- `my`: For teachers, show only their courses

#### Get Course with Full Structure
```http
GET /api/courses/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Advanced React Development",
    "chapters": [
      {
        "id": 1,
        "title": "Getting Started",
        "order": 1,
        "sections": [
          {
            "id": 1,
            "title": "Introduction",
            "videoUrl": "dQw4w9WgXcQ",
            "pdfUrl": null,
            "order": 1
          }
        ]
      }
    ]
  }
}
```

### Chapter Management

#### Add Chapter to Course
```http
POST /api/courses/:courseId/chapters
Content-Type: application/json
Authorization: Bearer <teacher_token>
```

**Body:**
```json
{
  "title": "Advanced Concepts",
  "order": 2
}
```

#### Get Chapters
```http
GET /api/chapters?courseId=1
```

#### Update Chapter
```http
PUT /api/chapters/:id
Authorization: Bearer <teacher_token>
```

### Section Management

#### Create Section with Video
```http
POST /api/sections
Content-Type: application/json
Authorization: Bearer <teacher_token>
```

**Body:**
```json
{
  "title": "Introduction to React",
  "chapterId": 1,
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "order": 1
}
```

#### Create Section with PDF
```http
POST /api/sections
Content-Type: multipart/form-data
Authorization: Bearer <teacher_token>
```

**Form Data:**
```javascript
{
  title: "Course Resources",
  chapterId: 1,
  order: 2,
  pdf: <file> // PDF file (max 10MB)
}
```

#### Upload PDF Only
```http
POST /api/sections/upload-pdf
Content-Type: multipart/form-data
Authorization: Bearer <teacher_token>
```

## Validation Rules

### Course Validation
- **Title**: Minimum 3 characters
- **Description**: Minimum 10 characters
- **Price**: Non-negative number
- **Subject**: Must exist in database
- **Teacher**: Must have TEACHER role

### YouTube URL Validation
Supported formats:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://youtube.com/watch?v=VIDEO_ID`

**Video ID**: Extracted and stored as 11-character string

### PDF Upload Validation
- **File Type**: Only `.pdf` files
- **MIME Type**: Must be `application/pdf`
- **Size Limit**: Maximum 10MB
- **Storage**: Files saved to `/uploads/resources/`

### Section Content Rules
- **Exclusive**: Must have either video URL **OR** PDF file, never both
- **Required**: Must have at least one content type
- **Unique Titles**: No duplicate section names within same chapter

## Error Handling

### Common Error Responses
```json
{
  "success": false,
  "error": "Validation failed: Course title must be at least 3 characters long"
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (no token)
- `403`: Forbidden (wrong role/ownership)
- `404`: Not Found
- `500`: Internal Server Error

## File Upload Details

### Multer Configuration

#### Course Creation
```javascript
// Accepts thumbnail + resources
upload.fields([
  { name: 'thumbnail', maxCount: 1 },    // Images: 5MB
  { name: 'resources', maxCount: 10 }    // PDF/Images: 10MB each
])
```

#### PDF Sections
```javascript
// Single PDF upload
upload.single('pdf') // 10MB limit, PDF only
```

### File Storage Structure
```
uploads/
├── thumb-1234567890-123456789.jpg     # Course thumbnails
├── resource-1234567890-123456789.pdf   # Course resources
└── resources/
    ├── pdf-1234567890-123456789.pdf    # Section PDFs
    └── pdf-1234567890-987654321.pdf
```

## Security Features

### Authentication Middleware
- JWT token validation
- Profile completion check
- Role-based authorization

### File Upload Security
- MIME type validation
- File extension checking
- Size limits enforcement
- Secure filename generation

### Data Validation
- Input sanitization
- SQL injection prevention (Prisma)
- XSS protection

## Usage Examples

### Complete Course Creation Flow

```javascript
// 1. Create Course
const course = await axios.post('/api/courses', courseData);

// 2. Add Chapter
const chapter = await axios.post(`/api/courses/${course.id}/chapters`, {
  title: "Getting Started",
  order: 1
});

// 3. Add Video Section
await axios.post('/api/sections', {
  title: "Introduction",
  chapterId: chapter.id,
  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  order: 1
});

// 4. Add PDF Section
const formData = new FormData();
formData.append('title', 'Resources');
formData.append('chapterId', chapter.id);
formData.append('order', 2);
formData.append('pdf', pdfFile);

await axios.post('/api/sections', formData, {
  headers: formData.getHeaders()
});
```

### Frontend Integration

#### YouTube Video Embedding
```javascript
// Stored in DB: "dQw4w9WgXcQ"
// Frontend renders:
const embedUrl = `https://www.youtube-nocookie.com/embed/${section.videoUrl}?rel=0&modestbranding=1`;

<iframe 
  src={embedUrl}
  width="560" 
  height="315"
  frameBorder="0"
  allowFullScreen
/>
```

#### PDF Display
```javascript
// Stored in DB: "/uploads/resources/pdf-123456789.pdf"
// Frontend renders:
<a href={`${API_BASE_URL}${section.pdfUrl}`} target="_blank">
  View PDF Resource
</a>
```

## Testing

### Run API Tests
```bash
# Install dependencies
npm install axios form-data

# Run complete test suite
npm run test:course

# Run specific tests
node src/test/courseCreationTest.js
```

### Test Setup
1. Update JWT token in test file
2. Ensure server is running
3. Have at least one subject in database
4. Teacher account must exist

## Database Schema

### Key Models
```prisma
model Course {
  id            Int       @id @default(autoincrement())
  title         String
  description   String
  subjectId     Int
  teacherId     Int
  chapters      Chapter[]
  approved      Boolean   @default(false)
  // ... other fields
}

model Chapter {
  id        Int       @id @default(autoincrement())
  title     String
  courseId  Int
  sections  Section[]
  order     Int
}

model Section {
  id        Int     @id @default(autoincrement())
  title     String
  chapterId Int
  videoUrl  String? // YouTube video ID
  pdfUrl    String? // File path
  order     Int
}
```

## Performance Considerations

### Database Queries
- Uses Prisma relations for efficient joins
- Implements proper indexing on foreign keys
- Includes pagination for large course lists

### File Storage
- Files stored on filesystem (not database)
- Unique filenames prevent conflicts
- Directory structure for organization

### Caching Opportunities
- Course content (rarely changes)
- User permissions
- Subject lists

## Deployment Notes

### Environment Variables
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
SESSION_SECRET="your-session-secret"
NODE_ENV="production"
```

### Production Considerations
- Use cloud storage (AWS S3) for files
- Implement CDN for video/PDF delivery
- Add rate limiting for uploads
- Set up proper logging
- Configure HTTPS
- Implement backup strategy

## Future Enhancements

### Planned Features
- Video processing and optimization
- Automatic PDF thumbnail generation
- Content moderation
- Analytics and progress tracking
- Bulk upload capabilities
- Version control for course content

### Scalability Improvements
- Microservices architecture
- Event-driven updates
- Search optimization
- Caching layers
- Load balancing

## Support

For technical support or questions about the course creation API:
- Check error logs for debugging
- Verify authentication tokens
- Ensure proper file formats
- Test with provided examples

---

*Last updated: August 2025*
