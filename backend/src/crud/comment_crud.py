from typing import List, Optional
from sqlmodel import Session, select
from models.user_model import User
from models.comment_model import Comment
from schemas.comment_schema import CommentCreate


def create_comment(
    session: Session,
    video_id: int,
    user_id: int,
    content: str,
) -> dict:
    comment = Comment(
        content=content.strip(),
        user_id=user_id,
        video_id=video_id,
    )
    session.add(comment)
    session.commit()
    session.refresh(comment)

    # Fetch user name for response
    user = session.get(User, user_id)
    user_name = user.name if user else "Usuario"

    c_dict = comment.model_dump()
    c_dict["user_name"] = user_name
    return c_dict


def get_comments_by_video_id(session: Session, video_id: int) -> List[dict]:
    statement = (
        select(Comment, User.name.label("user_name"))
        .join(User, Comment.user_id == User.id)
        .where(Comment.video_id == video_id)
        .order_by(Comment.created_at.desc())
    )
    results = session.exec(statement).all()

    comments_list = []
    for comment, user_name in results:
        c_dict = comment.model_dump()
        c_dict["user_name"] = user_name
        comments_list.append(c_dict)

    return comments_list


def get_comment_by_id(session: Session, comment_id: int) -> Optional[Comment]:
    return session.get(Comment, comment_id)


def delete_comment(session: Session, comment: Comment):
    session.delete(comment)
    session.commit()
