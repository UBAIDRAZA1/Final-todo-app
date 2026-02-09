@echo off
echo Starting the backend server on port 8001...

REM Navigate to the backend directory
cd /d "C:\Users\Administrator\Downloads\phase lll\phase02-todo-app\backend"

REM Activate the virtual environment if it exists
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
    echo Virtual environment activated.
) else (
    echo Warning: Virtual environment not found. Make sure dependencies are installed.
)

REM Start the server using the improved start script
python start_server.py

pause