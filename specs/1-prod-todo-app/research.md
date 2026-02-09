# Research & Decisions

This document records the key technology and architectural decisions for the project, as defined in the implementation plan.

## Backend

### Backend Framework: FastAPI
- **Decision**: Use FastAPI for the Python backend.
- **Rationale**: Aligns with the constitution's requirement for a modern, high-performance stack. Its native support for `async` operations and Pydantic-based data validation makes it ideal for building a fast, robust, and well-documented API.
- **Alternatives considered**:
  - **Flask**: More lightweight but lacks the built-in async support and automatic OpenAPI generation of FastAPI.
  - **Django**: A full-featured framework, but its monolithic nature and traditional ORM are less aligned with the desired modularity and async performance goals.

### Database ORM: SQLAlchemy 2.0 (async)
- **Decision**: Use SQLAlchemy 2.0 with its `async` capabilities.
- **Rationale**: Provides a powerful and flexible ORM that aligns with FastAPI's async nature, preventing blocking I/O operations and maximizing performance. Alembic, its companion tool, offers robust schema migration management.
- **Alternatives considered**:
  - **Tortoise-ORM**: A simpler async ORM, but less feature-rich and mature than SQLAlchemy.
  - **Direct SQL**: Would provide maximum performance but sacrifices developer velocity and introduces risks of SQL injection if not handled perfectly.

## Frontend

### Frontend Framework: Next.js 14+ (App Router)
- **Decision**: Use the Next.js App Router.
- **Rationale**: The constitution requires a modern full-stack approach. The App Router with React Server Components (RSC) allows for a significant portion of the UI to be rendered on the server, reducing the amount of client-side JavaScript and improving initial page load times (FCP).
- **Alternatives considered**:
  - **Next.js Pages Router**: The older model, less optimized for server-centric rendering and component-level data fetching.
  - **Create React App (CRA)**: A client-side only solution that would not meet the performance goals or align with the full-stack, server-component philosophy.

### UI Components & Styling: shadcn/ui + Tailwind CSS
- **Decision**: Use shadcn/ui for components and Tailwind CSS for styling.
- **Rationale**: This combination provides a highly composable and customizable UI toolkit that aligns with the "beautiful" and "modern" goals of the project. `shadcn/ui` provides accessible, unstyled components that can be tailored with Tailwind's utility-first approach, avoiding the bloat of traditional component libraries.
- **Alternatives considered**:
  - **Material-UI (MUI)**: A popular library, but can be less customizable and brings a strong, pre-defined design system.
  - **Bootstrap**: A solid choice but less aligned with the modern, utility-first CSS workflow that Tailwind enables.

### State Management: Zustand & React Query
- **Decision**: Use Zustand for minimal client-side state and React Query (TanStack Query) for server state management.
- **Rationale**: This follows best practices for modern React applications. React Query expertly handles caching, refetching, and synchronization of server data, while Zustand provides a simple, unopinionated solution for the small amount of global client state needed (e.g., dark mode toggle).
- **Alternatives considered**:
  - **Redux**: Powerful but often brings unnecessary boilerplate and complexity for the scale of this project.
  - **React Context**: Can lead to performance issues with frequent updates and lacks the dedicated server-state management features of React Query.

## Testing

### Backend Testing: pytest
- **Decision**: Use `pytest` for all backend testing.
- **Rationale**: It is the de-facto standard for testing in the Python ecosystem, with a rich plugin ecosystem and a simple, powerful assertion syntax. It works seamlessly with FastAPI.
- **Alternatives considered**:
  - **unittest**: Built into Python but more verbose and less flexible than pytest.

### Frontend Testing: Playwright
- **Decision**: Use Playwright for end-to-end and component testing.
- **Rationale**: Playwright provides a single tool for reliable, fast, and cross-browser testing of modern web applications. Its ability to test components in isolation and run full user flows makes it a perfect fit for ensuring spec compliance from the UI perspective.
- **Alternatives considered**:
  - **Cypress**: A strong competitor, but Playwright generally offers better cross-browser support and performance.
  - **Jest + React Testing Library**: Excellent for unit/integration testing components, but does not cover the end-to-end testing requirement, which Playwright handles.
