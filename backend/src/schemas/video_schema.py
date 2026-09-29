from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class VideoBase(BaseModel):
    title: str
    description: str = ""


class VideoCreate(VideoBase):
    video_url: str = ""
    thumbnail_url: str = ""


class VideoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None


class VideoRead(BaseModel):
    id: int
    title: str
    description: str
    video_url: str
    thumbnail_url: str
    views: int
    user_id: int
    created_at: datetime
    user_name: Optional[str] = None

    class Config:
        from_attributes = True


class VideoDetailRead(VideoRead):
    comments_count: int = 0
    author_email: Optional[str] = None
