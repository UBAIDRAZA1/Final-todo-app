# Frontend Development Guidelines

## Project Overview
This is the frontend of a full-stack Todo application built with Next.js 16+, TypeScript, and Tailwind CSS. The frontend communicates with a FastAPI backend and uses Better Auth for authentication.

## Technology Stack
- Next.js 16+ with App Router
- TypeScript
- Tailwind CSS
- Better Auth for authentication
- React Server Components where appropriate

## File Structure
- Use the App Router convention (`app` directory)
- Organize components in a `components` directory
- Place shared utilities in a `lib` directory
- Store public assets in the `public` directory

## Coding Standards
- Use TypeScript for all components and pages
- Follow Next.js best practices for data fetching
- Implement responsive design with Tailwind CSS
- Use component-based architecture
- Follow accessibility best practices

## Authentication
- Integrate Better Auth for user management
- Protect routes that require authentication
- Handle JWT tokens appropriately
- Implement proper logout functionality

## API Integration
- Use the REST API endpoints as specified in the specs
- Include JWT tokens in Authorization headers
- Implement proper error handling for API calls
- Show loading states during API requests

## UI/UX Requirements
- Implement all components as specified in specs/ui/components.md
- Create all pages as specified in specs/ui/pages.md
- Ensure responsive design for all screen sizes
- Implement proper loading and error states
- Follow accessibility guidelines

## Environment Variables
- Store API base URL in NEXT_PUBLIC_API_BASE_URL
- Any other environment-specific configurations

## Testing
- Write unit tests for components
- Implement integration tests for API interactions
- Test authentication flows