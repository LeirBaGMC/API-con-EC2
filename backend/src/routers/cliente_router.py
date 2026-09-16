from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from src.crud.cliente_crud import (
    create_cliente,
    delete_cliente,
    get_cliente,
    get_clientes,
    update_cliente,
)
from src.database.database import get_session
from src.models.cliente_model import Cliente
from src.schemas.cliente_schema import ClienteCreate, ClienteUpdate


router = APIRouter(
    prefix="/clientes",
    tags=["Clientes"],
)


@router.post("/", response_model=Cliente, status_code=201)
def create(data: ClienteCreate, session: Session = Depends(get_session)):
    return create_cliente(session, data)


@router.get("/", response_model=list[Cliente])
def get_all(session: Session = Depends(get_session)):
    return get_clientes(session)


@router.get("/{cliente_id}", response_model=Cliente)
def get_by_id(cliente_id: int, session: Session = Depends(get_session)):
    cliente = get_cliente(session, cliente_id)

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    return cliente


@router.patch("/{cliente_id}", response_model=Cliente)
def update(
    cliente_id: int,
    data: ClienteUpdate,
    session: Session = Depends(get_session),
):
    cliente = get_cliente(session, cliente_id)

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    return update_cliente(session, cliente, data)


@router.delete("/{cliente_id}")
def delete(cliente_id: int, session: Session = Depends(get_session)):
    cliente = get_cliente(session, cliente_id)

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    delete_cliente(session, cliente)

    return {"message": "Cliente eliminado correctamente"}
