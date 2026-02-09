from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./todo_app.db"
    JWT_SECRET: str = "your-super-secret-jwt-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    GEMINI_API_KEY: str = "your-gemini-api-key-here"
    MCP_SERVER_URL: str = "http://localhost:8001"
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://ubaidraza-todo-web-application.vercel.app",
        "https://hafizubaid-todo-wep-app.hf.space",
        "http://localhost:3001",  # Additional local port that might be used
        "http://127.0.0.1:3001",
        "http://localhost:7860",  # Backend port
        "http://127.0.0.1:7860"
    ]

    class Config:
        env_file = ".env"


settings = Settings()