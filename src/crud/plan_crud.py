from sqlmodel import Session, select

from src.models.plan_model import Plan
from src.schemas.plan_schema import PlanCreate, PlanUpdate


def create_plan(session: Session, data: PlanCreate):
    plan = Plan.model_validate(data)
    session.add(plan)
    session.commit()
    session.refresh(plan)
    return plan


def get_plans(session: Session):
    return session.exec(select(Plan)).all()


def get_plan(session: Session, plan_id: int):
    return session.get(Plan, plan_id)


def update_plan(session: Session, plan: Plan, data: PlanUpdate):
    plan.sqlmodel_update(data.model_dump(exclude_unset=True))
    session.add(plan)
    session.commit()
    session.refresh(plan)
    return plan


def delete_plan(session: Session, plan: Plan):
    session.delete(plan)
    session.commit()