from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Pages(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    vid_id: str
    time_created: datetime = Field(default_factory=datetime.utcnow)  

class Tasks(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    task_description: str
    task_status: bool = Field(default=False)  
    page_id: int = Field(foreign_key="pages.id")  

class Notes(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    note_description: str
    time_created: datetime = Field(default_factory=datetime.utcnow)  
    page_id: int = Field(foreign_key="pages.id")  
