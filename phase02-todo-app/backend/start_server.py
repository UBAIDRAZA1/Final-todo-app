import sys
import os
import socket
from pathlib import Path

def check_port_in_use(port):
    """Check if a port is currently in use"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Change working directory to backend
os.chdir(backend_dir)

PORT = 8001

print(f"Current working directory: {os.getcwd()}")
print(f"Checking if port {PORT} is in use...")

if check_port_in_use(PORT):
    print(f"ERROR: Port {PORT} is already in use. Please stop the existing server first.")
    print("Run the stop_servers.bat script in the parent directory to stop all servers on port 8001.")
    sys.exit(1)

print(f"Port {PORT} is available. Proceeding to start server...")

print(f"Python path: {sys.path[:3]}...")  # Show first 3 entries

try:
    print("Attempting to import main...")
    from main import app
    print("Main app imported successfully!")

    print("Attempting to import API routes...")
    from api.tasks import router as tasks_router
    from api.auth import router as auth_router
    from api.chat import router as chat_router
    print("All API routes imported successfully!")

    # Now run the app
    import uvicorn
    print(f"Starting server on http://127.0.0.1:{PORT}")
    print("Server started successfully!")
    uvicorn.run(app, host="127.0.0.1", port=PORT, reload=False)  # Changed reload to False to prevent duplicate instances

except ImportError as e:
    print(f"Import error: {e}")
    import traceback
    traceback.print_exc()
except Exception as e:
    print(f"General error: {e}")
    import traceback
    traceback.print_exc()