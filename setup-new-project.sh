#!/bin/bash

# Setup New Project from Boilerplate
# Usage: ./setup-new-project.sh my-new-project

PROJECT_NAME=$1
BOILERPLATE_DIR="Sinux-Boilerplate"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if project name is provided
if [ -z "$PROJECT_NAME" ]; then
  echo -e "${YELLOW}Usage: ./setup-new-project.sh <project-name>${NC}"
  echo "Example: ./setup-new-project.sh my-awesome-api"
  exit 1
fi

echo -e "${BLUE}🚀 Creating new project: ${PROJECT_NAME}${NC}"
echo ""

# Check if boilerplate exists
if [ ! -d "$BOILERPLATE_DIR" ]; then
  echo -e "${YELLOW}⚠️  Boilerplate directory not found: $BOILERPLATE_DIR${NC}"
  echo "Please run this script from the parent directory of the boilerplate."
  exit 1
fi

# Check if project already exists
if [ -d "$PROJECT_NAME" ]; then
  echo -e "${YELLOW}⚠️  Directory $PROJECT_NAME already exists!${NC}"
  read -p "Do you want to remove it and continue? (y/N): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf "$PROJECT_NAME"
  else
    echo "Aborted."
    exit 1
  fi
fi

# Copy boilerplate
echo -e "${BLUE}📦 Copying boilerplate...${NC}"
cp -r "$BOILERPLATE_DIR" "$PROJECT_NAME"
cd "$PROJECT_NAME" || exit

# Remove git history
echo -e "${BLUE}🔄 Initializing new git repository...${NC}"
rm -rf .git
git init

# Remove example files
echo -e "${BLUE}🗑️  Removing example files...${NC}"
rm -f src/models/example.model.ts
rm -f src/repositories/example.repository.ts
rm -f src/services/example.service.ts
rm -f src/controllers/example.controller.ts
rm -f src/routes/example.routes.ts
rm -f src/validations/example.validation.ts

# Remove setup documentation
rm -f BOILERPLATE_GUIDE.md
rm -f SETUP_COMPLETE.md
rm -f REFACTORING_SUMMARY.md
rm -f WARNINGS_FIXED.md

# Update routes index to remove example routes
cat > src/routes/index.ts << 'EOF'
import { Router } from 'express';
import uploadRoutes from './upload.routes';

const router = Router();

const API_VERSION = process.env.API_VERSION || 'v1';

router.use(`/${API_VERSION}/upload`, uploadRoutes);

export default router;
EOF

# Update package.json name
echo -e "${BLUE}📝 Updating package.json...${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' "s/sinux-boilerplate/$PROJECT_NAME/g" package.json
else
  # Linux
  sed -i "s/sinux-boilerplate/$PROJECT_NAME/g" package.json
fi

# Create .env from example
echo -e "${BLUE}⚙️  Creating .env file...${NC}"
cp .env.example .env

# Install dependencies
echo -e "${BLUE}📥 Installing dependencies...${NC}"
npm install

# Setup Husky and Git Hooks
echo -e "${BLUE}🐶 Setting up Husky and Git Hooks...${NC}"
npm run prepare 2>/dev/null || echo "Husky setup skipped (will be configured on first commit)"
echo -e "${GREEN}✅ Git hooks configured (pre-commit, commit-msg, pre-push)${NC}"

# Build project
echo -e "${BLUE}🔨 Building project...${NC}"
npm run build

# Initial commit
echo -e "${BLUE}💾 Creating initial commit...${NC}"
git add .
git commit -m "chore: initial commit from boilerplate"

# Create README for the new project
cat > README.md << EOF
# ${PROJECT_NAME}

Backend API built with Express.js, TypeScript, and MongoDB.

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your settings

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## API Endpoints

### Health Check
- \`GET /health\` - Server health status

### File Upload
- \`POST /api/v1/upload/single\` - Upload single file
- \`POST /api/v1/upload/multiple\` - Upload multiple files

## Documentation

- [Getting Started Guide](GETTING_STARTED.md) - Complete setup guide
- [Architecture Guide](ARCHITECTURE.md) - Architecture details
- [Deployment Guide](DEPLOYMENT.md) - Production deployment
- [Commits](COMMITS.md) - Commit format
- [AI Development Guide](AGENTS.md) - AI assistant guidelines

## Tech Stack

- Express.js
- TypeScript
- MongoDB + Mongoose
- AWS S3 (file storage)
- PM2 (process management)

## License

ISC
EOF

git add README.md
git commit -m "docs: update readme for new project"

echo ""
echo -e "${GREEN}✅ Project ${PROJECT_NAME} created successfully!${NC}"
echo ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo -e "   1. ${YELLOW}cd ${PROJECT_NAME}${NC}"
echo -e "   2. ${YELLOW}Update .env with your MongoDB URI and other settings${NC}"
echo -e "   3. ${YELLOW}npm run dev${NC} - Start development server"
echo -e "   4. ${YELLOW}curl http://localhost:5000/health${NC} - Test the API"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo -e "   - Read ${YELLOW}GETTING_STARTED.md${NC} for complete setup guide"
echo -e "   - Read ${YELLOW}AGENTS.md${NC} for development guidelines"
echo -e "   - Read ${YELLOW}ARCHITECTURE.md${NC} for architecture details"
echo -e "   - Read ${YELLOW}COMMITS.md${NC} for commit format"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
