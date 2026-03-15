# EventForge Backend API

Production-ready REST API for the EventForge knowledge-sharing event platform, built with Express.js, TypeScript, and MongoDB following Clean Architecture and SOLID principles.

## Tech Stack

- **Runtime**: Node.js + Express.js
- **Language**: TypeScript 5.x (strict mode)
- **Database**: MongoDB Atlas + Mongoose 8.x
- **Storage**: AWS S3 (production) / Local (development)
- **Process Manager**: PM2

## Architecture

Strict layered architecture — no layer may skip a level:

```
Routes → Controllers → Services → Repositories → Models → Database
```

| Layer | Responsibility |
|---|---|
| Routes | Define endpoints, apply middleware and validation |
| Controllers | Handle HTTP requests/responses only |
| Services | Business logic and orchestration |
| Repositories | Data access, database queries |
| Models | Mongoose schemas and interfaces |

See [ARCHITECTURE.md](ARCHITECTURE.md) for full details.

## Project Structure

```
src/
├── config/          # Database, AWS, and storage configuration
├── controllers/     # HTTP request/response handlers
├── middlewares/     # asyncHandler, errorHandler, validateRequest, etc.
├── models/          # Mongoose models and TypeScript interfaces
├── repositories/    # Data access layer (Repository Pattern)
├── routes/          # API route definitions
├── services/        # Business logic layer
├── types/           # Shared TypeScript type definitions
├── utils/           # AppError, logger, response helpers
├── validations/     # express-validator schemas
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## Quick Start

### Prerequisites

- Node.js 20+
- MongoDB Atlas connection string (or local MongoDB)

### Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.

# Start development server
npm run dev
```

The server starts on `http://localhost:5000`.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Development server with hot reload (nodemon) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format source with Prettier |
| `npm test` | Run Jest test suite with coverage |
| `npm run start:pm2` | Start with PM2 process manager |

## API Endpoints

### Health Check

```
GET /health
```

### File Upload (v1)

```
POST   /api/v1/upload/single    — Upload a single file
POST   /api/v1/upload/multiple  — Upload up to 10 files
DELETE /api/v1/upload/delete    — Delete a file by URL
GET    /api/v1/upload/metadata  — Get file metadata
```

## Key Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | `development` or `production` | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/eventforge` |
| `JWT_SECRET` | JWT signing secret | — |
| `JWT_EXPIRE` | JWT expiry duration | `7d` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:3000` |
| `AWS_ACCESS_KEY_ID` | AWS credentials (production) | — |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials (production) | — |
| `AWS_S3_BUCKET` | S3 bucket name (production) | — |

## Git Hooks

Husky enforces quality gates automatically:

- **pre-commit**: ESLint + Prettier on staged `.ts` files
- **commit-msg**: Validates Conventional Commits format
- **pre-push**: Full ESLint check + TypeScript build

All commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat(auth): add JWT refresh token rotation
fix(events): resolve date timezone handling
docs: update deployment guide
```

## Development Guidelines

See [AGENTS.md](AGENTS.md) for the full AI/developer coding standards (SOLID, DRY, KISS, YAGNI, error handling patterns, naming conventions, and more).

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for AWS Lightsail + PM2 deployment instructions.
