from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid
from pydantic import BaseModel, EmailStr

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        index=True
    )
    email: str = Field(unique=True, index=True, nullable=False)
    name: Optional[str] = Field(default=None, nullable=True)  # ← Optional banaya taaki error na aaye
    password: str = Field(nullable=False)

    emailVerified: bool = Field(default=False)
    createdAt: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updatedAt: datetime = Field(default_factory=datetime.utcnow, nullable=False)

class UserBase(SQLModel):
    email: EmailStr
    name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(SQLModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    image_url: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: str
    createdAt: datetime
    updatedAt: datetime
    emailVerified: bool