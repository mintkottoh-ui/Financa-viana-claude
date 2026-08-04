from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/balance", response_model=schemas.BalanceSummary)
def balance_summary(start_date: date | None = None, end_date: date | None = None, db: Session = Depends(get_db)):
    return crud.get_balance_summary(db, start_date, end_date)


@router.get("/spending-by-category", response_model=list[schemas.CategorySpending])
def spending_by_category(start_date: date | None = None, end_date: date | None = None, db: Session = Depends(get_db)):
    return crud.get_spending_by_category(db, start_date, end_date)


@router.get("/summary", response_model=schemas.DashboardSummary)
def summary(start_date: date | None = None, end_date: date | None = None, db: Session = Depends(get_db)):
    goals = [crud.to_goal_out(g) for g in crud.list_goals(db, limit=1000)]
    return schemas.DashboardSummary(
        balance_summary=crud.get_balance_summary(db, start_date, end_date),
        spending_by_category=crud.get_spending_by_category(db, start_date, end_date),
        goals=goals,
    )
