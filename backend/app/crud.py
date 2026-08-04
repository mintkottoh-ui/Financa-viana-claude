from collections import defaultdict
from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from . import models, schemas


# ---------- Transactions ----------

def create_transaction(db: Session, data: schemas.TransactionCreate) -> models.Transaction:
    transaction = models.Transaction(**data.model_dump())
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


def get_transaction(db: Session, transaction_id: int) -> models.Transaction | None:
    return db.get(models.Transaction, transaction_id)


def list_transactions(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    type: models.TransactionType | None = None,
    category: str | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
) -> list[models.Transaction]:
    query = db.query(models.Transaction)
    if type is not None:
        query = query.filter(models.Transaction.type == type)
    if category is not None:
        query = query.filter(models.Transaction.category == category)
    if start_date is not None:
        query = query.filter(models.Transaction.date >= start_date)
    if end_date is not None:
        query = query.filter(models.Transaction.date <= end_date)
    return (
        query.order_by(models.Transaction.date.desc(), models.Transaction.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def update_transaction(
    db: Session, transaction: models.Transaction, data: schemas.TransactionUpdate
) -> models.Transaction:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(transaction, field, value)
    db.commit()
    db.refresh(transaction)
    return transaction


def delete_transaction(db: Session, transaction: models.Transaction) -> None:
    db.delete(transaction)
    db.commit()


# ---------- Savings Goals ----------

def _goal_progress_percent(goal: models.SavingsGoal) -> float:
    if goal.target_amount <= 0:
        return 0.0
    return round(min(goal.current_amount / goal.target_amount, 1.0) * 100, 2)


def to_goal_out(goal: models.SavingsGoal) -> schemas.SavingsGoalOut:
    return schemas.SavingsGoalOut(
        id=goal.id,
        name=goal.name,
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        deadline=goal.deadline,
        created_at=goal.created_at,
        progress_percent=_goal_progress_percent(goal),
    )


def create_goal(db: Session, data: schemas.SavingsGoalCreate) -> models.SavingsGoal:
    goal = models.SavingsGoal(**data.model_dump())
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


def get_goal(db: Session, goal_id: int) -> models.SavingsGoal | None:
    return db.get(models.SavingsGoal, goal_id)


def list_goals(db: Session, skip: int = 0, limit: int = 100) -> list[models.SavingsGoal]:
    return (
        db.query(models.SavingsGoal)
        .order_by(models.SavingsGoal.deadline.asc().nulls_last())
        .offset(skip)
        .limit(limit)
        .all()
    )


def update_goal(db: Session, goal: models.SavingsGoal, data: schemas.SavingsGoalUpdate) -> models.SavingsGoal:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(goal, field, value)
    db.commit()
    db.refresh(goal)
    return goal


def contribute_to_goal(db: Session, goal: models.SavingsGoal, amount: float) -> models.SavingsGoal:
    goal.current_amount += amount
    db.commit()
    db.refresh(goal)
    return goal


def delete_goal(db: Session, goal: models.SavingsGoal) -> None:
    db.delete(goal)
    db.commit()


# ---------- Dashboard ----------

def get_balance_summary(
    db: Session, start_date: date | None = None, end_date: date | None = None
) -> schemas.BalanceSummary:
    query = db.query(models.Transaction)
    if start_date is not None:
        query = query.filter(models.Transaction.date >= start_date)
    if end_date is not None:
        query = query.filter(models.Transaction.date <= end_date)
    transactions = query.order_by(models.Transaction.date.asc()).all()

    totals_by_day: dict[date, dict[str, float]] = defaultdict(lambda: {"income": 0.0, "expense": 0.0})
    total_income = 0.0
    total_expense = 0.0

    for t in transactions:
        if t.type == models.TransactionType.ENTRADA:
            totals_by_day[t.date]["income"] += t.amount
            total_income += t.amount
        else:
            totals_by_day[t.date]["expense"] += t.amount
            total_expense += t.amount

    series: list[schemas.BalancePoint] = []
    running_balance = 0.0
    for day in sorted(totals_by_day.keys()):
        day_income = totals_by_day[day]["income"]
        day_expense = totals_by_day[day]["expense"]
        running_balance += day_income - day_expense
        series.append(
            schemas.BalancePoint(date=day, income=day_income, expense=day_expense, balance=running_balance)
        )

    return schemas.BalanceSummary(
        total_income=total_income,
        total_expense=total_expense,
        balance=total_income - total_expense,
        series=series,
    )


def get_spending_by_category(
    db: Session, start_date: date | None = None, end_date: date | None = None
) -> list[schemas.CategorySpending]:
    query = db.query(
        models.Transaction.category, func.sum(models.Transaction.amount).label("total")
    ).filter(models.Transaction.type == models.TransactionType.SAIDA)
    if start_date is not None:
        query = query.filter(models.Transaction.date >= start_date)
    if end_date is not None:
        query = query.filter(models.Transaction.date <= end_date)
    rows = query.group_by(models.Transaction.category).order_by(func.sum(models.Transaction.amount).desc()).all()
    return [schemas.CategorySpending(category=row.category, total=row.total) for row in rows]
