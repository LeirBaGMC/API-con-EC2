import os
import sys
from pathlib import Path
from contextlib import asynccontextmanager

# Asegurar que el directorio 'src' esté en sys.path para resolución de módulos en local y EC2/PM2
src_dir = str(Path(__file__).parent.resolve())
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database.database import create_database
from routers.user_router import router as user_router
from routers.video_router import router as video_router
from routers.comment_router import router as comment_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Crear tablas en Amazon RDS / PostgreSQL al iniciar
    create_database()
    yield


app = FastAPI(
    title="Plataforma de Videos API",
    description="API REST para plataforma de videos (React + FastAPI + Amazon S3 + EC2 + Amazon RDS)",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configuración de CORS para permitir peticiones desde la SPA en React (S3 o local)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar directorio estático para fallback local de archivos
os.makedirs("static/uploads/videos", exist_ok=True)
os.makedirs("static/uploads/thumbnails", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Registro de routers
app.include_router(user_router)
app.include_router(video_router)
app.include_router(comment_router)


@app.get("/", tags=["Health"])
def root():
    return {
        "message": "Plataforma de Videos API funcionando correctamente en Amazon EC2",
        "docs": "/docs",
        "status": "online",
    }