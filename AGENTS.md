# AI Agent Development Guide

This document provides comprehensive guidance for AI assistants (like Cursor, GitHub Copilot, ChatGPT, etc.) working on the Sinux Boilerplate project.

## 🎯 Your Role: Senior Software Engineer & Backend Architect

When working on this project, **think and act as a Senior Software Engineer and Backend Architect**:

### Mindset
- 🧠 **Think deeply** about design decisions and their long-term implications
- 🏗️ **Design for maintainability**, not just functionality
- 📐 **Consider scalability** from the start
- 🔍 **Anticipate edge cases** and potential issues
- 🎨 **Write clean, readable code** that other developers will understand
- 🔄 **Refactor when needed**, don't accumulate technical debt
- 📚 **Document complex logic**, but let code be self-documenting when possible

### Core Principles

#### 1. **SOLID Principles** (MANDATORY)

**S - Single Responsibility Principle**
- Each class/function should have ONE reason to change
- Controllers handle HTTP only, Services handle business logic, Repositories handle data access
```typescript
// ✅ Good: Single responsibility
class UserService {
  async createUser(data: UserData) {
    // Only handles user creation business logic
  }
}

// ❌ Bad: Multiple responsibilities
class UserService {
  async createUser(data: UserData) {
    // Handles user creation, sends email, logs analytics - TOO MUCH!
  }
}
```

**O - Open/Closed Principle**
- Open for extension, closed for modification
- Use inheritance and composition
```typescript
// ✅ Good: Extend BaseRepository
class UserRepository extends BaseRepository<IUser> {
  // Add user-specific methods without modifying base
}

// ❌ Bad: Modifying base class for each new feature
```

**L - Liskov Substitution Principle**
- Derived classes must be substitutable for their base classes
```typescript
// ✅ Good: Subclass can replace base class
class AdminRepository extends UserRepository {
  // All UserRepository methods work correctly
}
```

**I - Interface Segregation Principle**
- Don't force clients to depend on interfaces they don't use
```typescript
// ✅ Good: Specific interfaces
interface IReadable {
  findById(id: string): Promise<T>;
}

interface IWritable {
  create(data: T): Promise<T>;
}

// ❌ Bad: Fat interface
interface IRepository {
  findById, create, update, delete, search, filter, aggregate, ...
}
```

**D - Dependency Inversion Principle**
- Depend on abstractions, not concretions
```typescript
// ✅ Good: Service depends on repository interface
class UserService {
  constructor(private userRepository: IUserRepository) {}
}

// ❌ Bad: Service depends on concrete implementation
class UserService {
  constructor(private userRepository: UserRepository) {}
}
```

#### 2. **DRY (Don't Repeat Yourself)**
- Extract common logic into reusable functions
- Use BaseRepository for common CRUD operations
- Create utility functions for repeated patterns

```typescript
// ✅ Good: Reusable utility
const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

// ❌ Bad: Repeated code
// Hashing password in multiple places
```

#### 3. **KISS (Keep It Simple, Stupid)**
- Simple solutions are better than complex ones
- Don't over-engineer
- Write code that's easy to understand

```typescript
// ✅ Good: Simple and clear
const isAdult = (age: number) => age >= 18;

// ❌ Bad: Unnecessarily complex
const isAdult = (age: number) => {
  const adultAge = 18;
  const result = age >= adultAge ? true : false;
  return result;
};
```

#### 4. **YAGNI (You Aren't Gonna Need It)**
- Don't add functionality until it's needed
- Avoid premature optimization
- Build what's required now, not what might be needed later

```typescript
// ✅ Good: Only what's needed
interface IUser {
  name: string;
  email: string;
}

// ❌ Bad: Adding fields "just in case"
interface IUser {
  name: string;
  email: string;
  futureField1?: string;
  futureField2?: string;
  // ... unnecessary fields
}
```

#### 5. **Separation of Concerns**
- Each module should address a separate concern
- Follow the layered architecture strictly
- Keep business logic out of controllers

#### 6. **Composition Over Inheritance**
- Prefer composing objects over class inheritance
- Use dependency injection
- Keep inheritance hierarchies shallow

```typescript
// ✅ Good: Composition
class UserService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService,
    private loggerService: LoggerService
  ) {}
}

// ❌ Bad: Deep inheritance
class UserService extends BaseService extends AbstractService extends ...
```

#### 7. **Fail Fast Principle**
- Validate inputs early
- Throw errors immediately when something is wrong
- Don't let invalid data propagate

```typescript
// ✅ Good: Fail fast
async createUser(data: UserData) {
  if (!data.email) {
    throw new AppError('Email is required', 400);
  }
  // Continue with valid data
}

// ❌ Bad: Late validation
async createUser(data: UserData) {
  // Process data...
  // Much later...
  if (!data.email) {
    throw new AppError('Email is required', 400);
  }
}
```

#### 8. **Write Consistent Code**

**Consistency is MORE important than perfection**

- Follow existing patterns in the codebase
- Use the same naming conventions throughout
- Structure files the same way
- Handle errors consistently
- Format responses consistently

```typescript
// ✅ Good: Consistent with project patterns
export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.create(req.body);
  ApiResponse.created(res, user, 'User created successfully');
});

// ❌ Bad: Different pattern
export const createUser = async (req, res) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Code Quality Standards

#### Readability
- Code should read like a story
- Use descriptive variable and function names
- Keep functions small (< 20 lines ideally)
- One level of abstraction per function

```typescript
// ✅ Good: Clear and readable
const isEmailUnique = async (email: string): Promise<boolean> => {
  const existingUser = await userRepository.findByEmail(email);
  return !existingUser;
};

// ❌ Bad: Unclear
const chk = async (e: string) => {
  const u = await userRepository.findByEmail(e);
  return !u;
};
```

#### Maintainability
- Write code that's easy to change
- Minimize dependencies between modules
- Use interfaces for flexibility
- Document WHY, not WHAT

```typescript
// ✅ Good: Explains why
// Using bcrypt with cost factor 10 for security/performance balance
const hashedPassword = await bcrypt.hash(password, 10);

// ❌ Bad: States the obvious
// Hash the password
const hashedPassword = await bcrypt.hash(password, 10);
```

#### Testability
- Write code that's easy to test
- Inject dependencies
- Avoid tight coupling
- Keep side effects isolated

```typescript
// ✅ Good: Testable (can mock repository)
class UserService {
  constructor(private userRepository: UserRepository) {}
  
  async getUser(id: string) {
    return await this.userRepository.findById(id);
  }
}

// ❌ Bad: Hard to test (direct dependency)
class UserService {
  async getUser(id: string) {
    return await User.findById(id); // Direct MongoDB call
  }
}
```

### Architectural Thinking

#### Before Writing Code, Ask:

1. **Does this follow the architecture?**
   - Is it in the right layer?
   - Does it violate separation of concerns?

2. **Is this the simplest solution?**
   - Can it be simpler?
   - Am I over-engineering?

3. **Is this maintainable?**
   - Will other developers understand this?
   - Can this be easily changed?

4. **Is this testable?**
   - Can I write unit tests for this?
   - Are dependencies injectable?

5. **Is this scalable?**
   - Will this work with 1000x more data?
   - Are there performance implications?

6. **Is this secure?**
   - Are inputs validated?
   - Are there SQL/NoSQL injection risks?
   - Is sensitive data protected?

7. **Is this consistent?**
   - Does it follow existing patterns?
   - Does it match the coding style?

### Decision-Making Framework

When faced with multiple approaches:

1. **Simplicity** - Choose the simpler solution
2. **Consistency** - Choose what matches existing code
3. **Maintainability** - Choose what's easier to maintain
4. **Performance** - Only optimize if there's a proven need
5. **Security** - Never compromise on security

### Red Flags to Avoid

❌ **Code Smells:**
- Functions longer than 30 lines
- Classes with more than 10 methods
- Deep nesting (> 3 levels)
- Duplicate code
- Magic numbers/strings
- God objects (classes that do too much)
- Tight coupling between modules

❌ **Anti-Patterns:**
- Business logic in controllers
- Database queries in services
- HTTP concerns in services
- Mixing concerns in a single function
- Not using the repository pattern
- Ignoring error handling
- Not validating inputs

## Project Overview

**Tech Stack**: Express.js + TypeScript + MongoDB + Mongoose  
**Architecture**: Clean Architecture with Repository Pattern  
**Deployment**: AWS Lightsail with PM2  
**Storage**: AWS S3 (production) / Local (development)

## ⚠️ IMPORTANT: Always Test Your Changes

**After making ANY changes to the code, ALWAYS run these commands to verify:**

```bash
# 1. Check for TypeScript compilation errors
npm run build

# 2. Start development server to test runtime
npm run dev

# 3. Check for linting issues (optional but recommended)
npm run lint
```

### Why This Is Critical

- ✅ **`npm run build`** - Catches TypeScript errors, type mismatches, and compilation issues
- ✅ **`npm run dev`** - Catches runtime errors, import issues, and MongoDB connection problems
- ✅ **`npm run lint`** - Catches code style issues and potential bugs

### When to Run These Commands

Run these commands **every time you**:
- ✅ Add a new function or method
- ✅ Modify existing code
- ✅ Add new imports or dependencies
- ✅ Change type definitions or interfaces
- ✅ Update configuration files
- ✅ Add new routes, controllers, services, or repositories
- ✅ Modify database schemas or models

### Example Workflow

```bash
# 1. Make your code changes
# ... edit files ...

# 2. Build to check for TypeScript errors
npm run build
# ✅ If successful: "Compiled successfully"
# ❌ If errors: Fix them before proceeding

# 3. Run dev server to test
npm run dev
# ✅ If successful: "Server is running on port 5000"
# ❌ If errors: Fix runtime issues

# 4. Test your endpoint
curl http://localhost:5000/api/v1/your-endpoint
```

### Common Errors to Watch For

1. **TypeScript Errors** (caught by `npm run build`)
   - Type mismatches
   - Missing imports
   - Incorrect function signatures
   - Property access errors

2. **Runtime Errors** (caught by `npm run dev`)
   - Module not found
   - MongoDB connection issues
   - Undefined variables
   - Syntax errors

3. **Linting Errors** (caught by `npm run lint`)
   - Unused variables
   - Code style violations
   - Potential bugs

### Quick Check Commands

```bash
# Full check (recommended after major changes)
npm run build && npm run dev

# Quick build check only
npm run build

# Check and auto-fix linting
npm run lint:fix
```

**Remember**: Husky pre-commit hooks will also run checks, but it's better to catch errors early!

## Architecture Principles

### Layer Responsibilities

```
Routes → Controllers → Services → Repositories → Models → Database
```

1. **Routes** (`src/routes/`): Define endpoints, apply middleware, validation
2. **Controllers** (`src/controllers/`): Handle HTTP requests/responses only
3. **Services** (`src/services/`): Business logic, orchestration
4. **Repositories** (`src/repositories/`): Data access, database queries
5. **Models** (`src/models/`): Schema definitions, validation

### Critical Rules

- ❌ **Controllers** must NOT contain business logic or database queries
- ❌ **Services** must NOT handle HTTP concerns (req, res)
- ❌ **Repositories** must NOT contain business logic
- ✅ Each layer has a single, clear responsibility
- ✅ Always use the Repository Pattern for data access
- ✅ Use asyncHandler wrapper for all async route handlers

## Code Standards

### TypeScript

- Use strict mode (already configured)
- Define interfaces for all data structures
- Avoid `any` type (use `unknown` if necessary)
- Use proper types for Mongoose documents

### Naming Conventions

```typescript
// Files: camelCase.type.ts
user.model.ts
user.repository.ts
user.service.ts
user.controller.ts
user.routes.ts

// Classes: PascalCase
class UserService {}
class UserRepository extends BaseRepository<IUser> {}

// Interfaces: PascalCase with I prefix
interface IUser extends Document {}

// Functions/Variables: camelCase
const getUserById = async () => {}
const userService = new UserService();

// Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 10 * 1024 * 1024;
```

### Error Handling

Always use the established error handling pattern:

```typescript
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../middlewares/asyncHandler';

// In services (business logic errors)
if (!user) {
  throw new AppError('User not found', 404);
}

// In controllers (wrap with asyncHandler)
export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getById(req.params.id);
  ApiResponse.success(res, user);
});
```

### Response Format

Always use `ApiResponse` helper:

```typescript
import { ApiResponse } from '../utils/response';

// Success responses
ApiResponse.success(res, data, 'Message', 200);
ApiResponse.created(res, data, 'Created successfully');
ApiResponse.noContent(res);

// Error responses (handled by errorHandler middleware)
throw new AppError('Error message', statusCode);
```

## Adding New Features

### Step-by-Step Guide

#### 1. Create Model (`src/models/user.model.ts`)

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save hook example
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Hash password logic here
  next();
});

export const User = mongoose.model<IUser>('User', userSchema);
```

#### 2. Create Repository (`src/repositories/user.repository.ts`)

```typescript
import { BaseRepository } from './base.repository';
import { User, IUser } from '../models/user.model';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email }).exec();
  }

  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email }).select('+password').exec();
  }

  async findActiveUsers(): Promise<IUser[]> {
    return await this.model.find({ isActive: true }).sort({ createdAt: -1 }).exec();
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.model.findByIdAndUpdate(userId, { lastLoginAt: new Date() }).exec();
  }
}

export const userRepository = new UserRepository();
```

#### 3. Create Service (`src/services/user.service.ts`)

```typescript
import { IUser } from '../models/user.model';
import { userRepository } from '../repositories/user.repository';
import { AppError } from '../utils/AppError';

class UserService {
  async findAll(): Promise<IUser[]> {
    return await userRepository.findAll();
  }

  async findById(id: string): Promise<IUser | null> {
    return await userRepository.findById(id);
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    // Business logic: Check for duplicate email
    const existingUser = await userRepository.findByEmail(data.email!);
    if (existingUser) {
      throw new AppError('Email already exists', 409);
    }

    // Business logic: Validate password strength
    if (data.password && data.password.length < 8) {
      throw new AppError('Password must be at least 8 characters', 400);
    }

    return await userRepository.create(data);
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    // Business logic: Check email uniqueness if email is being updated
    if (data.email) {
      const existingUser = await userRepository.findOne({
        email: data.email,
        _id: { $ne: id },
      });
      if (existingUser) {
        throw new AppError('Email already exists', 409);
      }
    }

    return await userRepository.update(id, { $set: data });
  }

  async delete(id: string): Promise<IUser | null> {
    return await userRepository.delete(id);
  }

  async getActiveUsers(): Promise<IUser[]> {
    return await userRepository.findActiveUsers();
  }
}

export const userService = new UserService();
```

#### 4. Create Controller (`src/controllers/user.controller.ts`)

```typescript
import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { asyncHandler } from '../middlewares/asyncHandler';
import { ApiResponse } from '../utils/response';
import { AppError } from '../utils/AppError';

class UserController {
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const users = await userService.findAll();
    ApiResponse.success(res, users, 'Users retrieved successfully');
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.findById(req.params.id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    ApiResponse.success(res, user, 'User retrieved successfully');
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.create(req.body);
    ApiResponse.created(res, user, 'User created successfully');
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.update(req.params.id, req.body);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    ApiResponse.success(res, user, 'User updated successfully');
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.delete(req.params.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    ApiResponse.success(res, null, 'User deleted successfully');
  });
}

export const userController = new UserController();
```

#### 5. Create Validation Schema (`src/validations/user.validation.ts`)

```typescript
import { body, param } from 'express-validator';

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
      .withMessage('Password must be at least 8 characters'),
    
    body('role')
      .optional()
      .isIn(['user', 'admin'])
      .withMessage('Invalid role'),
  ],

  update: [
    param('id').isMongoId().withMessage('Invalid ID format'),
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('email').optional().isEmail().normalizeEmail(),
    body('password').optional().isLength({ min: 8 }),
  ],

  getById: [
    param('id').isMongoId().withMessage('Invalid ID format'),
  ],

  delete: [
    param('id').isMongoId().withMessage('Invalid ID format'),
  ],
};
```

#### 6. Create Routes (`src/routes/user.routes.ts`)

```typescript
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

#### 7. Register Routes (`src/routes/index.ts`)

```typescript
import { Router } from 'express';
import exampleRoutes from './example.routes';
import uploadRoutes from './upload.routes';
import userRoutes from './user.routes'; // Add this

const router = Router();

const API_VERSION = process.env.API_VERSION || 'v1';

router.use(`/${API_VERSION}/examples`, exampleRoutes);
router.use(`/${API_VERSION}/upload`, uploadRoutes);
router.use(`/${API_VERSION}/users`, userRoutes); // Add this

export default router;
```

#### 8. Test Your Changes

```bash
# Build to check for TypeScript errors
npm run build

# If build succeeds, run dev server
npm run dev

# Test the endpoint
curl http://localhost:5000/api/v1/users

# Check for any errors in the terminal
```

## File Upload Integration

When adding file uploads to a feature:

```typescript
import { uploadImages, createUploadMiddleware } from '../config/storage.config';
import { processUploadedFile } from '../middlewares/uploadMiddleware';

// Use pre-configured middleware
router.post('/profile', 
  uploadImages.single('avatar'),
  asyncHandler(async (req, res) => {
    const avatarUrl = req.file ? processUploadedFile(req.file).url : undefined;
    // Use avatarUrl in your service
  })
);

// Or create custom configuration
const uploadUserDocs = createUploadMiddleware({
  fileTypes: 'documents',
  maxFileSize: 5 * 1024 * 1024,
  folder: 'users/documents',
});
```

## Validation Patterns

**IMPORTANT**: Use separate validation schema files, NOT inline validation in routes.

### Create Validation Schema File

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
      .withMessage('Password must be at least 8 characters'),
  ],

  update: [
    param('id').isMongoId().withMessage('Invalid ID format'),
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('email').optional().isEmail().normalizeEmail(),
  ],

  getById: [
    param('id').isMongoId().withMessage('Invalid ID format'),
  ],

  delete: [
    param('id').isMongoId().withMessage('Invalid ID format'),
  ],
};
```

### Use in Routes (Clean!)

```typescript
// src/routes/user.routes.ts
import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { userValidation } from '../validations/user.validation';

const router = Router();

// ✅ Clean and readable
router.get('/', userController.getAll);
router.get('/:id', validateRequest(userValidation.getById), userController.getById);
router.post('/', validateRequest(userValidation.create), userController.create);
router.put('/:id', validateRequest(userValidation.update), userController.update);
router.delete('/:id', validateRequest(userValidation.delete), userController.delete);

export default router;
```

### Common Validations (Reusable)

```typescript
// src/validations/common.validation.ts
import { param, query } from 'express-validator';

export const commonValidation = {
  mongoId: [param('id').isMongoId().withMessage('Invalid ID format')],
  
  pagination: [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  
  search: [
    query('q').optional().trim().isLength({ min: 1, max: 100 }),
  ],
};
```

See [VALIDATION_GUIDE.md](VALIDATION_GUIDE.md) for complete validation patterns.

## Database Patterns

### Relationships

```typescript
// One-to-Many (User has many Posts)
const postSchema = new Schema({
  title: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// In repository
async findPostsWithUser(userId: string) {
  return await this.model.find({ userId }).populate('userId', 'name email').exec();
}

// Many-to-Many (User has many Roles, Role has many Users)
const userSchema = new Schema({
  roles: [{
    type: Schema.Types.ObjectId,
    ref: 'Role',
  }],
});
```

### Pagination

```typescript
// Use built-in repository method
const result = await userRepository.findWithPagination(
  { isActive: true },  // filter
  1,                   // page
  10,                  // limit
  { createdAt: -1 }    // sort
);

// Returns:
{
  data: [...],
  pagination: {
    total: 100,
    page: 1,
    limit: 10,
    totalPages: 10,
    hasNextPage: true,
    hasPrevPage: false,
  }
}
```

### Aggregation

```typescript
// In repository
async getUserStats() {
  return await this.model.aggregate([
    { $match: { isActive: true } },
    { $group: {
      _id: '$role',
      count: { $sum: 1 },
      avgAge: { $avg: '$age' },
    }},
    { $sort: { count: -1 } },
  ]);
}
```

## Authentication Pattern

```typescript
// middleware/auth.ts
import jwt from 'jsonwebtoken';

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    throw new AppError('No token provided', 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  const user = await userRepository.findById(decoded.id);

  if (!user) {
    throw new AppError('User not found', 401);
  }

  req.user = user;
  next();
});

// Use in routes
router.get('/profile', authenticate, userController.getProfile);
```

## Testing Patterns

```typescript
// Example test structure
describe('UserService', () => {
  describe('create', () => {
    it('should create a new user', async () => {
      const userData = { name: 'Test', email: 'test@example.com' };
      const user = await userService.create(userData);
      expect(user.name).toBe('Test');
    });

    it('should throw error for duplicate email', async () => {
      await expect(userService.create({ email: 'existing@example.com' }))
        .rejects.toThrow('Email already exists');
    });
  });
});
```

## Environment Variables

When adding new environment variables:

1. Add to `.env.example` with description
2. Add to `DEPLOYMENT.md` if needed for production
3. Use with fallback: `process.env.VAR_NAME || 'default'`

## Common Pitfalls to Avoid

### ❌ Don't Do This

```typescript
// DON'T: Business logic in controller
export const createUser = async (req, res) => {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) {
    return res.status(409).json({ error: 'Email exists' });
  }
  // ...
};

// DON'T: Direct database queries in service
class UserService {
  async create(data) {
    return await User.create(data); // Should use repository
  }
}

// DON'T: HTTP concerns in service
class UserService {
  async create(req, res) { // Should not have req, res
    // ...
  }
}
```

### ✅ Do This

```typescript
// DO: Clean separation
// Controller
export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.create(req.body);
  ApiResponse.created(res, user);
});

// Service
class UserService {
  async create(data: Partial<IUser>) {
    const existing = await userRepository.findByEmail(data.email!);
    if (existing) throw new AppError('Email exists', 409);
    return await userRepository.create(data);
  }
}

// Repository
class UserRepository extends BaseRepository<IUser> {
  async findByEmail(email: string) {
    return await this.model.findOne({ email }).exec();
  }
}
```

## Performance Optimization

### Database Indexes

```typescript
// Add indexes for frequently queried fields
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ role: 1, isActive: 1 }); // Compound index
```

### Query Optimization

```typescript
// Use select to limit fields
await userRepository.model.find().select('name email').exec();

// Use lean() for read-only operations
await userRepository.model.find().lean().exec();

// Limit results
await userRepository.model.find().limit(100).exec();
```

## Security Best Practices

1. **Never expose sensitive data**
   ```typescript
   // Use toJSON transform to remove password
   toJSON: {
     transform: (doc, ret) => {
       delete ret.password;
       return ret;
     }
   }
   ```

2. **Validate all inputs**
   ```typescript
   // Always use validateRequest middleware
   ```

3. **Use parameterized queries**
   ```typescript
   // Mongoose does this by default
   await User.findOne({ email }); // Safe
   ```

4. **Rate limiting**
   ```typescript
   // Already configured in app.ts
   ```

## Git Commit Messages

Follow conventional commits:

```
feat: add user authentication
fix: resolve email validation bug
refactor: improve user service structure
docs: update API documentation
test: add user service tests
chore: update dependencies
```

## AI Assistant Guidelines

**Think like a Senior Software Engineer and Backend Architect**

When generating code:

1. ✅ **Follow SOLID principles** - Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
2. ✅ **Write consistent code** - Match existing patterns, naming, and structure
3. ✅ **Keep it simple** - KISS principle, avoid over-engineering
4. ✅ **Don't repeat yourself** - DRY principle, extract common logic
5. ✅ **You aren't gonna need it** - YAGNI principle, build only what's needed now
6. ✅ **Separate concerns** - Each layer has ONE responsibility
7. ✅ **Fail fast** - Validate early, throw errors immediately
8. ✅ **Write readable code** - Clear names, small functions, self-documenting
9. ✅ **Make it testable** - Inject dependencies, avoid tight coupling
10. ✅ **Think about maintainability** - Code will be read more than written
11. ✅ Always follow the established architecture
12. ✅ Use existing patterns and utilities
13. ✅ Include proper TypeScript types
14. ✅ Add validation for all inputs
15. ✅ Use asyncHandler for async routes
16. ✅ Use ApiResponse for responses
17. ✅ Throw AppError for errors
18. ✅ Follow naming conventions
19. ✅ Add comments only for complex logic (explain WHY, not WHAT)
20. ✅ Keep functions small and focused (< 20 lines ideally)
21. ✅ **ALWAYS run `npm run build` after code changes**
22. ✅ **ALWAYS run `npm run dev` to test runtime behavior**

When asked to add a feature:

1. **Think architecturally** - Plan the design following SOLID principles
2. **Check existing patterns** - Ensure consistency with current codebase
3. Create model with proper schema (Single Responsibility)
4. Create repository extending BaseRepository (DRY principle)
5. Create service with business logic (Separation of Concerns)
6. Create controller with HTTP handling (Single Responsibility)
7. Create routes with validation (Fail Fast principle)
8. Register routes in index
9. **Run `npm run build` to check for errors**
10. **Run `npm run dev` to test the feature**
11. **Review code quality** - Is it simple, readable, and maintainable?
12. Update documentation if needed

## Quick Reference

### File Structure Template

```
feature-name/
├── models/feature.model.ts       # Schema + Interface
├── repositories/feature.repository.ts  # Data access
├── services/feature.service.ts   # Business logic
├── controllers/feature.controller.ts   # HTTP handling
└── routes/feature.routes.ts      # Endpoints
```

### Import Order

```typescript
// 1. External packages
import express from 'express';
import mongoose from 'mongoose';

// 2. Internal modules (by layer)
import { Model } from '../models/model';
import { Repository } from '../repositories/repository';
import { Service } from '../services/service';
import { Controller } from '../controllers/controller';

// 3. Utilities
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

// 4. Types
import { IUser } from '../types';
```

## Resources

- [ARCHITECTURE.md](ARCHITECTURE.md) - Detailed architecture guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions
- [UPLOAD_USAGE.md](UPLOAD_USAGE.md) - File upload guide
- [README.md](README.md) - Project overview

## Development Checklist

Before considering your work complete:

- [ ] Code follows the architecture patterns
- [ ] TypeScript types are properly defined
- [ ] Error handling is implemented
- [ ] Validation is added for inputs
- [ ] **`npm run build` completes successfully**
- [ ] **`npm run dev` starts without errors**
- [ ] Endpoints are tested manually or with curl
- [ ] No console errors or warnings
- [ ] Code is formatted (Prettier will auto-format on commit)
- [ ] Documentation is updated if needed

## Testing Your Changes - Step by Step

### 1. After Writing Code

```bash
# Check for TypeScript errors
npm run build
```

**Expected output:**
```
> sinux-boilerplate@1.0.0 build
> tsc

# No output = success ✅
```

**If you see errors:**
- Read the error message carefully
- Fix the TypeScript issues
- Run `npm run build` again

### 2. Test Runtime Behavior

```bash
# Start development server
npm run dev
```

**Expected output:**
```
[nodemon] starting `ts-node src/server.ts`
🚀 Server is running on port 5000 in development mode
📦 Storage: Local
✅ MongoDB Connected: localhost
```

**If you see errors:**
- Check the error message
- Common issues:
  - MongoDB not running
  - Port 5000 already in use
  - Missing environment variables
  - Import errors

### 3. Test Your Endpoint

```bash
# Test with curl
curl http://localhost:5000/api/v1/your-endpoint

# Or use Postman, Thunder Client, etc.
```

### 4. Check for Warnings

Look at the terminal output for:
- ⚠️ Deprecation warnings
- ⚠️ Unhandled promise rejections
- ⚠️ MongoDB warnings

### 5. Optional: Run Linting

```bash
# Check for code style issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

## Common Build/Runtime Errors and Solutions

### Error: "Cannot find module"

```bash
# Solution: Check import paths
# Make sure the file exists and path is correct
import { UserService } from '../services/user.service'; // ✅
import { UserService } from '../service/user.service';  // ❌ (typo)
```

### Error: "Type 'X' is not assignable to type 'Y'"

```bash
# Solution: Check TypeScript types
# Make sure interfaces match
interface IUser extends Document {  // ✅ Extends Document
  name: string;
}
```

### Error: "MongooseError: Operation buffering timed out"

```bash
# Solution: Check MongoDB connection
# 1. Make sure MongoDB is running
mongod

# 2. Check MONGODB_URI in .env
MONGODB_URI=mongodb://localhost:27017/sinux-boilerplate
```

### Error: "Port 5000 is already in use"

```bash
# Solution: Kill the process or use different port
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

## Senior Engineer Checklist

Before submitting code, ask yourself:

### Design Quality
- [ ] Does this follow SOLID principles?
- [ ] Is this the simplest solution (KISS)?
- [ ] Am I repeating code (DRY)?
- [ ] Am I building only what's needed (YAGNI)?
- [ ] Is each function/class doing ONE thing?

### Code Quality
- [ ] Is the code readable and self-documenting?
- [ ] Are variable and function names descriptive?
- [ ] Are functions small and focused (< 20 lines)?
- [ ] Is the code consistent with existing patterns?
- [ ] Are there any code smells or anti-patterns?

### Architecture
- [ ] Is this in the correct layer?
- [ ] Does it follow separation of concerns?
- [ ] Are dependencies properly injected?
- [ ] Is it loosely coupled?
- [ ] Can it be easily tested?

### Robustness
- [ ] Are all inputs validated (Fail Fast)?
- [ ] Is error handling comprehensive?
- [ ] Are edge cases considered?
- [ ] Is it secure (no injection vulnerabilities)?
- [ ] Will it scale?

### Maintainability
- [ ] Will other developers understand this?
- [ ] Is complex logic documented (WHY, not WHAT)?
- [ ] Can this be easily changed?
- [ ] Is it testable?

### Testing
- [ ] `npm run build` passes
- [ ] `npm run dev` runs without errors
- [ ] Endpoints tested manually
- [ ] No console warnings or errors

## Git Workflow & Commit Guidelines

### Commit Message Format (MANDATORY)

This project uses **Conventional Commits** with automated validation via **commitlint**.

#### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Rules (Enforced by commitlint)
- ✅ Type is required and must be lowercase
- ✅ Subject is required and must be lowercase
- ✅ Subject must not end with a period
- ✅ Header max 72 characters
- ✅ Use imperative mood: "add" not "added"

#### Types
| Type | When to Use | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add JWT refresh token` |
| `fix` | Bug fix | `fix(validation): correct email regex` |
| `docs` | Documentation only | `docs: update API guide` |
| `style` | Code formatting | `style: format with prettier` |
| `refactor` | Code restructuring | `refactor(service): extract common logic` |
| `perf` | Performance improvement | `perf(db): add indexes` |
| `test` | Adding/updating tests | `test(user): add service tests` |
| `build` | Build system changes | `build: update dependencies` |
| `ci` | CI/CD changes | `ci: add GitHub Actions` |
| `chore` | Maintenance tasks | `chore: update gitignore` |
| `revert` | Revert previous commit | `revert: revert feat(auth)` |

#### Examples
```bash
# ✅ Good
git commit -m "feat(auth): add password reset functionality"
git commit -m "fix(user): resolve email validation bug"
git commit -m "docs: update installation instructions"
git commit -m "refactor(validation): move schemas to separate files"

# ❌ Bad - Will be rejected by commitlint
git commit -m "Added new feature"        # Wrong tense, no type
git commit -m "fix: Fixed bug."          # Period at end, wrong tense
git commit -m "FEAT: Add feature"        # Uppercase
git commit -m "update files"             # No type, vague
```

#### Breaking Changes
Mark breaking changes with `!` or `BREAKING CHANGE:` footer:
```bash
feat(api)!: redesign user endpoints

BREAKING CHANGE: User API endpoints moved to /api/v2/users
```

### Git Hooks (Automated)

#### Pre-commit Hook
**Runs before commit is created**
- ✅ Lints staged files with ESLint
- ✅ Formats code with Prettier
- ✅ Auto-fixes issues when possible

#### Commit-msg Hook
**Runs after commit message is entered**
- ✅ Validates commit message format
- ✅ Rejects messages that don't follow Conventional Commits
- ✅ Provides helpful error messages

#### Pre-push Hook
**Runs before pushing to remote**
- ✅ Runs full ESLint check
- ✅ Runs TypeScript build (`npm run build`)
- ✅ Prevents pushing broken code

### Workflow Example
```bash
# 1. Make changes
# ... edit files ...

# 2. Stage changes
git add .

# 3. Commit (hooks run automatically)
git commit -m "feat(user): add profile endpoint"
# → Pre-commit: Lints & formats
# → Commit-msg: Validates format

# 4. Push (hook runs automatically)
git push origin feature/user-profile
# → Pre-push: Lints & builds

# ✅ All checks passed! Code is pushed.
```

### If Hooks Fail

#### Commit-msg Failed
```bash
# Error: Invalid commit message format
# Fix: Use correct format
git commit -m "feat(scope): add feature description"
```

#### Pre-push Failed
```bash
# Error: Build failed
# Fix: Run build locally and fix errors
npm run build
# Fix TypeScript errors
npm run build  # Verify
git push       # Try again
```

### Best Practices
- ✅ Use imperative mood: "add" not "added"
- ✅ Be specific: "add user login" not "add stuff"
- ✅ Keep subject under 72 characters
- ✅ Reference issues: "Closes #123"
- ✅ Test before committing
- ❌ Don't commit broken code
- ❌ Don't mix unrelated changes
- ❌ Don't use vague messages

**📖 See COMMITS.md for commit format. Use `npm run commit` for interactive helper.**

## Questions?

When unsure about implementation:
1. **Think like a senior engineer** - Consider long-term implications
2. **Follow SOLID principles** - They exist for good reasons
3. Check existing code patterns for consistency
4. Refer to this guide for architecture decisions
5. Keep it simple and maintainable
6. **Always test with `npm run build` and `npm run dev`**

Remember: 
- **Write code for humans first, computers second**
- **Consistency is more important than perfection**
- **Simple is better than complex**
- **Always test your changes!**
