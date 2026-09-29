from typing import Optional, List
from sqlmodel import Session, select, func, col
from models.user_model import User
from models.video_model import Video
from models.comment_model import Comment
from schemas.video_schema import VideoUpdate


def create_video(
    session: Session,
    title: str,
    description: str,
    video_url: str,
    thumbnail_url: str,
    user_id: int,
) -> Video:
    video = Video(
        title=title,
        description=description,
        video_url=video_url,
        thumbnail_url=thumbnail_url,
        user_id=user_id,
        views=0,
    )
    session.add(video)
    session.commit()
    session.refresh(video)
    return video


def get_videos(
    session: Session,
    user_id: Optional[int] = None,
    search: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
) -> List[dict]:
    statement = (
        select(Video, User.name.label("user_name"))
        .join(User, Video.user_id == User.id)
        .order_by(Video.created_at.desc())
    )

    if user_id is not None:
        statement = statement.where(Video.user_id == user_id)

    if search:
        search_pattern = f"%{search.strip().lower()}%"
        statement = statement.where(
            func.lower(Video.title).like(search_pattern)
            | func.lower(Video.description).like(search_pattern)
        )

    statement = statement.offset(offset).limit(limit)
    results = session.exec(statement).all()

    videos_list = []
    for video, user_name in results:
        v_dict = video.model_dump()
        v_dict["user_name"] = user_name
        videos_list.append(v_dict)

    return videos_list


def get_video_by_id(
    session: Session,
    video_id: int,
    increment_views: bool = False,
) -> Optional[dict]:
    statement = (
        select(Video, User.name.label("user_name"), User.email.label("author_email"))
        .join(User, Video.user_id == User.id)
        .where(Video.id == video_id)
    )
    result = session.exec(statement).first()
    if not result:
        return None

    video, user_name, author_email = result

    if increment_views:
        video.views += 1
        session.add(video)
        session.commit()
        session.refresh(video)

    # Count comments for this video
    comments_count_stmt = select(func.count(Comment.id)).where(Comment.video_id == video_id)
    comments_count = session.exec(comments_count_stmt).one() or 0

    v_dict = video.model_dump()
    v_dict["user_name"] = user_name
    v_dict["author_email"] = author_email
    v_dict["comments_count"] = comments_count
    return v_dict


def get_recommended_videos(
    session: Session,
    exclude_video_id: int,
    limit: int = 8,
) -> List[dict]:
    statement = (
        select(Video, User.name.label("user_name"))
        .join(User, Video.user_id == User.id)
        .where(Video.id != exclude_video_id)
        .order_by(Video.views.desc(), Video.created_at.desc())
        .limit(limit)
    )
    results = session.exec(statement).all()

    recommended = []
    for video, user_name in results:
        v_dict = video.model_dump()
        v_dict["user_name"] = user_name
        recommended.append(v_dict)

    return recommended


def update_video(
    session: Session,
    video: Video,
    data: VideoUpdate,
) -> Video:
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(video, key, value)

    session.add(video)
    session.commit()
    session.refresh(video)
    return video


def delete_video(session: Session, video: Video):
    # Delete associated comments first
    comments_stmt = select(Comment).where(Comment.video_id == video.id)
    comments = session.exec(comments_stmt).all()
    for comment in comments:
        session.delete(comment)

    session.delete(video)
    session.commit()
