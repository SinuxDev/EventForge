# EventForge — Backend API

REST API for EventForge, a modern knowledge-sharing event platform. Built with Express.js, TypeScript, and MongoDB following Clean Architecture and SOLID principles.

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

### Authentication (planned)

```
POST   /api/v1/auth/register         — Register a new user
POST   /api/v1/auth/login            — Login and receive JWT tokens
POST   /api/v1/auth/refresh          — Refresh access token
POST   /api/v1/auth/forgot-password  — Request password reset email
POST   /api/v1/auth/reset-password   — Reset password via token
GET    /api/v1/auth/me               — Get current user profile
```

### Events (planned)

```
GET    /api/v1/events                — List/search/filter events
GET    /api/v1/events/:id            — Get single event detail
POST   /api/v1/events                — Create event (Organizer)
PUT    /api/v1/events/:id            — Update event (Organizer, owner)
DELETE /api/v1/events/:id            — Delete event (Organizer, owner)
GET    /api/v1/events/:id/attendees  — Get guest list (Organizer, owner)
```

### RSVP & Ticketing (planned)

```
POST   /api/v1/events/:id/rsvp       — Submit RSVP (Attendee)
GET    /api/v1/rsvps/my              — Get my RSVPs (Attendee)
DELETE /api/v1/rsvps/:id             — Cancel RSVP (Attendee)
GET    /api/v1/rsvps/:id/ticket      — Download QR ticket (Attendee)
```

### QR Check-in (planned)

```
POST   /api/v1/events/:id/check-in   — Validate QR and check in (Organizer)
GET    /api/v1/events/:id/attendance — Real-time attendance status (Organizer)
```

### Organizer Dashboard (planned)

```
GET    /api/v1/organizer/dashboard                              — Event overview with RSVP stats
GET    /api/v1/organizer/events/:id/analytics                   — Event analytics
GET    /api/v1/organizer/events/:id/waitlist                    — Waitlist for event
POST   /api/v1/organizer/events/:id/waitlist/:rsvpId/approve    — Manually approve waitlist entry
POST   /api/v1/organizer/events/:id/announce                    — Send email to all RSVPs
GET    /api/v1/organizer/events/:id/export                      — Export attendance CSV
```

### Admin Panel (planned)

```
GET    /api/v1/admin/analytics             — Platform-wide analytics
GET    /api/v1/admin/users                 — List/search users
PATCH  /api/v1/admin/users/:id/suspend     — Suspend or unsuspend user
GET    /api/v1/admin/categories            — List categories
POST   /api/v1/admin/categories            — Create category
PUT    /api/v1/admin/categories/:id        — Update category
DELETE /api/v1/admin/categories/:id        — Delete category
GET    /api/v1/admin/reports/export        — Export platform report CSV
```

### File Upload

```
POST   /api/v1/upload/single     — Upload a single file
POST   /api/v1/upload/multiple   — Upload up to 10 files
DELETE /api/v1/upload/delete     — Delete a file by URL
GET    /api/v1/upload/metadata   — Get file metadata
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
