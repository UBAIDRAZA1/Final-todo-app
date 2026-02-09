---
title: Todo Backend
emoji: 🚀
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
---

# Todo Application Backend

FastAPI backend for Todo application.

## API Endpoints

- `GET /` - Health check
- `GET /health` - Health status
- `POST /api/signup/email` - User signup
- `POST /api/signin/email` - User login
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task