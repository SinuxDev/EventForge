# Validation Guide

This guide explains how to implement clean, maintainable validation in the Sinux Boilerplate.

## Philosophy

**Separation of Concerns**: Validation logic should be separate from routing logic.

✅ **Good**: Validation schemas in separate files  
❌ **Bad**: Inline validation in route files

## Structure

```
src/
├── validations/           # Validation schemas
│   ├── common.validation.ts    # Reusable validations
│   ├── example.validation.ts   # Example-specific validations
│   └── user.validation.ts      # User-specific validations
├── routes/               # Clean route definitions
└── middlewares/          # Validation middleware
```

## Creating Validation Schemas

### 1. Create Validation File

Create a file in `src/validations/` for your resource:

```typescript
// src/validations/user.validation.ts
import { body, param, query } from 'express-validator';

export const userValidation = {
  create: [
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain uppercase, lowercase, and number'),
    
    body('role')
      .optional()
      .isIn(['user', 'admin'])
      .withMessage('Role must be either user or admin'),
  ],

  update: [
    param('id').isMongoId().withMessage('Invalid ID format'),
    
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    
    body('email')
      .optional()
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
  ],

  getById: [
    param('id').isMongoId().withMessage('Invalid ID format'),
  ],

  delete: [
    param('id').isMongoId().withMessage('Invalid ID format'),
  ],

  search: [
    query('q')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search query must be between 1 and 100 characters'),
    
    query('role')
      .optional()
      .isIn(['user', 'admin'])
      .withMessage('Invalid role filter'),
  ],
};
```

### 2. Use in Routes

Import and use the validation schemas in your routes:

```typescript
// src/routes/user.routes.ts
import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { userValidation } from '../validations/user.validation';

const router = Router();

// Clean and readable routes
router.get('/', userController.getAll);

router.get('/:id', validateRequest(userValidation.getById), userController.getById);

router.post('/', validateRequest(userValidation.create), userController.create);

router.put('/:id', validateRequest(userValidation.update), userController.update);

router.delete('/:id', validateRequest(userValidation.delete), userController.delete);

export default router;
```

## Common Validations

Use `common.validation.ts` for reusable validation patterns:

```typescript
// src/validations/common.validation.ts
import { param, query } from 'express-validator';

export const commonValidation = {
  // MongoDB ObjectId validation
  mongoId: [
    param('id').isMongoId().withMessage('Invalid ID format'),
  ],

  // Pagination validation
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer')
      .toInt(),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
      .toInt(),
    
    query('sort')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort must be asc or desc'),
  ],

  // Search validation
  search: [
    query('q')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search query must be between 1 and 100 characters'),
  ],
};
```

### Using Common Validations

```typescript
import { commonValidation } from '../validations/common.validation';
import { userValidation } from '../validations/user.validation';

// Combine validations
router.get(
  '/search',
  validateRequest([...commonValidation.search, ...commonValidation.pagination]),
  userController.search
);
```

## Validation Rules Reference

### String Validations

```typescript
body('field')
  .notEmpty()                    // Not empty
  .trim()                        // Remove whitespace
  .isLength({ min: 2, max: 100 }) // Length range
  .matches(/regex/)              // Regex pattern
  .isAlpha()                     // Only letters
  .isAlphanumeric()             // Letters and numbers
  .toLowerCase()                 // Convert to lowercase
  .toUpperCase()                 // Convert to uppercase
```

### Email Validation

```typescript
body('email')
  .notEmpty()
  .isEmail()
  .normalizeEmail()              // Standardize email format
```

### Number Validations

```typescript
body('age')
  .notEmpty()
  .isInt({ min: 18, max: 120 }) // Integer with range
  .toInt()                       // Convert to integer

body('price')
  .notEmpty()
  .isFloat({ min: 0 })          // Float with minimum
  .toFloat()                     // Convert to float
```

### Boolean Validation

```typescript
body('isActive')
  .optional()
  .isBoolean()
  .toBoolean()                   // Convert to boolean
```

### Array Validation

```typescript
body('tags')
  .isArray({ min: 1, max: 10 })
  .withMessage('Tags must be an array with 1-10 items')

body('tags.*')                   // Validate each array item
  .trim()
  .isLength({ min: 1, max: 50 })
```

### Date Validation

```typescript
body('birthDate')
  .notEmpty()
  .isISO8601()                   // ISO date format
  .toDate()                      // Convert to Date object

body('startDate')
  .isAfter()                     // After today
  .isBefore('2025-12-31')       // Before specific date
```

### Enum Validation

```typescript
body('status')
  .isIn(['active', 'inactive', 'pending'])
  .withMessage('Invalid status')
```

### URL Validation

```typescript
body('website')
  .optional()
  .isURL()
  .withMessage('Invalid URL format')
```

### MongoDB ObjectId

```typescript
param('id')
  .isMongoId()
  .withMessage('Invalid ID format')
```

### Custom Validation

```typescript
body('password')
  .custom((value, { req }) => {
    if (value !== req.body.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    return true;
  })

body('email')
  .custom(async (value) => {
    const user = await User.findOne({ email: value });
    if (user) {
      throw new Error('Email already exists');
    }
    return true;
  })
```

## Advanced Patterns

### Conditional Validation

```typescript
body('companyName')
  .if(body('userType').equals('business'))
  .notEmpty()
  .withMessage('Company name is required for business accounts')
```

### Nested Object Validation

```typescript
body('address.street')
  .notEmpty()
  .withMessage('Street is required')

body('address.city')
  .notEmpty()
  .withMessage('City is required')

body('address.zipCode')
  .isPostalCode('US')
  .withMessage('Invalid ZIP code')
```

### File Upload Validation

```typescript
// In validation file
import { body } from 'express-validator';

export const uploadValidation = {
  image: [
    body('title')
      .notEmpty()
      .withMessage('Title is required'),
    
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
  ],
};

// In route
router.post(
  '/upload',
  uploadImages.single('image'),
  validateRequest(uploadValidation.image),
  controller.upload
);
```

## Best Practices

### 1. Group Related Validations

```typescript
// ✅ Good: Organized by operation
export const userValidation = {
  create: [...],
  update: [...],
  login: [...],
  changePassword: [...],
};

// ❌ Bad: Flat structure
export const validateUserCreate = [...];
export const validateUserUpdate = [...];
```

### 2. Reuse Common Validations

```typescript
// ✅ Good: Reuse common patterns
import { commonValidation } from './common.validation';

export const userValidation = {
  getById: commonValidation.mongoId,
  search: [...commonValidation.search, ...commonValidation.pagination],
};

// ❌ Bad: Duplicate validation logic
```

### 3. Descriptive Error Messages

```typescript
// ✅ Good: Clear, helpful messages
body('email')
  .isEmail()
  .withMessage('Please provide a valid email address')

// ❌ Bad: Generic messages
body('email')
  .isEmail()
  .withMessage('Invalid')
```

### 4. Sanitize Inputs

```typescript
// ✅ Good: Sanitize and validate
body('name')
  .trim()                    // Remove whitespace
  .escape()                  // Escape HTML
  .notEmpty()

body('email')
  .normalizeEmail()          // Standardize format
  .isEmail()

// ❌ Bad: Only validate, don't sanitize
```

### 5. Validate All Inputs

```typescript
// ✅ Good: Validate params, query, and body
export const userValidation = {
  update: [
    param('id').isMongoId(),           // URL param
    query('notify').optional().isBoolean(), // Query param
    body('name').notEmpty(),           // Request body
  ],
};
```

## Testing Validations

```typescript
// Example test
describe('User Validation', () => {
  it('should reject invalid email', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({ name: 'Test', email: 'invalid-email' });

    expect(response.status).toBe(400);
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({
        field: 'email',
        message: 'Invalid email format',
      })
    );
  });
});
```

## Migration Guide

### From Inline to Schema-Based

**Before (Inline):**
```typescript
router.post(
  '/',
  validateRequest([
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
  ]),
  controller.create
);
```

**After (Schema-Based):**
```typescript
// 1. Create validation file
// src/validations/user.validation.ts
export const userValidation = {
  create: [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
  ],
};

// 2. Update route
import { userValidation } from '../validations/user.validation';

router.post('/', validateRequest(userValidation.create), controller.create);
```

## Summary

### Benefits of This Approach

✅ **Separation of Concerns** - Validation logic separate from routes  
✅ **Reusability** - Share validations across routes  
✅ **Maintainability** - Easy to update validation rules  
✅ **Readability** - Clean, readable route files  
✅ **Testability** - Easy to test validation logic  
✅ **Consistency** - Standardized validation patterns  

### File Organization

```
src/validations/
├── common.validation.ts      # Shared validations (mongoId, pagination, etc.)
├── user.validation.ts        # User-specific validations
├── product.validation.ts     # Product-specific validations
└── order.validation.ts       # Order-specific validations
```

### Route Pattern

```typescript
router.METHOD(
  '/path',
  validateRequest(resourceValidation.operation),
  controller.method
);
```

This approach keeps your routes clean and your validation logic organized! 🎯
