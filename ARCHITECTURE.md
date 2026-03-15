# Backend Architecture Documentation

## Overview

This backend follows a **clean, layered architecture** with clear separation of concerns, making it maintainable, testable, and scalable.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│                    (Frontend, Mobile, etc.)                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                      │
│                    (Routes & Controllers)                    │
│  • HTTP Request/Response handling                            │
│  • Input validation                                          │
│  • Response formatting                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                    │
│                         (Services)                           │
│  • Business rules                                            │
│  • Data transformation                                       │
│  • Orchestration                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Access Layer                        │
│                      (Repositories)                          │
│  • Database queries                                          │
│  • CRUD operations                                           │
│  • Data persistence abstraction                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Database Layer                        │
│                    (MongoDB + Mongoose)                      │
│  • Data models                                               │
│  • Schema definitions                                        │
│  • Database connection                                       │
└─────────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. Routes Layer (`src/routes/`)

**Purpose**: Define API endpoints and route requests to controllers

**Responsibilities**:
- Define HTTP endpoints (GET, POST, PUT, DELETE)
- Apply middleware (validation, authentication, etc.)
- Route requests to appropriate controllers

**Example**:
```typescript
router.post(
  '/',
  validateRequest([
    body('name').notEmpty(),
    body('email').isEmail(),
  ]),
  exampleController.create
);
```

### 2. Controllers Layer (`src/controllers/`)

**Purpose**: Handle HTTP requests and responses

**Responsibilities**:
- Receive HTTP requests
- Extract data from request (body, params, query)
- Call appropriate service methods
- Format and send HTTP responses
- Handle errors with proper status codes

**Rules**:
- ❌ NO business logic
- ❌ NO database queries
- ✅ Only HTTP concerns
- ✅ Delegate to services

**Example**:
```typescript
create = asyncHandler(async (req: Request, res: Response) => {
  const example = await exampleService.create(req.body);
  ApiResponse.created(res, example, 'Example created successfully');
});
```

### 3. Services Layer (`src/services/`)

**Purpose**: Implement business logic

**Responsibilities**:
- Business rules and validation
- Data transformation
- Orchestrate multiple repository calls
- Handle complex operations
- Throw business-level errors

**Rules**:
- ❌ NO HTTP concerns (req, res)
- ❌ NO direct database queries
- ✅ Business logic only
- ✅ Use repositories for data access

**Example**:
```typescript
async create(data: Partial<IExample>): Promise<IExample> {
  // Business logic: Check for duplicates
  const existing = await exampleRepository.findByEmail(data.email!);
  if (existing) {
    throw new AppError('Email already exists', 409);
  }
  
  // Delegate to repository
  return await exampleRepository.create(data);
}
```

### 4. Repositories Layer (`src/repositories/`)

**Purpose**: Abstract database operations

**Responsibilities**:
- CRUD operations
- Database queries
- Data persistence
- Query optimization
- Pagination and filtering

**Rules**:
- ❌ NO business logic
- ❌ NO HTTP concerns
- ✅ Database operations only
- ✅ Return raw data

**Example**:
```typescript
async findByEmail(email: string): Promise<IExample | null> {
  return await this.model.findOne({ email }).exec();
}
```

### 5. Models Layer (`src/models/`)

**Purpose**: Define data structure and validation

**Responsibilities**:
- Schema definitions
- Data validation rules
- Indexes for performance
- Virtual properties
- Instance methods
- Hooks (pre/post save)

**Example**:
```typescript
const exampleSchema = new Schema<IExample>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
});

exampleSchema.index({ email: 1 });
```

## Data Flow

### Request Flow (Create Example)

```
1. Client sends POST /api/v1/examples
   ↓
2. Route receives request
   ↓
3. Validation middleware validates input
   ↓
4. Controller extracts data from request
   ↓
5. Controller calls exampleService.create(data)
   ↓
6. Service checks business rules (duplicate email)
   ↓
7. Service calls exampleRepository.create(data)
   ↓
8. Repository creates document in MongoDB
   ↓
9. Repository returns created document
   ↓
10. Service returns document to controller
    ↓
11. Controller formats response
    ↓
12. Client receives JSON response
```

## Key Design Patterns

### 1. Repository Pattern

**Benefits**:
- Abstracts data access logic
- Makes testing easier (mock repositories)
- Allows switching databases without changing business logic
- Centralizes query logic

**Implementation**:
```typescript
// Base repository with common operations
class BaseRepository<T> {
  findAll, findById, create, update, delete, etc.
}

// Specific repository extends base
class ExampleRepository extends BaseRepository<IExample> {
  // Custom queries specific to Example
  findByEmail(email: string) { ... }
}
```

### 2. Service Pattern

**Benefits**:
- Encapsulates business logic
- Reusable across different controllers
- Easier to test
- Single responsibility

### 3. Dependency Injection

**Benefits**:
- Loose coupling
- Easier testing
- Better maintainability

**Example**:
```typescript
// Service depends on repository (injected)
class ExampleService {
  constructor(private repository: ExampleRepository) {}
}
```

## File Upload Architecture

### Development (Local Storage)

```
Client → Multer → Local Disk → File Service → Response
                     ↓
                 /uploads/
```

### Production (AWS S3)

```
Client → Multer-S3 → AWS S3 → File Service → Response
                       ↓
                   S3 Bucket
```

**Automatic switching based on `NODE_ENV`**:
- `development` → Local storage
- `production` → AWS S3

## Error Handling Architecture

```
Error occurs in any layer
        ↓
asyncHandler catches error
        ↓
Passes to errorHandler middleware
        ↓
errorHandler formats error
        ↓
Sends appropriate HTTP response
```

## Middleware Architecture

### Request Processing Pipeline

```
Request
  ↓
1. Helmet (Security headers)
  ↓
2. CORS (Cross-origin)
  ↓
3. Compression (Response compression)
  ↓
4. Morgan (Logging)
  ↓
5. Body Parser (JSON/URL-encoded)
  ↓
6. Rate Limiter (DDoS protection)
  ↓
7. Routes
  ↓
8. Validation Middleware (if applicable)
  ↓
9. Controller
  ↓
10. Error Handler (if error occurs)
  ↓
Response
```

## Database Connection Architecture

```
Server Start
     ↓
connectDB()
     ↓
Mongoose.connect()
     ↓
Event Listeners:
  • connected
  • error
  • disconnected
  • reconnected
     ↓
Graceful Shutdown:
  • SIGTERM
  • SIGINT
  • PM2 shutdown
```

## Deployment Architecture (AWS Lightsail + PM2)

```
┌─────────────────────────────────────────────┐
│              Internet/Client                 │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│         Nginx (Reverse Proxy + SSL)          │
│              Port 80/443                     │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│      PM2 (Process Manager - Cluster)         │
│         Multiple Node.js instances           │
│              Port 5000                       │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────┐        ┌──────────────┐
│   MongoDB    │        │   AWS S3     │
│   Database   │        │ File Storage │
└──────────────┘        └──────────────┘
```

## Best Practices Implemented

### 1. Separation of Concerns
- Each layer has a single responsibility
- No mixing of concerns

### 2. DRY (Don't Repeat Yourself)
- Base repository for common operations
- Reusable middleware
- Utility functions

### 3. SOLID Principles
- **S**ingle Responsibility
- **O**pen/Closed
- **L**iskov Substitution
- **I**nterface Segregation
- **D**ependency Inversion

### 4. Error Handling
- Centralized error handling
- Custom error classes
- Async error wrapper

### 5. Type Safety
- TypeScript for type checking
- Interfaces for data structures
- Strict mode enabled

### 6. Security
- Helmet for security headers
- CORS configuration
- Rate limiting
- Input validation
- Environment variables

### 7. Performance
- Database indexing
- Response compression
- Pagination
- Connection pooling

### 8. Scalability
- PM2 cluster mode
- Stateless design
- Repository pattern allows easy database switching

## Testing Strategy

```
Unit Tests
  ↓
├── Repositories (mock Mongoose)
├── Services (mock repositories)
└── Controllers (mock services)

Integration Tests
  ↓
├── API endpoints
└── Database operations

E2E Tests
  ↓
└── Full request/response cycle
```

## Adding New Features

### Example: Adding a "User" feature

1. **Create Model** (`src/models/user.model.ts`)
   - Define schema and interface

2. **Create Repository** (`src/repositories/user.repository.ts`)
   - Extend BaseRepository
   - Add custom queries

3. **Create Service** (`src/services/user.service.ts`)
   - Implement business logic
   - Use repository for data access

4. **Create Controller** (`src/controllers/user.controller.ts`)
   - Handle HTTP requests
   - Call service methods

5. **Create Routes** (`src/routes/user.routes.ts`)
   - Define endpoints
   - Add validation

6. **Register Routes** (`src/routes/index.ts`)
   - Import and use routes

## Conclusion

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Easy to test
- ✅ Easy to maintain
- ✅ Easy to scale
- ✅ Easy to extend
- ✅ Production-ready
