# Backend Development Guidelines

## Project Overview
This is the backend of a full-stack Todo application built with Python FastAPI and SQLModel ORM. It provides REST API endpoints for the frontend and handles authentication via JWT tokens.

## Technology Stack
- Python FastAPI
- SQLModel ORM
- JWT Verification Middleware
- Neon Serverless PostgreSQL

## File Structure
- Organize API routes in an `api` directory
- Place database models in a `models` directory
- Store configuration in a `config` directory
- Place utility functions in a `utils` directory

## Coding Standards
- Use Python type hints throughout
- Follow FastAPI best practices for route definition
- Implement proper error handling with HTTPException
- Use dependency injection where appropriate
- Follow Python PEP 8 style guidelines

## Authentication
- Verify JWT tokens for all protected endpoints
- Extract user ID from JWT payload
- Return 401 for invalid/missing tokens
- Implement middleware for token verification

## Database
- Use SQLModel for database models and queries
- Follow the schema specified in specs/database/schema.md
- Implement proper relationships between models
- Use async database operations where possible

## API Endpoints
- Implement all endpoints as specified in specs/api/rest-endpoints.md
- Follow REST conventions for HTTP methods and status codes
- Include proper request/response validation
- Implement proper error responses

## Security
- Validate all input parameters
- Implement rate limiting if necessary
- Use HTTPS in production
- Sanitize all user inputs

## Environment Variables
- Store database URL in DATABASE_URL
- Store JWT secret in JWT_SECRET
- Any other environment-specific configurations

## Testing
- Write unit tests for API endpoints
- Implement integration tests with the database
- Test authentication middleware
- Test error handling scenarios