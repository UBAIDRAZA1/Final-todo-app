---
id: 005
title: Implement Chatbot Backend & Frontend
stage: implement
date: 2026-01-12
surface: agent
model: gemini-flash-latest
feature: 2-chatbot-integration
branch: 2-chatbot-integration
user: user
command: /sp.implement
labels: ["implement", "code"]
links:
  pr: "https://github.com/user/todo-app/pull/2"
files:
  - backend/agents/gemini_agent.py
  - backend/api/chat.py
  - frontend/app/chat/page.tsx
tests:
  - backend/tests/test_chat.py
---

## Prompt

Execute the implementation tasks for the Chatbot Integration.
Focus on:
1.  Robust error handling for the Gemini API.
2.  Ensuring the Frontend works seamlessly with the Backend.
3.  Fixing any "OperationalError" related to database schema if they arise.

## Response snapshot

Implemented the core Chatbot features:

1.  **Backend**:
    -   Created `backend/agents/gemini_agent.py` with `GeminiAgent` class using `gemini-flash-latest`.
    -   Implemented tool handling for `add_task`, `list_tasks`, `update_task`, `delete_task`, `complete_task`.
    -   Added `backend/api/chat.py` router.
    -   Updated `backend/main.py` to include the chat router and configure CORS.

2.  **Frontend**:
    -   Created `frontend/app/chat/page.tsx` with a modern Chat UI.
    -   Integrated `react-markdown` for rendering bot responses.
    -   Added "Go to Dashboard" navigation.

3.  **Fixes**:
    -   Resolved `sqlalchemy.exc.OperationalError: no such column: task.completed_at` by running a database migration script.
    -   Fixed `NoneType` error in function argument parsing.
    -   Switched model from `gemini-pro` (deprecated/paid) to `gemini-flash-latest` (free).

The Chatbot is now fully functional and deployed to Vercel/Hugging Face.

## Outcome

- ✅ Impact: Fully implemented and deployed the AI Chatbot.
- 🧪 Tests: Verified manual test cases (Add task, List tasks, Complete task).
- 📁 Files: All code files updated.
- 🧠 Reflection: The integration required careful handling of the Gemini API's tool calling format, specifically type conversions for task IDs.
