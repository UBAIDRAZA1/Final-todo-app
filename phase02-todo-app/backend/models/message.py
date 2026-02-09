from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class MessageRole(str, Enum):
    user = "user"
    assistant = "assistant"


class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Message(SQLModel, table=True):
    __tablename__ = "messages"
    id: int = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversations.id")
    role: MessageRole
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)