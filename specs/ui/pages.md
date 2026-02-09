# UI Pages Specification

## Overview
This document specifies the pages for the Todo application frontend built with Next.js App Router.

## Page Structure

### 1. Home Page (`/` or `/dashboard`)
- **Purpose**: Main dashboard showing user's tasks
- **Components**:
  - Header with user info
  - TaskList component
  - TaskForm component (for creating new tasks)
  - Filter controls
- **Features**:
  - Shows all tasks for the authenticated user
  - Ability to create new tasks
  - Filter tasks (all, active, completed)
  - Search functionality
  - Loading and error states

### 2. Task Detail Page (`/tasks/[id]`)
- **Purpose**: Show detailed view of a specific task
- **Components**:
  - Header with navigation
  - Task details display
  - Edit controls
- **Features**:
  - Show complete task information
  - Option to edit the task
  - Option to delete the task
  - Back navigation to task list

### 3. Authentication Pages
#### Login Page (`/auth/login`)
- **Purpose**: User login interface
- **Components**:
  - AuthComponent with login form
  - Link to signup page
- **Features**:
  - Email and password fields
  - Form validation
  - Better Auth integration
  - Error handling

#### Signup Page (`/auth/signup`)
- **Purpose**: User registration interface
- **Components**:
  - AuthComponent with signup form
  - Link to login page
- **Features**:
  - Email and password fields
  - Form validation
  - Better Auth integration
  - Error handling

### 4. Profile Page (`/profile`)
- **Purpose**: User profile and settings
- **Components**:
  - User information display
  - Account settings
  - Logout button
- **Features**:
  - Display user information
  - Account management options
  - Logout functionality

### 5. 404 Page (`/not-found`)
- **Purpose**: Handle invalid routes
- **Features**:
  - Friendly error message
  - Navigation back to home
  - Search functionality

## Layout Structure
- **Root Layout** (`app/layout.tsx`): Global layout with HTML structure
- **App Layout** (`app/page.tsx`): Main application layout for authenticated users
- **Auth Layout** (`app/auth/layout.tsx`): Layout for authentication pages

## Navigation
- Protected routes for authenticated users only
- Redirect to login for unauthenticated access to protected pages
- Consistent navigation across all pages
- Mobile-responsive navigation menu

## User Experience
- Smooth transitions between pages
- Loading states during data fetching
- Error boundaries for handling errors gracefully
- Consistent design language across all pages
- Fast loading times with proper data fetching strategies