import enum
from datetime import date, datetime

from sqlalchemy import Column, Date, DateTime, Enum, Float, Integer, String
from sqlalchemy.sql import func

from .database import Base


class TransactionType(str, enum.Enum):
    ENTRADA = "entrada"
    SAIDA = "saida"


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum(TransactionType), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    date = Column(Date, nullable=False, default=date.today, index=True)
    category = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SavingsGoal(Base):
    __tablename__ = "savings_goals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, nullable=False, default=0)
    deadline = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
