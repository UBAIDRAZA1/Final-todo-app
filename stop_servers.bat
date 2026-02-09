@echo off
echo Stopping all processes running on port 8001...

REM Find and kill processes using port 8001
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8001') do (
    echo Killing process with PID: %%a
    taskkill /f /pid %%a
)

echo All processes on port 8001 have been stopped.
pause