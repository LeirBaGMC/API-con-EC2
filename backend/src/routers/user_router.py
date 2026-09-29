from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlmodel import Session
from database.database import get_session
from models.user_model import User
from schemas.user_schema import (
    Token,
    UserCreate,
    UserLogin,
    UserProfileRead,
    UserRead,
)
from crud.user_crud import (
    create_user,
    get_user_by_email,
    get_user_by_id,
    get_user_profile,
)
from core.security import (
    create_access_token,
    get_current_user,
    verify_password,
)

router = APIRouter(tags=["Usuarios"])


@router.post("/users", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register_user(data: UserCreate, session: Session = Depends(get_session)):
    existing = get_user_by_email(session, data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un usuario registrado con este correo electrónico",
        )
    return create_user(session, data)


@router.post(
    "/login",
    response_model=Token,
    openapi_extra={
        "requestBody": {
            "content": {
                "application/json": {
                    "schema": UserLogin.model_json_schema()
                },
                "application/x-www-form-urlencoded": {
                    "schema": {
                        "type": "object",
                        "properties": {
                            "username": {"type": "string", "description": "Correo electrónico"},
                            "password": {"type": "string", "format": "password"}
                        },
                        "required": ["username", "password"]
                    }
                }
            }
        }
    }
)
async def login(request: Request, session: Session = Depends(get_session)):
    content_type = request.headers.get("content-type", "")
    email = ""
    password = ""

    if "application/json" in content_type:
        try:
            body = await request.json()
            email = body.get("email", "")
            password = body.get("password", "")
        except Exception:
            pass
    else:
        try:
            form = await request.form()
            email = form.get("username") or form.get("email", "")
            password = form.get("password", "")
        except Exception:
            pass

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Se requieren correo y contraseña",
        )

    user = get_user_by_email(session, str(email).strip())
    if not user or not verify_password(str(password), user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }


@router.get("/users/me", response_model=UserProfileRead)
def get_my_profile(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    profile = get_user_profile(session, current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return profile


@router.get("/users/{user_id}", response_model=UserProfileRead)
def get_user_by_id_endpoint(
    user_id: int,
    session: Session = Depends(get_session),
):
    profile = get_user_profile(session, user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return profile
