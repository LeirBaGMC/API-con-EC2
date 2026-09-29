from typing import Optional
from sqlmodel import Session, select, func
from models.user_model import User
from models.video_model import Video
from schemas.user_schema import UserCreate
from core.security import hash_password


def get_user_by_id(session: Session, user_id: int) -> Optional[User]:
    return session.get(User, user_id)


def get_user_by_email(session: Session, email: str) -> Optional[User]:
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()


def create_user(session: Session, data: UserCreate) -> User:
    hashed_pwd = hash_password(data.password)
    user = User(
        name=data.name,
        email=data.email,
        password_hash=hashed_pwd,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def get_user_profile(session: Session, user_id: int):
    user = get_user_by_id(session, user_id)
    if not user:
        return None

    # Get count of videos uploaded by user
    count_stmt = select(func.count(Video.id)).where(Video.user_id == user_id)
    videos_count = session.exec(count_stmt).one() or 0

    # Get list of videos uploaded by user
    videos_stmt = (
        select(Video)
        .where(Video.user_id == user_id)
        .order_by(Video.created_at.desc())
    )
    user_videos = session.exec(videos_stmt).all()

    # Attach author name to each video item for consistency
    videos_with_author = []
    for vid in user_videos:
        vid_dict = vid.model_dump()
        vid_dict["user_name"] = user.name
        videos_with_author.append(vid_dict)

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "created_at": user.created_at,
        "videos_count": videos_count,
        "videos": videos_with_author,
    }
