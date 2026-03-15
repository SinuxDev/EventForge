# Sinux Boilerplate

A production-ready Express.js backend boilerplate built with TypeScript, MongoDB, and Mongoose following industry best practices and SOLID principles.

## Features

- ✅ **TypeScript** - Full type safety and modern JavaScript features
- ✅ **Express.js** - Fast, unopinionated web framework
- ✅ **MongoDB & Mongoose** - Robust database with ODM
- ✅ **Error Handling** - Centralized error handling middleware
- ✅ **Validation** - Request validation with express-validator
- ✅ **Security** - Helmet, CORS, Rate Limiting
- ✅ **Logging** - Custom logger with different log levels
- ✅ **Environment Config** - dotenv for configuration management
- ✅ **Code Quality** - ESLint with TypeScript support
- ✅ **Hot Reload** - Nodemon for development

## Project Structure

```
src/
├── config/           # Configuration files (database, AWS, storage)
├── controllers/      # HTTP request/response handlers
├── middlewares/      # Custom middleware functions
├── models/          # Mongoose models and schemas
├── repositories/    # Data access layer (Repository Pattern)
├── routes/          # API route definitions
├── services/        # Business logic layer
├── types/           # TypeScript type definitions
├── utils/           # Utility functions and helpers
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## Clean Architecture

This project follows a **clean, layered architecture**:

1. **Routes** → Define endpoints and validation
2. **Controllers** → Handle HTTP requests/responses
3. **Services** → Implement business logic
4. **Repositories** → Abstract database operations
5. **Models** → Define data structure

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation.

## 🚀 Quick Start

**For detailed setup instructions, see [GETTING_STARTED.md](./GETTING_STARTED.md)**

### Option 1: New Project from Boilerplate

```bash
# Run automated setup script
./setup-new-project.sh my-new-project
cd my-new-project
cp .env.example .env
# Edit .env with your settings
npm run dev
```

### Option 2: Clone and Run

```bash
git clone <repository-url>
cd Sinux-Boilerplate
npm install
cp .env.example .env
# Edit .env with your settings
npm run dev
```

**📖 See [GETTING_STARTED.md](./GETTING_STARTED.md) for complete step-by-step guide**

5. Start MongoDB
```bash
# Make sure MongoDB is running on your system
mongod
```

6. Run the development server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production server

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Testing
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### PM2 (Production)
- `npm run start:pm2` - Start with PM2
- `npm run stop:pm2` - Stop PM2 processes
- `npm run restart:pm2` - Restart PM2 processes
- `npm run delete:pm2` - Delete from PM2
- `npm run logs:pm2` - View PM2 logs
- `npm run monit:pm2` - Monitor PM2 processes

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Example API (v1)
- `GET /api/v1/examples` - Get all examples
- `GET /api/v1/examples/:id` - Get example by ID
- `POST /api/v1/examples` - Create new example
- `PUT /api/v1/examples/:id` - Update example
- `DELETE /api/v1/examples/:id` - Delete example

### File Upload API (v1)
- `POST /api/v1/upload/single` - Upload single file
- `POST /api/v1/upload/multiple` - Upload multiple files (max 10)
- `DELETE /api/v1/upload/delete` - Delete file
- `GET /api/v1/upload/metadata` - Get file metadata

## Best Practices Implemented

### 1. Clean Architecture
- **Repository Pattern** for data access abstraction
- **Service Layer** for business logic
- **Controller Layer** for HTTP handling
- Clear separation of concerns
- Easy to test and maintain

### 2. Error Handling
- Centralized error handling middleware
- Custom AppError class for operational errors
- Async error handling with asyncHandler wrapper
- Mongoose error handling (ValidationError, CastError, etc.)

### 3. Database Connection
- Proper connection error handling
- Event listeners for connection states
- Graceful shutdown on process termination
- Repository pattern for query abstraction

### 4. File Storage
- **Development**: Local storage
- **Production**: AWS S3
- Automatic switching based on NODE_ENV
- Image optimization with Sharp
- File validation and size limits

### 5. Security
- Helmet for security headers
- CORS configuration
- Rate limiting to prevent abuse
- Input validation and sanitization
- Environment variable protection

### 6. Code Quality
- **Husky** for git hooks
- **Prettier** for code formatting
- **ESLint** for linting
- **TypeScript** for type safety
- Pre-commit and pre-push hooks

### 7. Deployment
- **PM2** for process management
- Cluster mode for scalability
- Graceful shutdown handling
- Auto-restart on crashes
- Log management

### 8. Validation
- Request validation using express-validator
- Custom validation middleware
- Schema-level validation with Mongoose

### 9. Response Formatting
- Consistent API response structure
- Success and error response helpers
- Proper HTTP status codes

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/sinux-boilerplate |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRE | JWT expiration time | 7d |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:3000 |
| RATE_LIMIT_WINDOW_MS | Rate limit window | 900000 |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions to AWS Lightsail with PM2.

### Quick Deploy

```bash
# Build application
npm run build

# Start with PM2
npm run start:pm2

# View logs
npm run logs:pm2
```

## File Upload Examples

### Upload Single File

```bash
curl -X POST http://localhost:5000/api/v1/upload/single \
  -F "file=@/path/to/image.jpg"
```

### Upload Multiple Files

```bash
curl -X POST http://localhost:5000/api/v1/upload/multiple \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg"
```

## Git Hooks (Husky)

This project uses Husky for automated git hooks:

- **pre-commit**: Runs lint-staged (ESLint + Prettier on staged files)
- **commit-msg**: Validates commit message format (Conventional Commits)
- **pre-push**: Runs linting and build to ensure code quality

### Commit Message Format

All commits must follow the Conventional Commits specification:

```bash
<type>(<scope>): <subject>

# Examples:
git commit -m "feat(auth): add JWT refresh token"
git commit -m "fix(validation): correct email regex"
git commit -m "docs: update API documentation"
```

See [COMMITS.md](COMMITS.md) for commit format. Use `npm run commit` for interactive helper.

### Setup Husky

```bash
npm run prepare
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Husky will automatically run checks on commit/push
4. Submit a pull request

## 📚 Documentation

**[DOCS.md](./DOCS.md)** - Documentation index

**Quick Links:**
- [GETTING_STARTED.md](./GETTING_STARTED.md) - Setup guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture
- [AGENTS.md](./AGENTS.md) - Development guidelines
- [COMMITS.md](./COMMITS.md) - Commit format
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment

## 🎯 Using as Boilerplate

This project is designed to be a **reusable boilerplate** for future Express.js + TypeScript + MongoDB projects!

### Quick Start with Boilerplate

```bash
# Copy to new project
cp -r Sinux-Boilerplate My-New-Project
cd My-New-Project

# Initialize
npm install
cp .env.example .env
npm run dev
```

### Automated Setup (Linux/Mac)

```bash
# Make script executable
chmod +x setup-new-project.sh

# Create new project
./setup-new-project.sh my-awesome-api
```

**See [BOILERPLATE_GUIDE.md](BOILERPLATE_GUIDE.md) for complete instructions.**

### What You Get
- ✅ Production-ready architecture
- ✅ Clean code patterns (SOLID principles)
- ✅ File uploads (S3/Local)
- ✅ Validation system
- ✅ Error handling
- ✅ Security (Helmet, CORS, Rate Limiting)
- ✅ PM2 deployment ready
- ✅ Comprehensive documentation

**Save 2-3 days of setup time!** 🚀

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting pull requests.

## License

ISC
