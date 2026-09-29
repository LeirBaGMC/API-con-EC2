from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Body
from sqlmodel import Session
from database.database import get_session
from models.user_model import User
from models.video_model import Video
from schemas.video_schema import (
    VideoCreate,
    VideoDetailRead,
    VideoRead,
    VideoUpdate,
)
from crud.video_crud import (
    create_video,
    delete_video,
    get_recommended_videos,
    get_video_by_id,
    get_videos,
    update_video,
)
from services.s3_service import upload_video_and_thumbnail
from core.security import get_current_user

router = APIRouter(prefix="/videos", tags=["Videos"])


@router.post("", response_model=VideoRead, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=VideoRead, status_code=status.HTTP_201_CREATED, include_in_schema=False)
async def publish_video(
    title: str = Form(...),
    description: str = Form(""),
    video_url: Optional[str] = Form(None),
    thumbnail_url: Optional[str] = Form(None),
    video_file: Optional[UploadFile] = File(None),
    thumbnail_file: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Publica un video subiendo los archivos a Amazon S3 (o almacenamiento configurado)
    y registrando la información estructurada en la base de datos RDS.
    """
    final_video_url, final_thumbnail_url = await upload_video_and_thumbnail(
        video_file=video_file,
        thumbnail_file=thumbnail_file,
        default_video_url=video_url,
        default_thumbnail_url=thumbnail_url,
    )

    created = create_video(
        session=session,
        title=title,
        description=description,
        video_url=final_video_url,
        thumbnail_url=final_thumbnail_url,
        user_id=current_user.id,
    )

    # Return with author name
    res = created.model_dump()
    res["user_name"] = current_user.name
    return res


@router.post("/json", response_model=VideoRead, status_code=status.HTTP_201_CREATED)
def publish_video_json(
    data: VideoCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Permite publicar un video enviando directamente las URLs en formato JSON.
    """
    if not data.video_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Se requiere video_url",
        )
    thumb = data.thumbnail_url or "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60"
    created = create_video(
        session=session,
        title=data.title,
        description=data.description,
        video_url=data.video_url,
        thumbnail_url=thumb,
        user_id=current_user.id,
    )
    res = created.model_dump()
    res["user_name"] = current_user.name
    return res


@router.get("", response_model=List[VideoRead])
@router.get("/", response_model=List[VideoRead], include_in_schema=False)
def list_videos(
    user_id: Optional[int] = None,
    search: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    session: Session = Depends(get_session),
):
    """
    Lista dinámica de videos para la Página Principal o filtrado por usuario.
    """
    return get_videos(
        session=session,
        user_id=user_id,
        search=search,
        limit=limit,
        offset=offset,
    )


@router.get("/{video_id}", response_model=VideoDetailRead)
def get_video_detail(
    video_id: int,
    session: Session = Depends(get_session),
):
    """
    Detalle del video para el Reproductor. Incrementa automáticamente el contador de vistas.
    """
    video = get_video_by_id(session, video_id, increment_views=True)
    if not video:
        raise HTTPException(status_code=404, detail="Video no encontrado")
    return video


@router.get("/{video_id}/recommended", response_model=List[VideoRead])
def get_recommended(
    video_id: int,
    limit: int = 8,
    session: Session = Depends(get_session),
):
    """
    Retorna la lista de videos recomendados para la Página del Reproductor.
    """
    return get_recommended_videos(session, exclude_video_id=video_id, limit=limit)


@router.put("/{video_id}", response_model=VideoRead)
def update_video_info(
    video_id: int,
    data: VideoUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Actualiza la información del video (solo el usuario autor puede editar su video).
    """
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video no encontrado")
    if video.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para actualizar este video",
        )
    updated = update_video(session, video, data)
    res = updated.model_dump()
    res["user_name"] = current_user.name
    return res


@router.delete("/{video_id}")
def delete_video_endpoint(
    video_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Elimina un video y sus comentarios (solo el usuario autor puede eliminarlo).
    """
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video no encontrado")
    if video.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para eliminar este video",
        )
    delete_video(session, video)
    return {"message": "Video eliminado correctamente", "id": video_id}
