from datetime import date

from sqlmodel import SQLModel


class ClienteCreate(SQLModel):
    identificacion: str
    nombres: str
    apellidos: str
    fecha_nacimiento: date
    correo: str
    telefono: str
    activo: bool = True


class ClienteUpdate(SQLModel):
    identificacion: str | None = None
    nombres: str | None = None
    apellidos: str | None = None
    fecha_nacimiento: date | None = None
    correo: str | None = None
    telefono: str | None = None
    activo: bool | None = None