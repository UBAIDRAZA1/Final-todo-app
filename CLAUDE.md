# Todo Full-Stack Web Application - Phase II

## Project Overview
This is a full-stack web application for managing todos with multi-user support, persistent database storage, and secure authentication. The application follows spec-driven development methodology where all implementation is generated from specifications.

## Architecture
- **Frontend**: Next.js 16+ with TypeScript and Tailwind CSS
- **Backend**: Python FastAPI with SQLModel ORM
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth with JWT tokens

## Spec-Driven Development Process
1. Write specifications in the `specs/` directory
2. Use Claude Code to implement based on specifications
3. Test the generated implementation
4. If issues exist, improve the specification and regenerate
5. Follow this process strictly - no manual coding allowed

## Project Structure
```
hackathon-todo/
├── .spec-kit/          # Spec-Kit configuration
├── specs/              # All specifications
│   ├── overview.md
│   ├── features/
│   ├── api/
│   ├── database/
│   └── ui/
├── frontend/           # Next.js frontend
│   └── CLAUDE.md
├── backend/            # FastAPI backend
│   └── CLAUDE.md
├── CLAUDE.md          # Main project guidelines
└── README.md          # Project documentation
```

## Implementation Instructions
- All code must be generated from specifications
- Frontend and backend must follow their respective CLAUDE.md guidelines
- Authentication must use Better Auth (frontend) and JWT verification (backend)
- Database must follow the schema specified in specs/database/schema.md
- API endpoints must match the specification in specs/api/rest-endpoints.md

## Technology Stack
- Frontend: Next.js 16+, TypeScript, Tailwind CSS, Better Auth
- Backend: Python FastAPI, SQLModel, JWT Verification Middleware
- Database: Neon Serverless PostgreSQL

## Key Features
- User Authentication (Login/Signup)
- Multi-user isolation
- Persistent DB storage
- Add, Update, Delete, View, and Mark Complete for tasks
- JWT-secured APIs

## Development Workflow
1. Write detailed specifications in the specs/ directory
2. Run Claude Code with @specs/... to generate implementation
3. Test the generated code
4. Refine specifications if needed and regenerate
5. Repeat until all requirements are met

## Testing Requirements
- Unit tests for all components
- Integration tests for API endpoints
- Authentication flow testing
- Multi-user isolation verification