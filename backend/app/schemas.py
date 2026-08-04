from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from .models import TransactionType


class TransactionBase(BaseModel):
    type: TransactionType
    amount: float = Field(gt=0)
    date: date
    category: str = Field(min_length=1, max_length=50)
    description: Optional[str] = ""


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    type: Optional[TransactionType] = None
    amount: Optional[float] = Field(default=None, gt=0)
    date: Optional[date] = None
    category: Optional[str] = Field(default=None, min_length=1, max_length=50)
    description: Optional[str] = None


class TransactionOut(TransactionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class SavingsGoalBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    target_amount: float = Field(gt=0)
    current_amount: float = Field(default=0, ge=0)
    deadline: Optional[date] = None


class SavingsGoalCreate(SavingsGoalBase):
    pass


class SavingsGoalUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    target_amount: Optional[float] = Field(default=None, gt=0)
    current_amount: Optional[float] = Field(default=None, ge=0)
    deadline: Optional[date] = None


class SavingsGoalContribution(BaseModel):
    amount: float = Field(gt=0)


class SavingsGoalOut(SavingsGoalBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    progress_percent: float


class BalancePoint(BaseModel):
    date: date
    income: float
    expense: float
    balance: float


class BalanceSummary(BaseModel):
    total_income: float
    total_expense: float
    balance: float
    series: list[BalancePoint]


class CategorySpending(BaseModel):
    category: str
    total: float


class DashboardSummary(BaseModel):
    balance_summary: BalanceSummary
    spending_by_category: list[CategorySpending]
    goals: list[SavingsGoalOut]
