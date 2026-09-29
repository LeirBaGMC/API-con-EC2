import os
from urllib.parse import quote_plus
from dotenv import find_dotenv, load_dotenv

load_dotenv(find_dotenv())

# Database Configuration
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "videoplatform_db")

ENCODED_PASSWORD = quote_plus(DB_PASSWORD)

# If DATABASE_URL is set directly in environment, use it; otherwise build postgresql URL
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"postgresql+psycopg2://{DB_USER}:{ENCODED_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# JWT / Security Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-video-platform-key-change-in-prod")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

# Amazon S3 Configuration
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
S3_BUCKET_VIDEOS = os.getenv("S3_BUCKET_VIDEOS", "")
S3_BUCKET_THUMBNAILS = os.getenv("S3_BUCKET_THUMBNAILS", "")

# Optional static credentials for local development if not using IAM Role
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", "")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "")

# File Upload Restrictions
MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024  # 100 MB
ALLOWED_VIDEO_EXTENSIONS = {".mp4"}
ALLOWED_THUMBNAIL_EXTENSIONS = {".jpg", ".jpeg", ".png"}
