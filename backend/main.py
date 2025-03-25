from typing import Optional, List
from datetime import datetime
import os
from youtube_transcript_api import YouTubeTranscriptApi
from google import genai

import uvicorn
from fastapi import Depends, FastAPI, HTTPException
from sqlmodel import Field, Relationship, Session, SQLModel, create_engine , delete

from dotenv import load_dotenv
load_dotenv()

client = genai.Client(api_key=os.getenv("GENAI_API_KEY"))

# PostgreSQL Database URL
DATABASE_URL = 'postgresql://yt-task-maker_owner:npg_LQrOX1zZ7tiI@ep-yellow-frost-a18rhtm7-pooler.ap-southeast-1.aws.neon.tech/yt-task-maker?sslmode=require'
# DATABASE_URL = 'postgresql://testuser:test1234!@localhost:5432/yt-task-maker'
engine = create_engine(DATABASE_URL, echo=True)

# Define Models
class Pages(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    vid_id: str
    title: Optional[str] = Field(default=None)
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

@app.post("/create-page/", response_model=Pages)
def create_page(vid_url: str, session: Session = Depends(get_session)):
    try:
        split_index = vid_url.find("=")

        if split_index != -1:
            vid_id = vid_url[split_index + 1: split_index + 12]
        
        # Fetch transcript
        fetched_transcript = YouTubeTranscriptApi().fetch(vid_id)
        text = ""

        for snippet in fetched_transcript:
            text = text + snippet.text + " "

        # Generate task list using Gemini API
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=text + "\n" + "Given the youtube transcipt, provide me with a list of actionable items/tasks from the youtube videos for me to implement in my daily life as a student. Seperate these items by commas. Provide only the list of tasks, max 10",
        )
        
        
        title = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=text + "\n" + "give me a title for this in 2 words or less give as a normal text only no bold or anything else just the title",
        )

        # Extract response text
        response_text = response.text.strip()
        print(response_text)
        title = title.text.strip()
        
        # Check if the response contains a valid list or if tasks cannot be created
        if "can't be created" in response_text.lower():
            task_list = []
        else:
            # Split the response text by commas to create task list
            task_list = [task.strip() for task in response_text.split(",")]
            

        # If no tasks are created, return an empty page with no tasks
        if not task_list:
            return {"detail": "No tasks created from the transcript."}
        

        # Create a new Page entry
        new_page = Pages(vid_id=vid_id,title=title)

        # Create individual task entries and associate them with the new page
        for task_desc in task_list:
            if task_desc:  # Ensure there's a non-empty task description
                new_task = Tasks(
                    task_description=task_desc,  # Task description
                    task_status=False,  # Default task status to False (incomplete)
                    page_id=new_page.id  # Link to the page via page_id
                )
                new_page.tasks.append(new_task)

        # Add the new page with associated tasks to the session
        session.add(new_page)
        session.commit()
        session.refresh(new_page)

        return new_page

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/{vid_id}/update-title", response_model=Pages)
def update_page_title(vid_id: str, title_update: dict, session: Session = Depends(get_session)):
    try:
        # Fetch the page using the vid_id
        page = session.query(Pages).filter(Pages.vid_id == vid_id).first()

        # If the page doesn't exist, raise a 404 error
        if not page:
            raise HTTPException(status_code=404, detail="Page not found")

        # Update the title of the page
        if "title" in title_update:
            page.title = title_update["title"]

        # Commit the changes to the database
        session.commit()
        session.refresh(page)  # Ensure the page object is up-to-date

        return page  # Return the updated page

    except Exception as e:
        # Catch any other exceptions and return a 500 error
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/get-pages", response_model=List[Pages])
def get_pages(session: Session = Depends(get_session)):
    try:
        pages = session.query(Pages).all()
        return pages
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/delete-page/{vid_id}", response_model=Pages)
def delete_page(vid_id: str, session: Session = Depends(get_session)):
    try:
        # Fetch the page by its vid_id
        page = session.query(Pages).filter(Pages.vid_id == vid_id).first()

        # If the page doesn't exist, raise a 404 error
        if not page:
            raise HTTPException(status_code=404, detail="Page not found")

        # Optionally, delete all associated tasks and notes
        # Delete tasks related to this page
        for task in page.tasks:
            session.delete(task)

        # Delete notes related to this page
        for note in page.notes:
            session.delete(note)

        # Now delete the page
        session.delete(page)

        # Commit the changes to the database
        session.commit()

        # Optionally return the deleted page object (if needed)
        return page

    except Exception as e:
        # If any error occurs, return a 500 server error
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/{vid_id}/get-tasks", response_model=List[Tasks])
def get_tasks_by_page(vid_id: str, session: Session = Depends(get_session)):
    try:
        # Fetch the page to ensure it exists
        page = session.query(Pages).filter(Pages.vid_id == vid_id).first()
        if not page:
            raise HTTPException(status_code=404, detail="Page not found")

        # Fetch all tasks associated with the page by page_id
        tasks = session.query(Tasks).filter(Tasks.page_id == page.id).all()

        # If no tasks are found, return a message
        if not tasks:
            raise HTTPException(status_code=404, detail="No tasks found for this page")

        return tasks

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get-task/{task_id}",response_model=Tasks)
def get_task(task_id: int, session: Session = Depends(get_session)):
    task = session.query(Tasks).filter(Tasks.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.put("/upd-task/{task_id}", response_model=Tasks)
def update_task(task_id: int, task_update: Tasks, session: Session = Depends(get_session)):
    try:
        # Fetch the task by task_id
        task = session.get(Tasks, task_id)

        # If the task doesn't exist, raise a 404 error
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

        # Update the task's fields if they are not None
        if task_update.task_description is not None:
            task.task_description = task_update.task_description
        if task_update.task_status is not None:
            task.task_status = task_update.task_status

        # Commit the changes to the database
        session.commit()
        session.refresh(task)  # Ensure the task object is up-to-date

        return task  # Return the updated task

    except Exception as e:
        # Catch any other exceptions and return a 500 error
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/del-task/{task_id}", response_model=Tasks)
def delete_task(task_id: int, session: Session = Depends(get_session)):
    try:
        # Fetch the task by its ID
        task = session.get(Tasks, task_id)

        # If the task doesn't exist, raise a 404 error
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

        # Delete the task
        session.delete(task)

        # Commit the transaction
        session.commit()

        # Optionally return the deleted task (if you want to show what was deleted)
        return task

    except Exception as e:
        # If any error occurs, return a 500 server error
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/{vid_id}/create-note/", response_model=Notes)
def create_note(vid_id: str, note: Notes, session: Session = Depends(get_session)):
    try:
        # Fetch the page using the vid_id
        page = session.query(Pages).filter(Pages.vid_id == vid_id).first()

        # If the page doesn't exist, raise a 404 error
        if not page:
            raise HTTPException(status_code=404, detail="Page not found")

        # Create a new note associated with the page
        new_note = Notes(
            note_description=note.note_description,
            page_id=page.id  # Set the page_id to associate the note with the page
        )

        # Add the note to the session and commit
        session.add(new_note)
        session.commit()
        session.refresh(new_note)

        return new_note

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/{vid_id}/get-notes", response_model=List[Notes])
def get_notes_by_vid_id(vid_id: str, session: Session = Depends(get_session)):
    try:
        # Fetch the page using the vid_id
        page = session.query(Pages).filter(Pages.vid_id == vid_id).first()

        # If the page doesn't exist, raise a 404 error
        if not page:
            raise HTTPException(status_code=404, detail="Page not found")

        # Fetch all notes associated with the page
        notes = session.query(Notes).filter(Notes.page_id == page.id).all()

        # If no notes are found, return a message
        if not notes:
            raise HTTPException(status_code=404, detail="No notes found for this page")

        return notes

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/update-note/{note_id}", response_model=Notes)
def update_note(note_id: int, note_update: Notes, session: Session = Depends(get_session)):
    try:
        # Fetch the note by its ID
        note = session.get(Notes, note_id)

        # If the note doesn't exist, raise a 404 error
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")

        # Update the note's fields if they are provided in the request
        if note_update.note_description is not None:
            note.note_description = note_update.note_description

        # Commit the changes to the database
        session.commit()
        session.refresh(note)  # Ensure the note object is up-to-date

        return note  # Return the updated note

    except Exception as e:
        # Catch any other exceptions and return a 500 error
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/delete-note/{note_id}", response_model=Notes)
def delete_note(note_id: int, session: Session = Depends(get_session)):
    try:
        # Fetch the note by its ID
        note = session.get(Notes, note_id)

        # If the note doesn't exist, raise a 404 error
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")

        # Delete the note
        session.delete(note)

        # Commit the transaction
        session.commit()

        # Return the deleted note (optional)
        return note

    except Exception as e:
        # If any error occurs, return a 500 server error
        raise HTTPException(status_code=500, detail=str(e))
    
@app.delete("/delete-all/",responses={200: {"description": "Successfully Deleted"}, 404: {"description": "Not Found"}})
def delete_all_data(session: Session = Depends(get_session)):
    try:
        # Delete all data from the database
        session.exec(delete(Tasks))
        session.exec(delete(Notes))
        session.exec(delete(Pages))  
        session.commit()
        return {"description": "Successfully Deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the Application
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
