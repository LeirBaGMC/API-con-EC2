from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class CommentCreate(BaseModel):
    content: str


class CommentRead(BaseModel):
    id: int
    content: str
    user_id: int
    video_id: int
    created_at: datetime
    user_name: Optional[str] = None

    class Config:
        from_attributes = True
