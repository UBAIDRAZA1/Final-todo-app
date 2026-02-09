# Full-Stack Todo Web Application

A complete full-stack todo application with authentication, built with Next.js, FastAPI, and PostgreSQL.

## Features

- User authentication (login/signup)
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Multi-user isolation (users can only access their own tasks)
- JWT-based authentication
- Responsive UI with Tailwind CSS

## Tech Stack

### Frontend
- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS
- Better Auth

### Backend
- Python FastAPI
- SQLModel ORM
- JWT Authentication

### Database
- PostgreSQL (Neon Serverless)

## Project Structure

```
hackathon-todo/
├── backend/              # FastAPI backend
│   ├── api/              # API routes
│   ├── models/           # Database models
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   ├── main.py           # Main application file
│   └── requirements.txt  # Python dependencies
├── frontend/             # Next.js frontend
│   ├── app/              # App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utility functions
│   ├── types/            # TypeScript types
│   ├── package.json      # Node.js dependencies
│   └── next.config.js    # Next.js configuration
└── specs/                # Project specifications
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and JWT secret
```

4. Run the backend:
```bash
python main.py
```

The backend will be available at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your API base URL
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/{user_id}/tasks` - Get all tasks for a user
- `POST /api/{user_id}/tasks` - Create a new task
- `GET /api/{user_id}/tasks/{id}` - Get a specific task
- `PUT /api/{user_id}/tasks/{id}` - Update a task
- `DELETE /api/{user_id}/tasks/{id}` - Delete a task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle task completion status

All endpoints require JWT authentication in the Authorization header.

## Security Features

- JWT token-based authentication
- User isolation (users can only access their own tasks)
- Input validation
- Secure token handling"# UBAIDRAZA1-Todo-Web-Application" 
"# Todo-Web-Application" 
"# todo-app-chatboot" 
"# Docker-Desktop" 
"# Final-todo-app" 
