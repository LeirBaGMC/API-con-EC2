import os
import re
import uuid
import shutil
from pathlib import Path
from typing import Tuple
import boto3
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import HTTPException, UploadFile, status

from core.config import (
    ALLOWED_THUMBNAIL_EXTENSIONS,
    ALLOWED_VIDEO_EXTENSIONS,
    AWS_ACCESS_KEY_ID,
    AWS_REGION,
    AWS_SECRET_ACCESS_KEY,
    MAX_VIDEO_SIZE_BYTES,
    S3_BUCKET_THUMBNAILS,
    S3_BUCKET_VIDEOS,
)

# Base local upload paths for offline/local fallback
LOCAL_UPLOADS_DIR = Path("static/uploads")
LOCAL_VIDEOS_DIR = LOCAL_UPLOADS_DIR / "videos"
LOCAL_THUMBNAILS_DIR = LOCAL_UPLOADS_DIR / "thumbnails"

LOCAL_VIDEOS_DIR.mkdir(parents=True, exist_ok=True)
LOCAL_THUMBNAILS_DIR.mkdir(parents=True, exist_ok=True)


def get_s3_client():
    """
    Returns boto3 S3 client.
    In EC2, if an IAM role is attached, it will resolve credentials automatically.
    In local environment, it uses environment variables if provided.
    """
    if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY:
        return boto3.client(
            "s3",
            region_name=AWS_REGION,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        )
    return boto3.client("s3", region_name=AWS_REGION)


def sanitize_filename(filename: str) -> str:
    base = os.path.basename(filename)
    clean_name = re.sub(r"[^a-zA-Z0-9_.-]", "_", base)
    return f"{uuid.uuid4().hex[:12]}_{clean_name}"


def validate_video_file(file: UploadFile) -> str:
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_VIDEO_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Formato de video no permitido ({ext}). Solo se permite formato MP4.",
        )
    return ext


def validate_thumbnail_file(file: UploadFile) -> str:
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_THUMBNAIL_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Formato de miniatura no permitido ({ext}). Solo se permiten JPG, JPEG o PNG.",
        )
    return ext


async def upload_file_to_s3_or_local(
    file: UploadFile,
    bucket_name: str,
    folder_type: str,  # 'videos' or 'thumbnails'
    max_size: int | None = None,
) -> str:
    """
    Uploads file to Amazon S3 bucket if configured and available.
    Falls back gracefully to local static storage for offline local testing.
    """
    safe_filename = sanitize_filename(file.filename or "file")
    s3_key = f"{folder_type}/{safe_filename}"

    # Read content to check file size if max_size is given
    content = await file.read()
    if max_size and len(content) > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"El archivo excede el tamaño máximo permitido de {max_size / (1024 * 1024):.0f} MB.",
        )

    # Attempt S3 upload if bucket is specified
    if bucket_name:
        try:
            s3 = get_s3_client()
            content_type = file.content_type or (
                "video/mp4" if folder_type == "videos" else "image/jpeg"
            )
            s3.put_object(
                Bucket=bucket_name,
                Key=s3_key,
                Body=content,
                ContentType=content_type,
            )
            return f"https://{bucket_name}.s3.{AWS_REGION}.amazonaws.com/{s3_key}"
        except (BotoCoreError, ClientError, Exception) as e:
            # If S3 fails or is not reachable locally, fallback to local storage
            print(f"[ADVERTENCIA S3] No se pudo subir a S3 ({e}). Guardando localmente.")

    # Local fallback
    dest_dir = LOCAL_VIDEOS_DIR if folder_type == "videos" else LOCAL_THUMBNAILS_DIR
    local_file_path = dest_dir / safe_filename
    with open(local_file_path, "wb") as f:
        f.write(content)

    return f"/static/uploads/{folder_type}/{safe_filename}"


async def upload_video_and_thumbnail(
    video_file: UploadFile | None,
    thumbnail_file: UploadFile | None,
    default_video_url: str | None = None,
    default_thumbnail_url: str | None = None,
) -> Tuple[str, str]:
    """
    Handles uploading both video and thumbnail files, returning their URLs.
    """
    video_url = default_video_url or ""
    thumbnail_url = default_thumbnail_url or ""

    if video_file and video_file.filename:
        validate_video_file(video_file)
        video_url = await upload_file_to_s3_or_local(
            file=video_file,
            bucket_name=S3_BUCKET_VIDEOS,
            folder_type="videos",
            max_size=MAX_VIDEO_SIZE_BYTES,
        )

    if thumbnail_file and thumbnail_file.filename:
        validate_thumbnail_file(thumbnail_file)
        thumbnail_url = await upload_file_to_s3_or_local(
            file=thumbnail_file,
            bucket_name=S3_BUCKET_THUMBNAILS,
            folder_type="thumbnails",
        )

    if not video_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Debe proporcionar un archivo de video MP4 o una URL válida.",
        )

    if not thumbnail_url:
        # Default placeholder thumbnail if none uploaded
        thumbnail_url = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60"

    return video_url, thumbnail_url
