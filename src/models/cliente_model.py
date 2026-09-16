from datetime import date

from sqlmodel import Field, SQLModel


class Cliente(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    identificacion: str = Field(unique=True)
    nombres: str
    apellidos: str
    fecha_nacimiento: date
    correo: str = Field(unique=True)
    telefono: str
    activo: bool = True