from sqlmodel import Session, select

from models.cliente_model import Cliente
from schemas.cliente_schema import ClienteCreate, ClienteUpdate


def create_cliente(session: Session, data: ClienteCreate):
    cliente = Cliente.model_validate(data)
    session.add(cliente)
    session.commit()
    session.refresh(cliente)
    return cliente


def get_clientes(session: Session):
    return session.exec(select(Cliente)).all()


def get_cliente(session: Session, cliente_id: int):
    return session.get(Cliente, cliente_id)


def update_cliente(
    session: Session,
    cliente: Cliente,
    data: ClienteUpdate,
):
    cliente.sqlmodel_update(data.model_dump(exclude_unset=True))
    session.add(cliente)
    session.commit()
    session.refresh(cliente)
    return cliente


def delete_cliente(session: Session, cliente: Cliente):
    session.delete(cliente)
    session.commit()