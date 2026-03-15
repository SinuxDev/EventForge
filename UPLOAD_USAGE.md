# File Upload Usage Guide

This guide shows how to use the reusable file upload system in your application.

## Quick Start

### 1. Basic Upload (Default Configuration)

```typescript
import { Router } from 'express';
import { upload } from '../config/storage.config';
import { asyncHandler } from '../middlewares/asyncHandler';
import { processUploadedFile } from '../middlewares/uploadMiddleware';

const router = Router();

// Single file upload
router.post('/upload', upload.single('file'), asyncHandler(async (req, res) => {
  const fileInfo = processUploadedFile(req.file!);
  res.json({ file: fileInfo });
}));

// Multiple files upload
router.post('/upload-multiple', upload.array('files', 5), asyncHandler(async (req, res) => {
  const files = (req.files as Express.Multer.File[]).map(processUploadedFile);
  res.json({ files });
}));
```

## Pre-configured Upload Middlewares

### Images Only (5MB limit)

```typescript
import { uploadImages } from '../config/storage.config';

router.post('/profile-picture', uploadImages.single('avatar'), asyncHandler(async (req, res) => {
  const fileInfo = processUploadedFile(req.file!);
  // Save fileInfo.url to user profile
  res.json({ avatar: fileInfo });
}));
```

**Allowed types**: JPEG, JPG, PNG, GIF, WebP, SVG  
**Max size**: 5MB  
**Storage folder**: `images/`

### Documents Only (20MB limit)

```typescript
import { uploadDocuments } from '../config/storage.config';

router.post('/upload-resume', uploadDocuments.single('resume'), asyncHandler(async (req, res) => {
  const fileInfo = processUploadedFile(req.file!);
  res.json({ resume: fileInfo });
}));
```

**Allowed types**: PDF, DOC, DOCX, XLS, XLSX, TXT, CSV  
**Max size**: 20MB  
**Storage folder**: `documents/`

### Videos Only (100MB limit)

```typescript
import { uploadVideos } from '../config/storage.config';

router.post('/upload-video', uploadVideos.single('video'), asyncHandler(async (req, res) => {
  const fileInfo = processUploadedFile(req.file!);
  res.json({ video: fileInfo });
}));
```

**Allowed types**: MP4, MPEG, QuickTime, AVI, WebM  
**Max size**: 100MB  
**Storage folder**: `videos/`

### Audio Only (10MB limit)

```typescript
import { uploadAudio } from '../config/storage.config';

router.post('/upload-audio', uploadAudio.single('audio'), asyncHandler(async (req, res) => {
  const fileInfo = processUploadedFile(req.file!);
  res.json({ audio: fileInfo });
}));
```

**Allowed types**: MP3, WAV, OGG, WebM  
**Max size**: 10MB  
**Storage folder**: `audio/`

## Custom Upload Configuration

### Create Custom Upload Middleware

```typescript
import { createUploadMiddleware } from '../config/storage.config';

// Custom configuration for product images
const uploadProductImages = createUploadMiddleware({
  fileTypes: 'images',
  maxFileSize: 2 * 1024 * 1024, // 2MB
  folder: 'products',
});

router.post('/product-image', uploadProductImages.single('image'), asyncHandler(async (req, res) => {
  const fileInfo = processUploadedFile(req.file!);
  res.json({ productImage: fileInfo });
}));
```

### Custom MIME Types

```typescript
const uploadCustom = createUploadMiddleware({
  allowedMimeTypes: ['image/png', 'image/jpeg', 'application/pdf'],
  maxFileSize: 15 * 1024 * 1024, // 15MB
  folder: 'custom-uploads',
});
```

### Allow All File Types

```typescript
const uploadAny = createUploadMiddleware({
  fileTypes: 'all',
  maxFileSize: 50 * 1024 * 1024, // 50MB
  folder: 'any-files',
});
```

## Real-World Examples

### Example 1: User Profile with Avatar

```typescript
import { Router } from 'express';
import { uploadImages } from '../config/storage.config';
import { asyncHandler } from '../middlewares/asyncHandler';
import { processUploadedFile } from '../middlewares/uploadMiddleware';
import { userService } from '../services/user.service';

const router = Router();

router.put('/profile', 
  uploadImages.single('avatar'),
  asyncHandler(async (req, res) => {
    const avatarUrl = req.file ? processUploadedFile(req.file).url : undefined;
    
    const updatedUser = await userService.updateProfile(req.user.id, {
      name: req.body.name,
      bio: req.body.bio,
      avatarUrl,
    });

    res.json({ user: updatedUser });
  })
);
```

### Example 2: Product with Multiple Images

```typescript
const uploadProductImages = createUploadMiddleware({
  fileTypes: 'images',
  maxFileSize: 3 * 1024 * 1024,
  folder: 'products',
});

router.post('/products',
  uploadProductImages.array('images', 5),
  asyncHandler(async (req, res) => {
    const imageUrls = req.files 
      ? (req.files as Express.Multer.File[]).map(f => processUploadedFile(f).url)
      : [];

    const product = await productService.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      images: imageUrls,
    });

    res.json({ product });
  })
);
```

### Example 3: Blog Post with Featured Image and Attachments

```typescript
import { uploadImages, uploadDocuments } from '../config/storage.config';

router.post('/blog-posts',
  uploadImages.single('featuredImage'),
  asyncHandler(async (req, res) => {
    const featuredImageUrl = req.file ? processUploadedFile(req.file).url : null;

    const post = await blogService.create({
      title: req.body.title,
      content: req.body.content,
      featuredImage: featuredImageUrl,
    });

    res.json({ post });
  })
);

router.post('/blog-posts/:id/attachments',
  uploadDocuments.array('attachments', 3),
  asyncHandler(async (req, res) => {
    const attachmentUrls = (req.files as Express.Multer.File[])
      .map(f => processUploadedFile(f).url);

    const post = await blogService.addAttachments(req.params.id, attachmentUrls);

    res.json({ post });
  })
);
```

### Example 4: Form with Mixed Fields

```typescript
router.post('/submit-application',
  uploadDocuments.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 },
    { name: 'certificates', maxCount: 5 },
  ]),
  asyncHandler(async (req, res) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const resumeUrl = files.resume ? processUploadedFile(files.resume[0]).url : null;
    const coverLetterUrl = files.coverLetter ? processUploadedFile(files.coverLetter[0]).url : null;
    const certificateUrls = files.certificates 
      ? files.certificates.map(f => processUploadedFile(f).url)
      : [];

    const application = await applicationService.create({
      ...req.body,
      resumeUrl,
      coverLetterUrl,
      certificates: certificateUrls,
    });

    res.json({ application });
  })
);
```

## Helper Functions

### Process Single File

```typescript
import { processUploadedFile } from '../middlewares/uploadMiddleware';

const fileInfo = processUploadedFile(req.file!);
// Returns: { filename, originalName, mimetype, size, url, fieldName }
```

### Process Multiple Files

```typescript
import { processUploadedFiles } from '../middlewares/uploadMiddleware';

const files = processUploadedFiles(req.files as Express.Multer.File[]);
// Returns: Array of file info objects
```

### Validation Middleware

```typescript
import { validateSingleFile, validateMultipleFiles } from '../middlewares/uploadMiddleware';

// Validate single file upload
router.post('/upload', upload.single('file'), validateSingleFile, handler);

// Validate multiple files upload
router.post('/upload-many', upload.array('files'), validateMultipleFiles, handler);
```

## File Service Operations

### Delete File

```typescript
import { fileService } from '../services/file.service';

await fileService.deleteFile(fileUrl);
// Works with both S3 and local storage
```

### Get File Metadata

```typescript
const metadata = await fileService.getFileMetadata(fileUrl);
// Returns: { ContentLength, LastModified, ... }
```

### Optimize Image

```typescript
const optimizedBuffer = await fileService.optimizeImage(filePath, {
  width: 800,
  height: 600,
  quality: 80,
});
```

### Create Thumbnail

```typescript
const thumbnailBuffer = await fileService.createThumbnail(filePath, 200);
```

### Upload Buffer (Programmatic Upload)

```typescript
const url = await fileService.uploadBuffer(
  buffer,
  'custom-filename.jpg',
  'image/jpeg'
);
```

## Configuration Options

### UploadOptions Interface

```typescript
interface UploadOptions {
  allowedMimeTypes?: string[];     // Custom MIME types
  maxFileSize?: number;            // Max file size in bytes
  folder?: string;                 // Storage folder name
  fileTypes?: 'images' | 'documents' | 'all' | 'videos' | 'audio';
}
```

### Available MIME Type Presets

```typescript
const presets = {
  images: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', ...],
  videos: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'],
};
```

## Environment-Based Storage

The system automatically switches between local and S3 storage:

- **Development** (`NODE_ENV=development`): Files saved to `./uploads/` folder
- **Production** (`NODE_ENV=production`): Files uploaded to AWS S3

No code changes needed! Just set the environment variable.

## Error Handling

All upload operations are automatically wrapped with error handling:

```typescript
// Invalid file type
{
  "status": "error",
  "message": "Invalid file type. Allowed types: image/jpeg, image/png, ..."
}

// File too large
{
  "status": "error",
  "message": "File too large"
}

// No file uploaded
{
  "status": "error",
  "message": "No file uploaded"
}
```

## Best Practices

1. **Always validate file uploads**
   ```typescript
   router.post('/upload', upload.single('file'), validateSingleFile, handler);
   ```

2. **Use appropriate file type restrictions**
   ```typescript
   // For avatars, use uploadImages
   // For resumes, use uploadDocuments
   ```

3. **Set reasonable file size limits**
   ```typescript
   const upload = createUploadMiddleware({
     maxFileSize: 5 * 1024 * 1024, // 5MB for images
   });
   ```

4. **Organize files in folders**
   ```typescript
   const uploadUserFiles = createUploadMiddleware({
     folder: 'users/avatars',
   });
   ```

5. **Delete old files when updating**
   ```typescript
   if (user.avatarUrl) {
     await fileService.deleteFile(user.avatarUrl);
   }
   ```

6. **Use processUploadedFile for consistent file info**
   ```typescript
   const fileInfo = processUploadedFile(req.file!);
   // Always returns the same structure
   ```

## Testing Upload Endpoints

### Using cURL

```bash
# Single file
curl -X POST http://localhost:5000/api/v1/upload/single \
  -F "file=@/path/to/image.jpg"

# Multiple files
curl -X POST http://localhost:5000/api/v1/upload/multiple \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg"

# With form data
curl -X POST http://localhost:5000/api/v1/products \
  -F "name=Product Name" \
  -F "price=99.99" \
  -F "image=@/path/to/product.jpg"
```

### Using Postman

1. Select POST method
2. Go to Body tab
3. Select "form-data"
4. Add key "file" (or your field name)
5. Change type to "File"
6. Choose file
7. Send request

## Summary

The upload system is now **fully reusable** with:

✅ Pre-configured middlewares for common use cases  
✅ Custom configuration options  
✅ Automatic S3/local storage switching  
✅ Helper functions for file processing  
✅ Type-safe TypeScript interfaces  
✅ Consistent error handling  
✅ Easy integration into any route  

Use it anywhere in your application without duplicating code!
