# Contributing Guide

Thank you for considering contributing to the Sinux Boilerplate project! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Architecture Guidelines](#architecture-guidelines)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 6+
- Git
- Code editor (VS Code recommended)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Sinux-Boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Husky**
   ```bash
   npm run prepare
   ```

4. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

5. **Start MongoDB**
   ```bash
   mongod
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Test additions/updates

### 2. Make Changes

- Follow the architecture guidelines in [AGENTS.md](AGENTS.md)
- Write clean, readable code
- Add comments for complex logic only
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run tests
npm test

# Build to check for TypeScript errors
npm run build
```

### 4. Commit Changes

Husky will automatically run pre-commit hooks:
- Lint staged files
- Format code with Prettier

```bash
git add .
git commit -m "feat: add user authentication"
```

### 5. Push Changes

```bash
git push origin feature/your-feature-name
```

Husky will run pre-push hooks:
- Full linting
- TypeScript build

## Architecture Guidelines

### Layer Structure

```
Routes → Controllers → Services → Repositories → Models
```

**Critical Rules**:
- ✅ Controllers handle HTTP only (no business logic)
- ✅ Services contain business logic (no HTTP concerns)
- ✅ Repositories handle data access (no business logic)
- ✅ Models define schema and validation

See [AGENTS.md](AGENTS.md) for detailed guidelines.

### Adding a New Feature

1. **Create Model** (`src/models/`)
   - Define TypeScript interface
   - Create Mongoose schema
   - Add validation and indexes

2. **Create Repository** (`src/repositories/`)
   - Extend BaseRepository
   - Add custom query methods

3. **Create Service** (`src/services/`)
   - Implement business logic
   - Use repository for data access

4. **Create Controller** (`src/controllers/`)
   - Handle HTTP requests/responses
   - Use asyncHandler wrapper
   - Use ApiResponse for responses

5. **Create Routes** (`src/routes/`)
   - Define endpoints
   - Add validation middleware
   - Register in routes/index.ts

6. **Update Documentation**
   - Add API endpoints to README.md
   - Update relevant documentation

## Code Standards

### TypeScript

```typescript
// ✅ Good
interface IUser extends Document {
  name: string;
  email: string;
}

const user: IUser = await userService.create(data);

// ❌ Bad
const user: any = await userService.create(data);
```

### Error Handling

```typescript
// ✅ Good
import { AppError } from '../utils/AppError';

if (!user) {
  throw new AppError('User not found', 404);
}

// ❌ Bad
if (!user) {
  return res.status(404).json({ error: 'User not found' });
}
```

### Response Formatting

```typescript
// ✅ Good
import { ApiResponse } from '../utils/response';

ApiResponse.success(res, data, 'Success message');

// ❌ Bad
res.json({ success: true, data: data });
```

### Async Handlers

```typescript
// ✅ Good
import { asyncHandler } from '../middlewares/asyncHandler';

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getById(req.params.id);
  ApiResponse.success(res, user);
});

// ❌ Bad
export const getUser = async (req, res) => {
  try {
    const user = await userService.getById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Validation

```typescript
// ✅ Good
import { validateRequest } from '../middlewares/validateRequest';
import { body } from 'express-validator';

router.post(
  '/',
  validateRequest([
    body('email').isEmail().normalizeEmail(),
    body('age').isInt({ min: 18 }),
  ]),
  controller.create
);

// ❌ Bad
router.post('/', controller.create); // No validation
```

## Testing

### Unit Tests

Test services with mocked repositories:

```typescript
describe('UserService', () => {
  it('should create a user', async () => {
    const userData = { name: 'Test', email: 'test@example.com' };
    const user = await userService.create(userData);
    expect(user.name).toBe('Test');
  });
});
```

### Integration Tests

Test API endpoints:

```typescript
describe('POST /api/v1/users', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({ name: 'Test', email: 'test@example.com' })
      .expect(201);

    expect(response.body.data.name).toBe('Test');
  });
});
```

## Commit Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat: add user authentication

feat(auth): implement JWT token generation
fix(user): resolve email validation bug
docs: update API documentation
refactor(service): improve error handling
test: add user service tests
chore: update dependencies
```

### Commit Message Rules

- Use present tense ("add" not "added")
- Use imperative mood ("move" not "moves")
- Limit first line to 72 characters
- Reference issues and PRs when relevant

## Pull Request Process

### Before Submitting

1. ✅ All tests pass
2. ✅ Code is linted and formatted
3. ✅ No TypeScript errors
4. ✅ Documentation is updated
5. ✅ Commits follow conventions
6. ✅ Branch is up to date with main

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project architecture
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass locally
```

### Review Process

1. **Automated Checks**: CI/CD runs tests and linting
2. **Code Review**: Maintainers review code
3. **Feedback**: Address review comments
4. **Approval**: Get approval from maintainers
5. **Merge**: Maintainer merges PR

### Review Criteria

- ✅ Follows architecture guidelines
- ✅ Code is clean and readable
- ✅ Proper error handling
- ✅ Tests are included
- ✅ Documentation is updated
- ✅ No breaking changes (or properly documented)

## Common Issues

### Husky Hooks Failing

```bash
# Reinstall Husky
npm run prepare

# Make hooks executable (Linux/Mac)
chmod +x .husky/*
```

### Linting Errors

```bash
# Auto-fix most issues
npm run lint:fix
npm run format
```

### TypeScript Errors

```bash
# Check for errors
npm run build

# Common fixes:
# - Add proper types
# - Import missing types
# - Fix interface definitions
```

### MongoDB Connection Issues

```bash
# Check MongoDB is running
mongod

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/sinux-boilerplate
```

## Getting Help

- 📖 Read [AGENTS.md](AGENTS.md) for architecture guidelines
- 📖 Read [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture
- 📖 Check existing code for patterns
- 💬 Ask questions in issues or discussions
- 🐛 Report bugs with detailed information

## Resources

- [AGENTS.md](AGENTS.md) - Development guidelines
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture details
- [UPLOAD_USAGE.md](UPLOAD_USAGE.md) - File upload guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [AI_PROMPTS.md](AI_PROMPTS.md) - AI assistant prompts

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing! 🎉
