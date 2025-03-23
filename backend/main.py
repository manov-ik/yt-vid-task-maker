from typing import Optional, List
from datetime import datetime
import os

import uvicorn
from fastapi import Depends, FastAPI, HTTPException
from sqlmodel import Field, Relationship, Session, SQLModel, create_engine

# PostgreSQL Database URL
DATABASE_URL = 'postgresql://testuser:test1234!@localhost:5432/yt-task-maker'
engine = create_engine(DATABASE_URL, echo=True)

# Define Models
class Pages(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    vid_id: str
    time_created: datetime = Field(default_factory=datetime.utcnow)

    tasks: List["Tasks"] = Relationship(back_populates="page")
    notes: List["Notes"] = Relationship(back_populates="page")


class Tasks(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    task_description: str
    task_status: bool = Field(default=False)
    page_id: int = Field(foreign_key="pages.id")

    page: Pages = Relationship(back_populates="tasks")


class Notes(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    note_description: str
    time_created: datetime = Field(default_factory=datetime.utcnow)
    page_id: int = Field(foreign_key="pages.id")

    page: Pages = Relationship(back_populates="notes")


# Initialize FastAPI App
app = FastAPI()

# Dependency for DB Session
def get_session():
    with Session(engine) as session:
        yield session


# CRUD Routes
@app.post("/pages/", response_model=Pages)
def create_page(page: Pages, session: Session = Depends(get_session)):
    session.add(page)
    session.commit()
    session.refresh(page)
    return page


@app.post("/tasks/", response_model=Tasks)
def create_task(task: Tasks, session: Session = Depends(get_session)):
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@app.post("/notes/", response_model=Notes)
def create_note(note: Notes, session: Session = Depends(get_session)):
    session.add(note)
    session.commit()
    session.refresh(note)
    return note


@app.get("/pages/{page_id}", response_model=Pages)
def get_page(page_id: int, session: Session = Depends(get_session)):
    page = session.get(Pages, page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page


@app.get("/tasks/{task_id}", response_model=Tasks)
def get_task(task_id: int, session: Session = Depends(get_session)):
    task = session.get(Tasks, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.get("/notes/{note_id}", response_model=Notes)
def get_note(note_id: int, session: Session = Depends(get_session)):
    note = session.get(Notes, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


# Run the Application
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8080)
