# Feature Specification: AI Chatbot Integration

## 1. Overview
The AI Chatbot Integration adds a conversational interface to the Todo App. Users can interact with their task list using natural language commands powered by Google's Gemini API. The system supports creating, listing, updating, and completing tasks through chat.

## 2. Goals
-   **Natural Interaction**: Users should be able to manage tasks without clicking buttons.
-   **Smart Understanding**: The bot should understand context, dates ("tomorrow", "next week"), and priorities.
-   **Direct Action**: The bot should perform actions immediately (e.g., adding a task) rather than just giving instructions.
-   **Accessibility**: Provide an alternative way to use the app for users who prefer chat.

## 3. User Stories
-   As a user, I want to type "Add a high priority task to buy milk" so that it is added to my list with the correct tags.
-   As a user, I want to ask "What do I have to do today?" so that I can see a summary of my immediate tasks.
-   As a user, I want to say "I finished task 5" so that it is marked as complete.
-   As a user, I want to see a history of my conversation with the bot during the current session.

## 4. Functional Requirements
### 4.1 Chat Interface
-   A new page `/chat` or a floating widget.
-   Message history view (User right, Bot left).
-   Input field with send button.
-   Loading indicator while waiting for AI response.

### 4.2 AI Logic (Backend)
-   Use `gemini-flash-latest` (or equivalent free tier model).
-   System prompt must define the assistant's persona (helpful, concise).
-   **Tool Calling**: The model must have access to:
    -   `add_task(title, description, due_date, priority)`
    -   `list_tasks(status, priority)`
    -   `update_task(task_id, ...)`
    -   `delete_task(task_id)`
    -   `complete_task(task_id)`

### 4.3 Security
-   The Chat API must require a valid JWT token.
-   The Agent must only access tasks belonging to the authenticated user.
-   API Keys for Gemini must be stored securely in environment variables.

## 5. Non-Functional Requirements
-   **Latency**: Responses should be generated within 3-5 seconds.
-   **Reliability**: Graceful error messages if the AI service is down.
-   **Cost**: Zero cost (Free Tier usage).

## 6. Open Questions (Resolved)
-   **Q**: History persistence? **A**: No, session-only for V1.
-   **Q**: Voice input? **A**: Out of scope for V1.
