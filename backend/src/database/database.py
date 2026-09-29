import os
from urllib.parse import quote_plus
from dotenv import find_dotenv, load_dotenv
from sqlmodel import Session, SQLModel, create_engine

load_dotenv(find_dotenv())

DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "videoplatform_db")

ENCODED_PASSWORD = quote_plus(DB_PASSWORD)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"postgresql+psycopg2://{DB_USER}:{ENCODED_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# Soporte flexible para SQLite en pruebas locales o PostgreSQL para Amazon RDS
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
engine_kwargs = {"echo": False}
if "sqlite" not in DATABASE_URL:
    engine_kwargs["pool_pre_ping"] = True

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    **engine_kwargs,
)


def create_database():
    global engine
    from models.user_model import User
    from models.video_model import Video
    from models.comment_model import Comment

    try:
        SQLModel.metadata.create_all(engine)
        print(f"[DATABASE] Base de datos conectada exitosamente ({DATABASE_URL.split('@')[-1]}).")
    except Exception as e:
        print(f"[DATABASE ADVERTENCIA] No se pudo conectar a PostgreSQL ({e}).")
        if "sqlite" not in DATABASE_URL:
            print("[DATABASE INFO] Activando base de datos local SQLite para pruebas locales (dev_local.db)...")
            engine = create_engine("sqlite:///./dev_local.db", connect_args={"check_same_thread": False})
            SQLModel.metadata.create_all(engine)
            print("[DATABASE] Tablas sincronizadas en SQLite local (dev_local.db).")


def get_session():
    with Session(engine) as session:
        yield session