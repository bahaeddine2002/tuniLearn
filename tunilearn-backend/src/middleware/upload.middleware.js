const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Multer configuration for PDF uploads
 */

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
const resourcesDir = path.join(uploadDir, 'resources');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(resourcesDir)) {
  fs.mkdirSync(resourcesDir, { recursive: true });
}

// Storage configuration for PDFs
const pdfStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resourcesDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `pdf-${uniqueSuffix}${extension}`);
  }
});

// File filter for PDFs only
const pdfFileFilter = (req, file, cb) => {
  // Check file extension
  const allowedExtensions = ['.pdf'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (!allowedExtensions.includes(fileExtension)) {
    return cb(new Error('Only PDF files are allowed'), false);
  }

  // Check MIME type
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('Only PDF files are allowed'), false);
  }

  cb(null, true);
};

// Storage configuration for course thumbnails
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `thumb-${uniqueSuffix}${extension}`);
  }
});

// File filter for images
const imageFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (!allowedExtensions.includes(fileExtension) || !allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Only image files (JPG, PNG, GIF, WebP) are allowed'), false);
  }

  cb(null, true);
};

// Multer instances
const pdfUpload = multer({
  storage: pdfStorage,
  fileFilter: pdfFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only one PDF per request
  }
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for images
    files: 1
  }
});

// Combined upload for course creation (thumbnail + multiple resources)
const courseUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === 'thumbnail') {
        cb(null, uploadDir);
      } else if (file.fieldname === 'resources') {
        cb(null, resourcesDir);
      } else {
        cb(new Error('Unexpected field'), false);
      }
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      const prefix = file.fieldname === 'thumbnail' ? 'thumb-' : 'resource-';
      cb(null, `${prefix}${uniqueSuffix}${extension}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'thumbnail') {
      return imageFileFilter(req, file, cb);
    } else if (file.fieldname === 'resources') {
      // Allow both PDFs and images for resources
      const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const allowedMimeTypes = [
        'application/pdf',
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'
      ];
      
      const fileExtension = path.extname(file.originalname).toLowerCase();
      
      if (!allowedExtensions.includes(fileExtension) || !allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error('Only PDF and image files are allowed for resources'), false);
      }
      
      cb(null, true);
    } else {
      cb(new Error('Unexpected field'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 11 // 1 thumbnail + up to 10 resources
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File too large. Maximum size is 10MB for PDFs and 5MB for images.' 
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        error: 'Too many files. Maximum is 1 thumbnail and 10 resource files.' 
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        error: 'Unexpected file field.' 
      });
    }
    return res.status(400).json({ error: err.message });
  }
  
  if (err.message.includes('Only PDF files are allowed') ||
      err.message.includes('Only image files') ||
      err.message.includes('Unexpected field')) {
    return res.status(400).json({ error: err.message });
  }
  
  next(err);
};

module.exports = {
  pdfUpload,
  imageUpload,
  courseUpload,
  handleMulterError
};
