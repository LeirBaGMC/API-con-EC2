from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from database.database import get_session
from models.user_model import User
from models.video_model import Video
from schemas.comment_schema import CommentCreate, CommentRead
from crud.comment_crud import create_comment, get_comments_by_video_id
from core.security import get_current_user

router = APIRouter(prefix="/videos", tags=["Comentarios"])


@router.post("/{video_id}/comments", response_model=CommentRead, status_code=status.HTTP_201_CREATED)
def add_comment(
    video_id: int,
    data: CommentCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Publica un nuevo comentario en un video.
    """
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video no encontrado")

    if not data.content.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El contenido del comentario no puede estar vacío",
        )

    return create_comment(
        session=session,
        video_id=video_id,
        user_id=current_user.id,
        content=data.content,
    )


@router.get("/{video_id}/comments", response_model=List[CommentRead])
def list_comments(
    video_id: int,
    session: Session = Depends(get_session),
):
    """
    Lista todos los comentarios de un video ordenados cronológicamente.
    """
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video no encontrado")

    return get_comments_by_video_id(session, video_id)
