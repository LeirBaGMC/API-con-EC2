from pathlib import Path
from sqlmodel import Session, SQLModel, create_engine

# Resuelve la ruta hacia backend/ (database.py -> database/ -> src/ -> backend/)
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DB_PATH = BASE_DIR / "insurance.db"

DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)


def create_database():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session