# AI Development Prompts

This document contains useful prompts for AI assistants when working on this project. Copy and paste these prompts to get better results from AI tools.

## General Development Prompts

### Adding a New Feature

```
I need to add a new feature called [FEATURE_NAME] to this Express.js + TypeScript + MongoDB backend.

Requirements:
- [List your requirements]

Please follow the clean architecture pattern with:
1. Model with proper TypeScript interface and Mongoose schema
2. Repository extending BaseRepository
3. Service with business logic
4. Controller with HTTP handling
5. Routes with validation

Follow the patterns in AGENTS.md and use the existing code structure.
```

### Code Review

```
Please review this code following the project's architecture guidelines in AGENTS.md:

[PASTE YOUR CODE]

Check for:
1. Proper layer separation (Controller → Service → Repository → Model)
2. Error handling with AppError and asyncHandler
3. TypeScript types and interfaces
4. Validation patterns
5. Response formatting with ApiResponse
6. Security best practices
```

### Refactoring

```
Please refactor this code to follow the clean architecture pattern described in AGENTS.md:

[PASTE YOUR CODE]

Ensure:
- Controllers only handle HTTP
- Services contain business logic
- Repositories handle data access
- Proper error handling
- TypeScript types
```

## Feature-Specific Prompts

### Authentication System

```
Add JWT-based authentication to this backend following the architecture in AGENTS.md.

Requirements:
- User registration with email and password
- Login with JWT token generation
- Password hashing with bcrypt
- Protected routes middleware
- Refresh token support

Use the existing:
- Repository pattern for data access
- AppError for error handling
- ApiResponse for responses
- Validation middleware
```

### CRUD with File Upload

```
Create a [RESOURCE_NAME] CRUD API with image upload support.

Requirements:
- Full CRUD operations
- Image upload (single/multiple)
- Validation
- Pagination

Use:
- Repository pattern
- uploadImages middleware from storage.config
- processUploadedFile helper
- Existing validation patterns
```

### Pagination and Filtering

```
Add pagination and filtering to the [RESOURCE_NAME] list endpoint.

Requirements:
- Page and limit query parameters
- Sorting (asc/desc)
- Filtering by [FIELDS]
- Search functionality

Use the findWithPagination method from BaseRepository.
```

### Relationships

```
Create a relationship between [MODEL_A] and [MODEL_B].

Relationship type: [One-to-Many / Many-to-Many]

Requirements:
- Proper schema references
- Population in queries
- Cascade delete if needed

Follow the patterns in AGENTS.md for relationships.
```

## Database Prompts

### Schema Design

```
Design a Mongoose schema for [ENTITY_NAME] with the following fields:
[LIST FIELDS]

Requirements:
- TypeScript interface
- Proper validation
- Indexes for performance
- Timestamps
- toJSON transformation
- Pre/post hooks if needed

Follow the pattern in AGENTS.md.
```

### Migration

```
I need to add a new field [FIELD_NAME] to the [MODEL_NAME] schema.

Please provide:
1. Updated schema
2. Migration strategy for existing documents
3. Repository method updates if needed
```

### Aggregation Query

```
Create an aggregation query in the [REPOSITORY_NAME] to:
[DESCRIBE WHAT YOU NEED]

Return the result in a format suitable for the API response.
```

## Testing Prompts

### Unit Tests

```
Write unit tests for the [SERVICE_NAME] service.

Test cases:
- [List test cases]

Use Jest and mock the repository layer.
```

### Integration Tests

```
Write integration tests for the [ENDPOINT] API endpoint.

Test:
- Success cases
- Error cases
- Validation
- Authentication (if applicable)
```

## Debugging Prompts

### Error Investigation

```
I'm getting this error:
[PASTE ERROR]

In this code:
[PASTE CODE]

Please help debug this following the error handling patterns in AGENTS.md.
```

### Performance Optimization

```
This query is slow:
[PASTE QUERY]

Please optimize it considering:
- Indexes
- Query structure
- Pagination
- Field selection
```

## Documentation Prompts

### API Documentation

```
Generate API documentation for these endpoints:
[PASTE ROUTES]

Include:
- Endpoint description
- Request parameters
- Request body schema
- Response format
- Error responses
- Example requests
```

### Code Comments

```
Add clear, concise comments to this code explaining the business logic:
[PASTE CODE]

Follow the project's commenting standards (only for non-obvious logic).
```

## Deployment Prompts

### Environment Setup

```
I need to add a new environment variable [VAR_NAME] for [PURPOSE].

Please:
1. Add to .env.example
2. Update relevant config files
3. Document in DEPLOYMENT.md if needed
4. Show usage example
```

### PM2 Configuration

```
Update the PM2 configuration for:
[DESCRIBE CHANGE]

Ensure it works with the existing ecosystem.config.js.
```

## Security Prompts

### Security Audit

```
Audit this code for security issues:
[PASTE CODE]

Check for:
- SQL/NoSQL injection
- XSS vulnerabilities
- Authentication issues
- Authorization issues
- Data exposure
- Rate limiting
```

### Input Sanitization

```
Add proper input validation and sanitization for this endpoint:
[PASTE ENDPOINT CODE]

Use express-validator following the patterns in AGENTS.md.
```

## Advanced Prompts

### Microservice Extraction

```
I want to extract [FEATURE] into a separate microservice.

Current structure:
[DESCRIBE CURRENT STRUCTURE]

Please provide:
1. New service structure
2. API communication pattern
3. Database considerations
4. Deployment strategy
```

### Real-time Features

```
Add real-time functionality to [FEATURE] using WebSockets.

Requirements:
- [LIST REQUIREMENTS]

Integrate with the existing Express.js architecture.
```

### Caching Strategy

```
Implement caching for [ENDPOINT/FEATURE].

Requirements:
- Cache invalidation strategy
- TTL configuration
- Redis integration (if needed)

Follow the existing architecture patterns.
```

## Context-Aware Prompts

### With Project Context

```
Based on the architecture in AGENTS.md and the existing codebase structure, [YOUR REQUEST].

Ensure consistency with:
- Existing naming conventions
- Error handling patterns
- Response formats
- Validation patterns
```

### With File References

```
Looking at [FILE_PATH], I need to [YOUR REQUEST].

Follow the same patterns and structure used in this file.
```

## Prompt Templates

### Feature Request Template

```
**Feature**: [Name]

**Description**: [What it does]

**Requirements**:
1. [Requirement 1]
2. [Requirement 2]

**Acceptance Criteria**:
- [ ] [Criteria 1]
- [ ] [Criteria 2]

**Technical Considerations**:
- Follow architecture in AGENTS.md
- Use existing patterns
- Include validation
- Add error handling
- Update documentation

**Files to Create/Modify**:
- [ ] Model
- [ ] Repository
- [ ] Service
- [ ] Controller
- [ ] Routes
- [ ] Tests
```

### Bug Fix Template

```
**Bug**: [Description]

**Current Behavior**: [What happens]

**Expected Behavior**: [What should happen]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]

**Code Location**: [File and line number]

**Error Message**: [If any]

**Environment**: [Development/Production]

Please fix following the project's error handling patterns.
```

### Refactoring Template

```
**Target**: [Code to refactor]

**Current Issues**:
- [Issue 1]
- [Issue 2]

**Goals**:
- [Goal 1]
- [Goal 2]

**Constraints**:
- Must maintain backward compatibility
- Follow architecture in AGENTS.md
- Keep existing tests passing

Please refactor and explain the changes.
```

## AI Tool Specific Prompts

### Cursor IDE

```
@workspace I need to [YOUR REQUEST] following the architecture patterns in @AGENTS.md

Consider the existing code structure in @src and maintain consistency.
```

### GitHub Copilot

```
// Following the pattern in AGENTS.md, create [FEATURE]
// Requirements: [LIST]
```

### ChatGPT / Claude

```
I'm working on an Express.js + TypeScript + MongoDB backend with clean architecture.

Architecture: Routes → Controllers → Services → Repositories → Models

[YOUR REQUEST]

Follow the guidelines in this document: [PASTE AGENTS.md RELEVANT SECTION]
```

## Tips for Better AI Responses

1. **Be Specific**: Include exact requirements and constraints
2. **Provide Context**: Reference existing files and patterns
3. **Show Examples**: Include code snippets of desired patterns
4. **Set Boundaries**: Specify what should NOT be changed
5. **Request Explanations**: Ask for reasoning behind suggestions
6. **Iterate**: Refine prompts based on responses

## Example Conversation Flow

```
You: "I need to add a Product CRUD API with image upload"

AI: [Generates code]

You: "Good, but please use the uploadImages middleware from storage.config 
     and follow the exact pattern in example.routes.ts"

AI: [Refines code]

You: "Perfect! Now add validation for price (must be positive number) 
     and stock (must be integer >= 0)"

AI: [Adds validation]

You: "Great! Can you also add a search endpoint that filters by name 
     and category with pagination?"

AI: [Adds search feature]
```

## Common Mistakes to Avoid in Prompts

❌ **Too Vague**: "Add user management"  
✅ **Specific**: "Add user CRUD with email/password authentication, role-based access, and profile image upload"

❌ **No Context**: "Create a service"  
✅ **With Context**: "Create a UserService following the pattern in example.service.ts with business logic for user management"

❌ **Missing Constraints**: "Add authentication"  
✅ **With Constraints**: "Add JWT authentication using the existing error handling (AppError) and response formatting (ApiResponse) patterns"

## Useful Follow-up Questions

After receiving AI-generated code, ask:

1. "Does this follow the architecture in AGENTS.md?"
2. "Are there any security concerns?"
3. "How would this handle [EDGE_CASE]?"
4. "Can you add error handling for [SCENARIO]?"
5. "How would I test this?"
6. "What are the performance implications?"
7. "Is this code reusable?"

## Resources

- [AGENTS.md](AGENTS.md) - Main development guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture details
- [UPLOAD_USAGE.md](UPLOAD_USAGE.md) - File upload guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide

---

**Pro Tip**: Save your most-used prompts in a personal snippet library for quick access!
