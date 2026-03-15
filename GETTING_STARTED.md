# Getting Started with Sinux Boilerplate 🚀

Complete step-by-step guide to set up and use this Express.js + TypeScript + MongoDB backend boilerplate.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Option A: Use as Boilerplate for New Project](#option-a-use-as-boilerplate-for-new-project)
3. [Option B: Clone and Run Directly](#option-b-clone-and-run-directly)
4. [Environment Configuration](#environment-configuration)
5. [Running the Project](#running-the-project)
6. [Git Hooks Setup](#git-hooks-setup)
7. [Development Workflow](#development-workflow)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required

- **Node.js** (v18 or higher)

  ```bash
  node --version  # Should be v18.x or higher
  ```

- **npm** (v9 or higher)

  ```bash
  npm --version   # Should be v9.x or higher
  ```

- **MongoDB** (v6 or higher)

  ```bash
  mongod --version  # Should be v6.x or higher
  ```

- **Git**
  ```bash
  git --version
  ```

### Optional (for production)

- **PM2** (Process Manager)

  ```bash
  npm install -g pm2
  ```

- **AWS CLI** (for S3 file storage)
  ```bash
  aws --version
  ```

---

## Option A: Use as Boilerplate for New Project

Use this option when starting a **new project** from the boilerplate.

### Step 1: Clone the Boilerplate

```bash
# Clone to a temporary location
git clone <boilerplate-repo-url> Sinux-Boilerplate
cd ..
```

### Step 2: Run Setup Script

```bash
# Run the automated setup script
./Sinux-Boilerplate/setup-new-project.sh my-new-project
```

**What the script does:**

- ✅ Creates new project directory
- ✅ Copies all boilerplate files
- ✅ Initializes new Git repository
- ✅ Removes example code
- ✅ Updates package.json with your project name
- ✅ Installs dependencies
- ✅ Sets up Husky git hooks
- ✅ Builds the project
- ✅ Creates initial commit

### Step 3: Configure Environment

```bash
cd my-new-project

# Copy environment template
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your preferred editor
```

Update these values in `.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/my-new-project
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### Step 4: Start MongoDB

```bash
# Start MongoDB service
mongod

# Or if using MongoDB as a service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### Step 5: Run the Project

```bash
# Development mode with hot reload
npm run dev

# You should see:
# 🚀 Server is running on port 5000
# ✅ MongoDB connected successfully
```

### Step 6: Test the API

```bash
# Test health endpoint
curl http://localhost:5000/health

# Expected response:
# {"success":true,"message":"Server is healthy","timestamp":"..."}
```

### Step 7: Setup Git Config (Optional)

```bash
# Setup commit message template
./setup-git-config.sh
```

**✅ You're all set! Start building your features.**

---

## Option B: Clone and Run Directly

Use this option to **explore** or **contribute** to the boilerplate.

### Step 1: Clone Repository

```bash
git clone <boilerplate-repo-url>
cd Yangon-Broom-Backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:

- Production dependencies (Express, Mongoose, etc.)
- Development dependencies (TypeScript, ESLint, etc.)
- Git hooks (Husky)

### Step 3: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env
nano .env
```

Update these values:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sinux-boilerplate
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000

# AWS S3 (optional - for production file storage)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

### Step 4: Start MongoDB

```bash
# Start MongoDB
mongod

# Verify it's running
mongo --eval "db.version()"
```

### Step 5: Build the Project

```bash
# Compile TypeScript to JavaScript
npm run build

# This creates the 'dist' folder with compiled code
```

### Step 6: Run Development Server

```bash
# Start with hot reload
npm run dev

# You should see:
# 🚀 Server is running on port 5000
# ✅ MongoDB connected successfully
```

### Step 7: Verify Installation

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test file upload endpoint
curl -X POST http://localhost:5000/api/v1/upload/single \
  -F "file=@/path/to/image.jpg"
```

**✅ Development environment is ready!**

---

## Environment Configuration

### Required Variables

```env
# Server Configuration
NODE_ENV=development          # development | production
PORT=5000                     # Server port

# Database
MONGODB_URI=mongodb://localhost:27017/sinux-boilerplate

# JWT Authentication
JWT_SECRET=your-secret-key    # CHANGE THIS!
JWT_EXPIRE=7d                 # Token expiration

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Optional Variables

```env
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000   # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100   # Max requests per window

# AWS S3 (Production file storage)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket
```

### Environment-Specific Behavior

**Development (`NODE_ENV=development`)**:

- Files stored locally in `uploads/` folder
- Detailed error messages
- Morgan logging enabled
- CORS allows configured origin

**Production (`NODE_ENV=production`)**:

- Files stored in AWS S3
- Generic error messages
- Production-ready logging
- Strict CORS policy

---

## Running the Project

### Development Mode

```bash
# Start with hot reload (recommended for development)
npm run dev

# Server restarts automatically when you save files
```

### Production Mode

```bash
# Build TypeScript
npm run build

# Start production server
npm start

# Or use PM2 (recommended)
npm run start:pm2
```

### PM2 Commands

```bash
# Start with PM2
npm run start:pm2

# View logs
npm run logs:pm2

# Monitor
npm run monit:pm2

# Restart
npm run restart:pm2

# Stop
npm run stop:pm2

# Delete from PM2
npm run delete:pm2
```

---

## Git Hooks Setup

Git hooks are automatically installed when you run `npm install`.

### What's Configured

**Pre-commit Hook**:

- ✅ Lints staged files with ESLint
- ✅ Formats code with Prettier
- ✅ Auto-fixes issues

**Commit-msg Hook**:

- ✅ Validates commit message format
- ✅ Enforces Conventional Commits
- ✅ Rejects invalid messages

**Pre-push Hook**:

- ✅ Runs full ESLint check
- ✅ Runs TypeScript build
- ✅ Prevents pushing broken code

### Setup Git Template (Optional)

```bash
# Setup commit message template
./setup-git-config.sh

# Now 'git commit' (without -m) shows helpful template
```

### Commit Message Format

```bash
# Format: <type>(<scope>): <subject>

# Examples:
git commit -m "feat(auth): add JWT authentication"
git commit -m "fix(user): resolve email validation bug"
git commit -m "docs: update API documentation"

# Or use interactive helper:
npm run commit
```

**Valid types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

See [COMMITS.md](./COMMITS.md) for details.

---

## Development Workflow

### 1. Create a New Feature

```bash
# Create feature branch
git checkout -b feature/user-authentication

# Make changes
vim src/services/auth.service.ts

# Test your changes
npm run dev

# Build to check for errors
npm run build
```

### 2. Commit Your Changes

```bash
# Option 1: Interactive helper (recommended)
npm run commit

# Option 2: Direct commit
git commit -m "feat(auth): add user authentication"

# Hooks will automatically:
# - Lint and format your code
# - Validate commit message
```

### 3. Push Your Changes

```bash
# Push to remote
git push origin feature/user-authentication

# Pre-push hook will:
# - Run full linting
# - Run TypeScript build
# - Prevent push if errors found
```

### 4. Create Pull Request

- Create PR on GitHub/GitLab
- Hooks ensure code quality
- Review and merge

---

## Testing

### Run Tests

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch
```

### Linting

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

### Formatting

```bash
# Check code formatting
npm run format:check

# Format all files
npm run format
```

### Manual Testing

```bash
# Health check
curl http://localhost:5000/health

# Upload single file
curl -X POST http://localhost:5000/api/v1/upload/single \
  -F "file=@image.jpg"

# Upload multiple files
curl -X POST http://localhost:5000/api/v1/upload/multiple \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg"
```

---

## Deployment

### Deploy to AWS Lightsail with PM2

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Steps

```bash
# 1. Build application
npm run build

# 2. Start with PM2
npm run start:pm2

# 3. Setup Nginx (see DEPLOYMENT.md)

# 4. Configure SSL with Let's Encrypt (see DEPLOYMENT.md)
```

### Environment Setup

```bash
# Production environment
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=your-production-bucket
```

---

## Troubleshooting

### MongoDB Connection Error

```bash
# Error: MongooseError: Operation buffering timed out

# Solution 1: Check if MongoDB is running
mongod

# Solution 2: Check MONGODB_URI in .env
MONGODB_URI=mongodb://localhost:27017/sinux-boilerplate

# Solution 3: Check MongoDB service
sudo systemctl status mongod  # Linux
brew services list  # macOS
```

### Port Already in Use

```bash
# Error: Port 5000 is already in use

# Solution 1: Kill process using port
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5000 | xargs kill -9

# Solution 2: Change port in .env
PORT=5001
```

### TypeScript Build Errors

```bash
# Error: Cannot find module or Type errors

# Solution 1: Clean and rebuild
rm -rf dist node_modules
npm install
npm run build

# Solution 2: Check TypeScript version
npm list typescript

# Solution 3: Update dependencies
npm update
```

### Git Hooks Not Running

```bash
# Solution 1: Reinstall Husky
npm run prepare

# Solution 2: Make hooks executable (Linux/Mac)
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x .husky/pre-push

# Solution 3: Check Husky installation
ls -la .husky/
```

### Commit Message Rejected

```bash
# Error: subject may not be empty [subject-empty]

# Solution: Use correct format
git commit -m "feat(scope): add feature description"

# Not: "Added feature" or "add feature"

# Or use interactive helper:
npm run commit
```

### File Upload Errors

```bash
# Error: File upload failed

# Solution 1: Check uploads directory exists (development)
mkdir -p uploads

# Solution 2: Check AWS credentials (production)
# Verify .env has correct AWS keys

# Solution 3: Check file size limits
# Default: 5MB for images, 10MB for documents
```

---

## 📚 Additional Documentation

- **[README.md](./README.md)** - Project overview
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture details
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide
- **[COMMITS.md](./COMMITS.md)** - Commit format and guidelines
- **[VALIDATION_GUIDE.md](./VALIDATION_GUIDE.md)** - Validation patterns
- **[UPLOAD_USAGE.md](./UPLOAD_USAGE.md)** - File upload guide
- **[AGENTS.md](./AGENTS.md)** - AI development guide
- **[AI_PROMPTS.md](./AI_PROMPTS.md)** - AI prompts
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines

---

## 🎯 Quick Reference

### Essential Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build TypeScript
npm test                 # Run tests

# Linting & Formatting
npm run lint             # Check linting
npm run lint:fix         # Fix linting
npm run format           # Format code

# Git
npm run commit           # Interactive commit
git commit -m "type: msg" # Quick commit
git push                 # Push (runs build)

# Production
npm start                # Start production
npm run start:pm2        # Start with PM2
npm run logs:pm2         # View logs
```

### Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # HTTP request handlers
├── middlewares/     # Express middlewares
├── models/          # Mongoose models
├── repositories/    # Database operations
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── validations/     # Validation schemas
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

### API Endpoints

```
GET  /health                        # Health check
POST /api/v1/upload/single          # Upload single file
POST /api/v1/upload/multiple        # Upload multiple files
GET  /api/v1/upload/metadata/:key   # Get file metadata
DELETE /api/v1/upload/:key          # Delete file
```

---

## 🆘 Need Help?

1. Check [Troubleshooting](#troubleshooting) section
2. Review documentation in the links above
3. Check existing issues in the repository
4. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)

---

## ✅ Checklist

### Initial Setup

- [ ] Node.js v18+ installed
- [ ] MongoDB installed and running
- [ ] Project cloned or created from boilerplate
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] Build successful (`npm run build`)
- [ ] Dev server running (`npm run dev`)
- [ ] Health endpoint working

### Git Setup

- [ ] Git hooks installed (automatic with `npm install`)
- [ ] Commit message template setup (optional: `./setup-git-config.sh`)
- [ ] First commit made with conventional format

### Development Ready

- [ ] MongoDB connected
- [ ] API endpoints responding
- [ ] File upload working
- [ ] Linting passing
- [ ] Tests passing

---

**🎉 Congratulations! You're ready to build amazing APIs!**

**Next Steps:**

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the structure
2. Check [AGENTS.md](./AGENTS.md) for development guidelines
3. Start building your features!

**Happy Coding! 🚀**
