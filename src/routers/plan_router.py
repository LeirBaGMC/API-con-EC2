from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from src.crud.plan_crud import (
    create_plan,
    delete_plan,
    get_plan,
    get_plans,
    update_plan,
)
from src.database.database import get_session
from src.models.plan_model import Plan
from src.schemas.plan_schema import PlanCreate, PlanUpdate


router = APIRouter(
    prefix="/planes",
    tags=["Planes"],
)


@router.post("/", response_model=Plan, status_code=201)
def create(data: PlanCreate, session: Session = Depends(get_session)):
    return create_plan(session, data)


@router.get("/", response_model=list[Plan])
def get_all(session: Session = Depends(get_session)):
    return get_plans(session)


@router.get("/{plan_id}", response_model=Plan)
def get_by_id(plan_id: int, session: Session = Depends(get_session)):
    plan = get_plan(session, plan_id)

    if not plan:
        raise HTTPException(status_code=404, detail="Plan no encontrado")

    return plan


@router.patch("/{plan_id}", response_model=Plan)
def update(
    plan_id: int,
    data: PlanUpdate,
    session: Session = Depends(get_session),
):
    plan = get_plan(session, plan_id)

    if not plan:
        raise HTTPException(status_code=404, detail="Plan no encontrado")

    return update_plan(session, plan, data)


@router.delete("/{plan_id}")
def delete(plan_id: int, session: Session = Depends(get_session)):
    plan = get_plan(session, plan_id)

    if not plan:
        raise HTTPException(status_code=404, detail="Plan no encontrado")

    delete_plan(session, plan)

    return {"message": "Plan eliminado correctamente"}