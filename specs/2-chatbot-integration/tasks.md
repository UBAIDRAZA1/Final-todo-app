# Implementation Tasks

## Phase 1: Backend Core
- [x] Install `google-generativeai` and update `requirements.txt`.
- [x] Configure `GEMINI_API_KEY` in `settings.py`.
- [x] Create `backend/utils/tools.py` with wrapper functions for `Task` CRUD operations.
- [x] Create `backend/agents/gemini_agent.py` implementing the `GeminiAgent` class.
- [x] Implement the `call_tool` method to map string names to python functions.
- [x] Implement the `get_response` loop to handle multi-turn function calling.

## Phase 2: API Layer
- [x] Create `backend/api/chat.py` with `APIRouter`.
- [x] Define Pydantic models for `ChatRequest` and `ChatResponse`.
- [x] Implement the `POST /` endpoint connecting User -> Agent.
- [x] Register router in `backend/main.py`.

## Phase 3: Frontend UI
- [x] Create `frontend/app/chat/page.tsx`.
- [x] Implement `ChatMessage` component for styling.
- [x] Add "Go to Dashboard" button for easy navigation.
- [x] Hook up `axios.post` to send messages to backend.
- [x] Handle loading states (typing indicator).

## Phase 4: Integration & Fixes
- [x] Fix CORS issues for Vercel deployment.
- [x] Fix `OperationalError` (missing `completed_at` column).
- [x] Verify `gemini-flash-latest` model availability.
- [x] Test "Add Task", "List Tasks", "Complete Task" flows.
