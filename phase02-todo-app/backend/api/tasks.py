# api/tasks.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from models import Task, TaskCreate, TaskUpdate, TaskBase, TaskResponse
from utils.database import get_session
from utils.auth import get_current_user_id
from config.settings import settings
from datetime import datetime

router = APIRouter()


@router.get("/", response_model=List[TaskResponse])
async def get_tasks(
    user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session),
    status: str = None,  # 'all', 'pending', 'completed'
    priority: str = None,  # 'urgent', 'high', 'medium', 'low'
    tag: str = None,
    due_date_from: str = None,
    due_date_to: str = None,
    sort_by: str = "created_at",  # 'created_at', 'due_date', 'priority', 'title'
    sort_order: str = "desc",  # 'asc', 'desc'
    search: str = None
):
    """
    Get tasks with optional filtering, sorting, and search
    """
    from sqlalchemy import func, desc, asc
    from datetime import datetime

    # Start with base query
    statement = select(Task).where(Task.user_id == user_id)

    # Apply status filter
    if status and status != 'all':
        if status == 'pending':
            statement = statement.where(Task.completed == False)
        elif status == 'completed':
            statement = statement.where(Task.completed == True)

    # Apply priority filter
    if priority:
        statement = statement.where(Task.priority == priority)

    # Apply tag filter
    if tag:
        statement = statement.where(func.lower(Task.tags).contains(func.lower(tag)))

    # Apply due date range filter
    if due_date_from:
        try:
            from_date = datetime.fromisoformat(due_date_from.replace('Z', '+00:00'))
            statement = statement.where(Task.due_date >= from_date)
        except ValueError:
            pass  # Invalid date format, skip filter

    if due_date_to:
        try:
            to_date = datetime.fromisoformat(due_date_to.replace('Z', '+00:00'))
            statement = statement.where(Task.due_date <= to_date)
        except ValueError:
            pass  # Invalid date format, skip filter

    # Apply search filter
    if search:
        if 'postgresql' in settings.DATABASE_URL:
            # PostgreSQL full-text search
            statement = statement.where(
                func.to_tsvector('english', Task.title + ' ' + func.coalesce(Task.description, '') + ' ' + func.coalesce(Task.tags, '')).op('@@')(func.plainto_tsquery('english', search))
            )
        else:
            # Fallback search for other databases
            statement = statement.where(
                (func.lower(Task.title).contains(func.lower(search))) |
                (func.lower(Task.description).contains(func.lower(search))) |
                (func.lower(Task.tags).contains(func.lower(search)))
            )

    # Apply sorting
    if sort_by == 'created_at':
        order_col = Task.created_at
    elif sort_by == 'due_date':
        order_col = Task.due_date
    elif sort_by == 'priority':
        # Map priority to numeric value for proper sorting
        # Use CASE WHEN for database compatibility
        order_col = func.case(
            (Task.priority == 'urgent', 4),
            (Task.priority == 'high', 3),
            (Task.priority == 'medium', 2),
            (Task.priority == 'low', 1),
            else_=0
        )
    elif sort_by == 'title':
        order_col = Task.title
    else:
        order_col = Task.created_at

    if sort_order == 'desc':
        statement = statement.order_by(desc(order_col))
    else:
        statement = statement.order_by(asc(order_col))

    tasks = session.exec(statement).all()
    return tasks


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    task = Task(
        **task_data.dict(exclude_unset=True),
        user_id=user_id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if task.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if task.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    update_data = task_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)

    # Update completion date if task is being marked as completed
    if 'completed' in update_data:
        if update_data['completed'] and task.completed_at is None:
            # Task is being marked as completed for the first time
            task.completed_at = datetime.utcnow()
        elif not update_data['completed']:
            # Task is being marked as incomplete, clear completion date
            task.completed_at = None

    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.patch("/{task_id}/toggle", response_model=TaskResponse)
async def toggle_task(
    task_id: int,
    user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if task.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    # Toggle the completion status
    task.completed = not task.completed

    # Update completion date based on new status
    if task.completed:
        # Task is being marked as completed
        if task.completed_at is None:
            task.completed_at = datetime.utcnow()
    else:
        # Task is being marked as incomplete, clear completion date
        task.completed_at = None

    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if task.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    session.delete(task)
    session.commit()
    return


@router.get("/search/", response_model=List[TaskResponse])
async def search_tasks(
    query: str,
    user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Search tasks by title and description with full-text search
    """
    from sqlalchemy import func, text

    # For PostgreSQL full-text search
    if 'postgresql' in settings.DATABASE_URL:
        # Use PostgreSQL full-text search
        statement = select(Task).where(
            (Task.user_id == user_id) &
            (
                func.to_tsvector('english', Task.title + ' ' + func.coalesce(Task.description, '') + ' ' + func.coalesce(Task.tags, '')).op('@@')(func.plainto_tsquery('english', query))
            )
        ).order_by(Task.created_at.desc())
    else:
        # Fallback for other databases (SQLite, etc.)
        statement = select(Task).where(
            (Task.user_id == user_id) &
            (
                (func.lower(Task.title).contains(func.lower(query))) |
                (func.lower(Task.description).contains(func.lower(query))) |
                (func.lower(Task.tags).contains(func.lower(query)))
            )
        ).order_by(Task.created_at.desc())

    tasks = session.exec(statement).all()
    return tasks
