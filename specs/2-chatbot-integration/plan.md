# Technical Plan: AI Chatbot Integration

## 1. Architecture

### Backend (FastAPI)
-   **Agent Class (`GeminiAgent`)**:
    -   Wraps `google.generativeai` client.
    -   Manages chat history (list of messages).
    -   Handles the "Tool Use" loop:
        1.  Send user message to Gemini.
        2.  Check if Gemini requests a function call.
        3.  Execute function (DB operation).
        4.  Send function result back to Gemini.
        5.  Get final natural language response.
-   **Tools Module**:
    -   `tools.py`: Functions that accept simple arguments and interact with the `CRUD` layer.
-   **API Endpoint**:
    -   `POST /api/{user_id}/chat`: Accepts `{ message: string }`, returns `{ response: string }`.

### Frontend (Next.js)
-   **Chat Page (`app/chat/page.tsx`)**:
    -   State: `messages` array.
    -   Effect: Auto-scroll to bottom.
    -   UI: Tailwind-styled message bubbles.
-   **API Client**:
    -   `axios` call to the backend chat endpoint with Bearer token.

## 2. Data Flow
1.  User types "Buy milk" -> Frontend sends POST request.
2.  Backend authenticates user -> Passes request to `GeminiAgent`.
3.  `GeminiAgent` calls Gemini API with system prompt + user message.
4.  Gemini responds with Function Call: `add_task("Buy milk")`.
5.  `GeminiAgent` executes `add_task` in Database.
6.  `GeminiAgent` sends "Task added" result to Gemini.
7.  Gemini generates "I've added 'Buy milk' to your list."
8.  Backend returns text to Frontend.
9.  Frontend displays message.

## 3. Libraries
-   `google-generativeai`: Official Python SDK for Gemini.
-   `react-markdown`: For rendering rich text responses (optional).

## 4. Risks & Mitigation
-   **Risk**: Gemini hallucinating task IDs.
    -   **Mitigation**: Agent should verify ID existence before updating.
-   **Risk**: Rate limits.
    -   **Mitigation**: Catch `429` errors and ask user to wait.
