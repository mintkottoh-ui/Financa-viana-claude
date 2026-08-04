from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/goals", tags=["goals"])


@router.post("", response_model=schemas.SavingsGoalOut, status_code=201)
def create_goal(payload: schemas.SavingsGoalCreate, db: Session = Depends(get_db)):
    goal = crud.create_goal(db, payload)
    return crud.to_goal_out(goal)


@router.get("", response_model=list[schemas.SavingsGoalOut])
def list_goals(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    goals = crud.list_goals(db, skip, limit)
    return [crud.to_goal_out(g) for g in goals]


@router.get("/{goal_id}", response_model=schemas.SavingsGoalOut)
def get_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = crud.get_goal(db, goal_id)
    if goal is None:
        raise HTTPException(status_code=404, detail="Meta não encontrada")
    return crud.to_goal_out(goal)


@router.patch("/{goal_id}", response_model=schemas.SavingsGoalOut)
def update_goal(goal_id: int, payload: schemas.SavingsGoalUpdate, db: Session = Depends(get_db)):
    goal = crud.get_goal(db, goal_id)
    if goal is None:
        raise HTTPException(status_code=404, detail="Meta não encontrada")
    goal = crud.update_goal(db, goal, payload)
    return crud.to_goal_out(goal)


@router.post("/{goal_id}/contribute", response_model=schemas.SavingsGoalOut)
def contribute_to_goal(goal_id: int, payload: schemas.SavingsGoalContribution, db: Session = Depends(get_db)):
    goal = crud.get_goal(db, goal_id)
    if goal is None:
        raise HTTPException(status_code=404, detail="Meta não encontrada")
    goal = crud.contribute_to_goal(db, goal, payload.amount)
    return crud.to_goal_out(goal)


@router.delete("/{goal_id}", status_code=204)
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = crud.get_goal(db, goal_id)
    if goal is None:
        raise HTTPException(status_code=404, detail="Meta não encontrada")
    crud.delete_goal(db, goal)
