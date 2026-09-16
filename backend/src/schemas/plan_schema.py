from sqlmodel import SQLModel


class PlanCreate(SQLModel):
    nombre: str
    descripcion: str
    cobertura_maxima: float
    precio_mensual: float
    activo: bool = True


class PlanUpdate(SQLModel):
    nombre: str | None = None
    descripcion: str | None = None
    cobertura_maxima: float | None = None
    precio_mensual: float | None = None
    activo: bool | None = None  