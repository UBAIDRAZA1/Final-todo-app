from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import Any
from models import User, UserResponse, UserUpdate
from utils.database import get_session
from utils.auth import get_current_user_id

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def read_users_me(
    user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Get current user profile
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.put("/me", response_model=UserResponse)
async def update_user_me(
    user_update: UserUpdate,
    user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Update current user profile
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    update_data = user_update.dict(exclude_unset=True)
    
    # Don't allow updating password directly here (should use a separate endpoint)
    if "password" in update_data:
        del update_data["password"]
        
    for key, value in update_data.items():
        setattr(user, key, value)
        
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
