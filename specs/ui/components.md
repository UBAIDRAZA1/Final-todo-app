# UI Components Specification

## Overview
This document specifies the UI components for the Todo application frontend built with Next.js and Tailwind CSS.

## Core Components

### 1. TaskItem Component
- **Purpose**: Display a single task with options to edit, delete, and toggle completion
- **Props**: 
  - task: Task object with id, title, description, completed, createdAt
  - onToggle: Function to handle completion toggle
  - onEdit: Function to handle editing
  - onDelete: Function to handle deletion
- **Features**:
  - Visual indication of completion status (strikethrough, checkbox)
  - Title display with truncation for long titles
  - Description display (optional)
  - Action buttons (edit, delete) with appropriate icons
  - Responsive design for mobile and desktop

### 2. TaskForm Component
- **Purpose**: Form for creating and updating tasks
- **Props**:
  - task: Optional task object for editing (null for creation)
  - onSubmit: Function to handle form submission
  - onCancel: Function to handle cancel action
- **Fields**:
  - Title input (required, with validation)
  - Description textarea (optional)
  - Submit and Cancel buttons
- **Features**:
  - Form validation
  - Loading states during submission
  - Error display for validation issues

### 3. TaskList Component
- **Purpose**: Display a list of tasks with filtering options
- **Props**:
  - tasks: Array of task objects
  - onTaskToggle: Function to handle task completion toggle
  - onTaskEdit: Function to handle task editing
  - onTaskDelete: Function to handle task deletion
- **Features**:
  - Filter controls (all, active, completed)
  - Empty state message
  - Loading state display
  - Infinite scroll or pagination for large lists

### 4. AuthComponent
- **Purpose**: Handle user authentication (login/signup)
- **Features**:
  - Better Auth integration
  - Login form with email/password
  - Signup form with email/password
  - Social login options (if supported by Better Auth)
  - Loading and error states

### 5. Header Component
- **Purpose**: Application header with navigation and user controls
- **Features**:
  - App title/logo
  - Navigation links
  - User profile dropdown/logout
  - Responsive mobile menu

### 6. Layout Component
- **Purpose**: Main application layout with consistent structure
- **Features**:
  - Responsive design
  - Consistent spacing and typography
  - Global styles and theme
  - Error and loading boundaries

## Styling Guidelines
- Use Tailwind CSS utility classes
- Follow a consistent color palette
- Ensure proper spacing and alignment
- Implement responsive design for all screen sizes
- Use appropriate typography hierarchy
- Ensure accessibility compliance (ARIA attributes, keyboard navigation)