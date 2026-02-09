# Server Management Guide

## Issue Description
Multiple backend servers were running on port 8001, causing conflicts and CORS errors during sign-in.

## Solution Implemented

### 1. Port Conflict Resolution
- Created `stop_servers.bat` to kill all processes using port 8001
- Modified `start_server.py` to check if port is in use before starting
- Disabled `reload=True` to prevent duplicate instances

### 2. Sign-in Issue Fixes
- Enhanced CORS configuration in `main.py` with proper headers
- Improved allowed origins list for better compatibility

## How to Use

### To Stop All Servers on Port 8001:
```
double-click stop_servers.bat
```

### To Start the Server Safely:
```
double-click start_server.bat
```

### Manual Steps (Alternative):
1. Run `stop_servers.bat` to ensure no other servers are running
2. Navigate to `phase02-todo-app/backend/`
3. Run `python start_server.py`

## Important Notes
- Only run ONE instance of the server at a time
- The server will check if port 8001 is available before starting
- If you get a port in use error, run `stop_servers.bat` first
- The sign-in should now work properly with improved CORS settings

## Troubleshooting
- If sign-in still doesn't work, check that only one server instance is running
- Make sure your frontend is running on the expected port (usually 3000)
- Clear browser cache/cookies if authentication issues persist