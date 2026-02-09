# Environment Setup Guide

## Local Development

To run the application locally:

### Backend (API)
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Start the backend server: `python main.py` or `uvicorn main:app --reload --port 8001`

### Frontend
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. The `.env.local` file is already configured for local development:
   ```
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8001
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8001
   ```
4. Start the frontend: `npm run dev`

## Deployed (Production) Environment

To configure for the deployed environment:

### Frontend
1. Update the `.env.local` file to use deployed URLs:
   ```
   # For deployed environment
   NEXT_PUBLIC_BETTER_AUTH_URL=https://hafizubaid-todo-wep-app.hf.space
   NEXT_PUBLIC_API_BASE_URL=https://hafizubaid-todo-wep-app.hf.space
   ```

## API Route Structure

The backend API follows this structure:
- Authentication: `/api/auth/*` (e.g., `/api/auth/sign-in/email`)
- Tasks: `/api/{user_id}/tasks/*` (e.g., `/api/{user_id}/tasks`, `/api/{user_id}/tasks/{task_id}`)

## Environment Variables

### Frontend (.env.local)
- `NEXT_PUBLIC_BETTER_AUTH_URL`: Base URL for authentication API
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for task API

### Backend (.env)
- `DATABASE_URL`: Database connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_ALGORITHM`: Algorithm for JWT (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time
- `ALLOWED_ORIGINS`: List of allowed frontend origins