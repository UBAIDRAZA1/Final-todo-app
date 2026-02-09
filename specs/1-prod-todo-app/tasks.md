# Tasks: Production-Ready Todo Web Application

**Input**: Design documents from `specs/1-prod-todo-app/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for both frontend and backend.

- [x] T001 Create root `backend` and `frontend` directories.
- [x] T002 [P] Initialize Python project with Poetry in `backend/pyproject.toml`.
- [x] T003 [P] Initialize Next.js project in `frontend/package.json`.
- [x] T004 [P] Configure linting (Ruff) and formatting (Black) for the backend in `backend/pyproject.toml`.
- [x] T005 [P] Configure linting (ESLint) and formatting (Prettier) for the frontend in `frontend/.eslintrc.json` and `frontend/.prettierrc`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

### Backend Foundation
- [x] T006 [P] Configure FastAPI app settings and environment variables in `backend/src/core/config.py`.
- [x] T007 [P] Set up database connection and session management in `backend/src/core/db.py`.
- [x] T008 Implement JWT generation, decoding, and password hashing in `backend/src/core/security.py`.
- [x] T009 Set up main FastAPI application entrypoint in `backend/src/main.py`.
- [x] T010 Initialize Alembic for database migrations in `backend/alembic/`.

### Frontend Foundation
- [x] T011 [P] Configure Tailwind CSS in `frontend/tailwind.config.js`.
- [x] T012 [P] Set up global providers (Theme, React Query) in `frontend/src/app/layout.tsx`.
- [x] T013 [P] Create a reusable API client instance (e.g., Axios) in `frontend/src/lib/api.ts`.
- [x] T014 [P] Create a Zustand store for global UI state in `frontend/src/store/ui.ts`.
- [x] T015 Define protected route logic and middleware in `frontend/src/middleware.ts`.

---

## Phase 3: User Story 1 - User Authentication (Priority: P1) 🎯 MVP

**Goal**: Enable users to register, log in, and log out securely.
**Independent Test**: A new user can create an account, log out, and log back in. Protected pages are inaccessible to logged-out users.

### Backend for User Story 1
- [x] T016 [US1] Create User model in `backend/src/models/user.py`.
- [x] T017 [US1] Create User Pydantic schemas (User, UserCreate) in `backend/src/schemas/user.py`.
- [x] T018 [US1] Implement user creation and authentication logic in `backend/src/services/user_service.py`.
- [x] T019 [US1] Create auth endpoints (/register, /login, /refresh, /logout) in `backend/src/api/auth.py`.
- [x] T020 [US1] Generate initial database migration for the users table with Alembic.

### Frontend for User Story 1
- [x] T021 [P] [US1] Create a reusable `Input` component in `frontend/src/components/ui/Input.tsx`.
- [x] T022 [P] [US1] Create a reusable `Button` component in `frontend/src/components/ui/Button.tsx`.
- [x] T023 [US1] Create the registration form component in `frontend/src/components/auth/RegisterForm.tsx`.
- [x] T024 [US1] Create the login form component in `frontend/src/components/auth/LoginForm.tsx`.
- [x] T025 [US1] Build the registration page UI at `frontend/src/app/(auth)/register/page.tsx`.
- [x] T026 [US1] Build the login page UI at `frontend/src/app/(auth)/login/page.tsx`.
- [x] T027 [US1] Implement client-side logic for registration, login, and storing tokens.
- [x] T028 [US1] Implement logout functionality and clearing of user session.

---

## Phase 4: User Story 2 - Core Task Management (Priority: P2)

**Goal**: Allow logged-in users to perform basic Create, Read, Update, and Delete (CRUD) operations on their tasks.
**Independent Test**: A user can create a task, see it, edit it, and delete it.

### Backend for User Story 2
- [ ] T029 [P] [US2] Create Task and Tag models in `backend/src/models/task.py`.
- [ ] T030 [P] [US2] Create Task and Tag Pydantic schemas in `backend/src/schemas/task.py`.
- [ ] T031 [US2] Implement task CRUD logic in `backend/src/services/task_service.py`.
- [ ] T032 [US2] Create /tasks and /tags endpoints in `backend/src/api/tasks.py`.
- [ ] T033 [US2] Generate database migration for tasks and tags tables.

### Frontend for User Story 2
- [ ] T034 [P] [US2] Create `TaskCard` component to display a single task in `frontend/src/components/tasks/TaskCard.tsx`.
- [ ] T035 [P] [US2] Create `TaskForm` component for creating and editing tasks in `frontend/src/components/tasks/TaskForm.tsx`.
- [ ] T036 [US2] Create `TaskList` component to display a list of tasks in `frontend/src/components/tasks/TaskList.tsx`.
- [ ] T037 [US2] Build the main tasks dashboard UI to display the task list at `frontend/src/app/(dashboard)/tasks/page.tsx`.
- [ ] T038 [US2] Implement client-side logic for fetching, creating, updating, and deleting tasks.

---

## Phase 5: User Story 3 - Advanced Task Interactions (Priority: P3)

**Goal**: Enhance the task dashboard with search, filtering, and sorting capabilities.
**Independent Test**: A user can search for a task, filter by status, and sort the results by priority.

### Backend for User Story 3
- [ ] T039 [US3] Add search, filter, and sort logic to `get_tasks` in `backend/src/services/task_service.py`.
- [ ] T040 [US3] Update the `GET /tasks` endpoint in `backend/src/api/tasks.py` to accept and process query parameters.
- [ ] T041 [US3] Add GIN index for full-text search to the tasks table migration.

### Frontend for User Story 3
- [ ] T042 [P] [US3] Create `FilterBar` component with search input and filter dropdowns in `frontend/src/components/tasks/FilterBar.tsx`.
- [ ] T043 [P] [US3] Create `TagInput` component with autocomplete in `frontend/src/components/tasks/TagInput.tsx`.
- [ ] T044 [US3] Integrate `FilterBar` into the tasks dashboard page.
- [ ] T045 [US3] Implement client-side logic to refetch tasks when search, filter, or sort parameters change.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and enhance the overall user experience.

- [ ] T046 [P] Implement dark mode toggle and apply theme changes in `frontend/src/components/ui/ThemeToggle.tsx`.
- [ ] T047 [P] Create and integrate `Skeleton` loading components in `frontend/src/components/ui/Skeleton.tsx`.
- [ ] T048 [P] Set up a toast notification system for success/error feedback.
- [ ] T049 [P] Create a reusable `AlertDialog` for delete confirmations.
- [ ] T050 Implement `Undo` functionality on a toast after task deletion.
- [ ] T051 Review and add ARIA labels and ensure keyboard focus management for accessibility.

---

## Dependencies & Execution Order

- **Foundational (Phase 2)** must be completed before any User Story phase.
- **User Story 1 (Phase 3)** is the MVP and is a prerequisite for all other user stories.
- **User Story 2 (Phase 4)** depends on User Story 1.
- **User Story 3 (Phase 5)** depends on User Story 2.
- **Polish (Phase 6)** can be worked on after the relevant components from other phases are complete.

Within each user story phase, backend tasks should generally be completed before frontend tasks that depend on them. Tasks marked `[P]` can be worked on in parallel.

## Implementation Strategy

The project will be delivered by completing each phase in order, starting with Setup and Foundational work. User Story 1 constitutes the Minimum Viable Product (MVP). Subsequent user stories will be implemented as incremental feature additions.
