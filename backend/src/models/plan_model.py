from sqlmodel import Field, SQLModel


class Plan(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(index=True, unique=True)
    descripcion: str
    cobertura_maxima: float
    precio_mensual: float
    activo: bool = True 