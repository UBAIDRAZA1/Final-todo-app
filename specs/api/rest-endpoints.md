# REST API Endpoints Specification

## Base URL
`http://localhost:8000`

## Authentication
All endpoints require JWT token in the Authorization header:
`Authorization: Bearer <JWT_TOKEN>`

## Endpoints

### Tasks Management

#### GET `/api/{user_id}/tasks`
- **Purpose**: List all tasks for a specific user
- **Parameters**: 
  - `user_id` (path): User ID from JWT token
- **Response**: Array of task objects
- **Status Codes**: 
  - 200: Success
  - 401: Unauthorized
  - 403: Forbidden (accessing other user's tasks)

#### POST `/api/{user_id}/tasks`
- **Purpose**: Create a new task
- **Parameters**:
  - `user_id` (path): User ID from JWT token
- **Request Body**:
  ```json
  {
    "title": "string (required)",
    "description": "string (optional)",
    "completed": "boolean (default: false)"
  }
  ```
- **Response**: Created task object
- **Status Codes**:
  - 201: Created
  - 400: Invalid request body
  - 401: Unauthorized

#### GET `/api/{user_id}/tasks/{id}`
- **Purpose**: Get details of a specific task
- **Parameters**:
  - `user_id` (path): User ID from JWT token
  - `id` (path): Task ID
- **Response**: Task object
- **Status Codes**:
  - 200: Success
  - 401: Unauthorized
  - 404: Task not found

#### PUT `/api/{user_id}/tasks/{id}`
- **Purpose**: Update a specific task
- **Parameters**:
  - `user_id` (path): User ID from JWT token
  - `id` (path): Task ID
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "completed": "boolean"
  }
  ```
- **Response**: Updated task object
- **Status Codes**:
  - 200: Success
  - 400: Invalid request body
  - 401: Unauthorized
  - 404: Task not found

#### DELETE `/api/{user_id}/tasks/{id}`
- **Purpose**: Delete a specific task
- **Parameters**:
  - `user_id` (path): User ID from JWT token
  - `id` (path): Task ID
- **Response**: Empty
- **Status Codes**:
  - 204: Deleted
  - 401: Unauthorized
  - 404: Task not found

#### PATCH `/api/{user_id}/tasks/{id}/complete`
- **Purpose**: Toggle task completion status
- **Parameters**:
  - `user_id` (path): User ID from JWT token
  - `id` (path): Task ID
- **Request Body**:
  ```json
  {
    "completed": "boolean"
  }
  ```
- **Response**: Updated task object
- **Status Codes**:
  - 200: Success
  - 400: Invalid request body
  - 401: Unauthorized
  - 404: Task not found

## Error Response Format
```json
{
  "detail": "Error message"
}
```