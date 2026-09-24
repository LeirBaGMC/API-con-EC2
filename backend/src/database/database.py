import os
from urllib.parse import quote_plus
from dotenv import load_dotenv, find_dotenv
from sqlmodel import Session, SQLModel, create_engine

load_dotenv(find_dotenv())

DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "postgres")

ENCODED_PASSWORD = quote_plus(DB_PASSWORD)

DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{ENCODED_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(
    DATABASE_URL,
    echo=False
)

def create_database():
    from models.cliente_model import Cliente
    from models.plan_model import Plan
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session