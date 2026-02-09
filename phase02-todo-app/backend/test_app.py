"""
Test script to validate the backend functionality
"""
from sqlmodel import Session, select
from models.task import Task  # Make sure to import Task from the correct module
from utils.database import engine
from datetime import datetime


def test_database_connection():
    """Test database connection and basic CRUD operations"""
    print("Testing database connection...")

    try:
        with Session(engine) as session:
            # Create a test task
            test_task = Task(
                title="Test Task",
                description="This is a test task",
                completed=False,
                user_id="test_user_123",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )

            session.add(test_task)
            session.commit()
            session.refresh(test_task)
            print(f"Created test task with ID: {test_task.id}")

            # Query the task back
            result = session.exec(select(Task).where(Task.id == test_task.id)).first()
            if result:
                print(f"Successfully retrieved task: {result.title}")
            else:
                print("Failed to retrieve task")

            # Clean up - delete the test task
            session.delete(test_task)
            session.commit()
            print("Test task deleted successfully")

        print("✅ Database test completed successfully!")
        return True

    except Exception as e:
        print(f"❌ Database test failed: {str(e)}")
        return False


if __name__ == "__main__":
    success = test_database_connection()
    if success:
        print("\n✓ Backend validation passed!")
    else:
        print("\n✗ Backend validation failed!")
