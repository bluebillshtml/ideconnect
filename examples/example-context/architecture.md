# Architecture

## System Design

Three-tier architecture:
- **Frontend**: React SPA with TypeScript
- **Backend**: Node.js/Express REST API
- **Database**: PostgreSQL for persistence, Redis for caching

## Components

### Frontend
- React 18 with hooks
- React Router for navigation
- Zustand for state management
- Tailwind CSS for styling

### Backend
- Express.js REST API
- JWT authentication
- PostgreSQL with Prisma ORM
- Redis for session management

### Infrastructure
- Docker containers
- Nginx reverse proxy
- AWS S3 for file storage

## Data Flow

1. User action in React app
2. API call to Express backend
3. Authentication middleware validates JWT
4. Business logic processes request
5. Prisma queries PostgreSQL
6. Response sent back to frontend
7. React updates UI state

## Patterns & Conventions

- RESTful API design
- Component-based frontend architecture
- Repository pattern for data access
- Dependency injection for testability
- Error handling with try-catch and middleware

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Deployment**: Docker, AWS

## Dependencies

- React ecosystem: react, react-dom, react-router
- Backend: express, prisma, jsonwebtoken
- Utilities: zod (validation), date-fns (dates)

