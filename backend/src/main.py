from contextlib import asynccontextmanager

from fastapi import FastAPI

from database.database import create_database
from routers.cliente_router import router as cliente_router
from routers.plan_router import router as plan_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_database()
    yield


app = FastAPI(
    title="Medical Insurance API",
    description="API para gestionar clientes y planes médicos",
    version="1.1.1",
    lifespan=lifespan,
)


app.include_router(plan_router)
app.include_router(cliente_router)


@app.get("/")
def root():
    return {"message": "Medical Insurance API funcionando"}