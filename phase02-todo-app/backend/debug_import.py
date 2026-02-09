import os
import sys

# Add the current directory to the Python path
sys.path.insert(0, os.getcwd())

print("Current working directory:", os.getcwd())
print("Python path:", sys.path)

try:
    # Try importing the problematic module
    import models.task
    print("models.task imported successfully")
    
    # Try importing the tasks router
    from api.tasks import router as tasks_router
    print("api.tasks imported successfully")
    
    # Try importing main
    from main import app
    print("main imported successfully")
    
except ImportError as e:
    print(f"ImportError: {e}")
    import traceback
    traceback.print_exc()
except Exception as e:
    print(f"Other error: {e}")
    import traceback
    traceback.print_exc()