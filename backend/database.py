from sqlmodel import create_engine, Session

DATABASE_URL = "postgresql://testuser:test1234!@localhost:5432/yt-task-maker"

engine = create_engine(DATABASE_URL, echo=True)

def get_db():
    with Session(engine) as session:
        yield session
