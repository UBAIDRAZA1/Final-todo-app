from sqlmodel import create_engine, Session, SQLModel
from config.settings import settings
from sqlalchemy import text

# Create the database engine
engine = create_engine(settings.DATABASE_URL, echo=True, future=True)

def get_session():
    """
    Dependency to provide a database session
    """
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    """
    Create all tables in the database and handle schema updates
    """
    # Import models yahan taaki circular import na ho
    from models import Task, User, Conversation, Message
    from sqlalchemy.exc import IntegrityError
    from sqlalchemy import inspect

    # Get current table columns
    inspector = inspect(engine)

    # Create tables if they don't exist
    SQLModel.metadata.create_all(engine)

    # Check if Task table exists and add new columns if needed
    if 'task' in inspector.get_table_names():
        columns = [col['name'] for col in inspector.get_columns('task')]

        # Add priority column if it doesn't exist
        if 'priority' not in columns:
            with engine.connect() as conn:
                try:
                    conn.execute(text("ALTER TABLE task ADD COLUMN priority VARCHAR(20) DEFAULT 'medium'"))
                    conn.commit()
                except Exception as e:
                    print(f"Error adding priority column: {e}")

        # Add due_date column if it doesn't exist
        if 'due_date' not in columns:
            with engine.connect() as conn:
                try:
                    conn.execute(text("ALTER TABLE task ADD COLUMN due_date TIMESTAMP"))
                    conn.commit()
                except Exception as e:
                    print(f"Error adding due_date column: {e}")

        # Add tags column if it doesn't exist
        if 'tags' not in columns:
            with engine.connect() as conn:
                try:
                    conn.execute(text("ALTER TABLE task ADD COLUMN tags TEXT"))
                    conn.commit()
                except Exception as e:
                    print(f"Error adding tags column: {e}")
