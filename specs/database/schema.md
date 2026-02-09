# Database Schema Specification

## Overview
The application uses Neon Serverless PostgreSQL database with two main tables: users and tasks. The Better Auth library manages the users table, while the application manages the tasks table.

## Tables

### Users Table (Managed by Better Auth)
- **id** (string, primary key): Unique user identifier
- **email** (string): User's email address
- **name** (string): User's name
- **created_at** (timestamp): Account creation timestamp

### Tasks Table
- **id** (integer, primary key, auto-increment): Unique task identifier
- **user_id** (string, foreign key): References users.id from Better Auth
- **title** (string, not null): Task title
- **description** (text, optional): Task description
- **completed** (boolean, default: false): Completion status
- **created_at** (timestamp, default: current timestamp): Task creation time
- **updated_at** (timestamp, default: current timestamp): Last update time

## Relationships
- Each task belongs to exactly one user (user_id → users.id)
- A user can have zero or more tasks
- When a user is deleted, their tasks should also be deleted (cascade deletion)

## Indexes
- Index on user_id for efficient user-based queries
- Index on completed for filtering completed tasks
- Index on created_at for chronological sorting

## Constraints
- All tasks must have a valid user_id that exists in the users table
- Title field cannot be null or empty
- User_id must match the authenticated user for all operations