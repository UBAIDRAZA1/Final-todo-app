# Task CRUD Operations Specification

## Feature Overview
Implement full CRUD (Create, Read, Update, Delete) operations for tasks in the Todo application. Each task should be associated with a specific user and support marking as complete/incomplete.

## Acceptance Criteria
- Users can create new tasks with title and optional description
- Users can view all their tasks in a list
- Users can view details of a specific task
- Users can update task details (title, description)
- Users can delete tasks
- Users can mark tasks as complete/incomplete
- Users can only access their own tasks (multi-user isolation)

## Technical Requirements
- Each task must be linked to a user via user_id
- Tasks should have title (required), description (optional), completed (boolean), timestamps
- API endpoints must be secured with JWT authentication
- Proper error handling for unauthorized access attempts

## User Interface Requirements
- Clean, responsive UI for task management
- Form for creating/updating tasks
- Visual indication of task completion status
- Confirmation for delete operations
- Loading states during API calls