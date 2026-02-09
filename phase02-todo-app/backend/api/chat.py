from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Optional
from datetime import datetime
from models import Message, Conversation, User, MessageRole
from agents.gemini_agent import GeminiAgent
from utils.database import get_session
from utils.auth import get_current_user_id
from pydantic import BaseModel

router = APIRouter()
agent = GeminiAgent()


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None


class ChatResponse(BaseModel):
    response: str
    conversation_id: int
    tool_calls: Optional[list] = None


@router.post("/", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    # Get or create conversation
    conversation = None
    if request.conversation_id:
        conversation = session.get(Conversation, request.conversation_id)
        if not conversation or conversation.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found or unauthorized"
            )
    else:
        # Create new conversation
        conversation = Conversation(user_id=user_id)
        session.add(conversation)
        session.commit()
        session.refresh(conversation)

    # Save user message
    user_message = Message(
        conversation_id=conversation.id,
        role=MessageRole.user,
        content=request.message
    )
    session.add(user_message)
    session.commit()

    # Get conversation history for context
    history_query = select(Message).where(
        Message.conversation_id == conversation.id
    ).order_by(Message.created_at.asc())
    history = session.exec(history_query).all()
    
    # Convert history to the format expected by the agent
    conversation_history = [
        {"role": msg.role.value, "content": msg.content}
        for msg in history[:-1]  # Exclude the current message
    ]

    # Get response from Gemini agent
    agent_response = await agent.get_response(
        message=request.message,
        user_id=user_id,
        conversation_history=conversation_history
    )

    # Execute any tool calls
    if "tool_calls" in agent_response:
        for tool_call in agent_response["tool_calls"]:
            tool_result = agent.call_tool(
                tool_name=tool_call["name"],
                arguments=tool_call["arguments"]
            )
            # Optionally, you could add the tool result to the conversation history
            # for more context in future messages

    # Save assistant response
    assistant_message = Message(
        conversation_id=conversation.id,
        role=MessageRole.assistant,
        content=agent_response.get("response", "I processed your request.")
    )
    session.add(assistant_message)
    session.commit()

    # Update conversation timestamp
    conversation.updated_at = datetime.utcnow()
    session.add(conversation)
    session.commit()

    return ChatResponse(
        response=agent_response.get("response", "I processed your request."),
        conversation_id=conversation.id,
        tool_calls=agent_response.get("tool_calls")
    )