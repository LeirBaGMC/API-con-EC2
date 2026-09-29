from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from schemas.video_schema import VideoRead


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserRead(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserProfileRead(UserRead):
    videos_count: int = 0
    videos: List[VideoRead] = []


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead
