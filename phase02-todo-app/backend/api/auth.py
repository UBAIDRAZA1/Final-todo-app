from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from pydantic import BaseModel, EmailStr
from sqlmodel import Session as DbSession, select
from typing import Optional
from datetime import datetime, timedelta
import uuid
from jose import jwt, JWTError
from passlib.context import CryptContext
from models import User, UserCreate, UserLogin  # Don't import Session here, will handle JWT only
from utils.database import get_session
from config.settings import settings

router = APIRouter()
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


# -----------------------
# Password utils
# -----------------------
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


# -----------------------
# JWT utils
# -----------------------
def create_token(user_id: str, type: str = "access") -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": user_id, "type": type, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


# -----------------------
# Routes
# -----------------------
@router.post("/sign-up/email", status_code=status.HTTP_201_CREATED)
async def sign_up(user_data: UserCreate, response: Response, session: DbSession = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    new_user = User(
        id=str(uuid.uuid4()),
        email=user_data.email,
        name=user_data.name,
        password=get_password_hash(user_data.password),
        createdAt=datetime.utcnow(),
        updatedAt=datetime.utcnow(),
        emailVerified=False
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    token = create_token(new_user.id)

    response.set_cookie(
        key="better-auth.session_token",
        value=token,
        httponly=True,
        samesite="none",  # Allow cross-site requests
        secure=False,     # Set to False for HTTP connections
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

    return {
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.name,
            "createdAt": new_user.createdAt,
            "updatedAt": new_user.updatedAt,
            "emailVerified": new_user.emailVerified
        },
        "token": token,
        "session": {
            "token": token,
            "user": {"id": new_user.id}
        }
    }


@router.post("/sign-in/email", status_code=status.HTTP_200_OK)
async def sign_in(user_data: UserLogin, response: Response, session: DbSession = Depends(get_session)):
    user = session.exec(select(User).where(User.email == user_data.email)).first()
    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_token(user.id)

    response.set_cookie(
        key="better-auth.session_token",
        value=token,
        httponly=True,
        samesite="none",  # Allow cross-site requests
        secure=False,     # Set to False for HTTP connections
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "createdAt": user.createdAt,
            "updatedAt": user.updatedAt,
            "emailVerified": user.emailVerified
        },
        "token": token,
        "session": {
            "token": token,
            "user": {"id": user.id}
        }
    }


@router.get("/get-session")
async def get_current_session(request: Request):
    token = None
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header[7:]
    else:
        token = request.cookies.get("better-auth.session_token")

    if not token:
        return None

    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
    except JWTError:
        return None

    # Fetch user from DB
    session_gen = get_session()
    db_session = next(session_gen)
    try:
        user = db_session.exec(select(User).where(User.id == user_id)).first()
        if not user:
            return None

        return {
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "createdAt": user.createdAt,
                "updatedAt": user.updatedAt,
                "emailVerified": user.emailVerified
            },
            "token": token,
            "session": {
                "token": token,
                "user": {"id": user.id}
            }
        }
    finally:
        db_session.close()


@router.post("/sign-out")
async def sign_out(response: Response):
    response.delete_cookie(
        key="better-auth.session_token",
        samesite="none",
        secure=False
    )
    return {"message": "Successfully signed out"}
