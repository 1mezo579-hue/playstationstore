@echo off
setlocal enabledelayedexpansion
title 2M Store - Easy Setup Wizard
color 0B

echo ======================================================
echo           2M Store Management System - Setup
echo ======================================================
echo.

:: 1. Check for Node.js
echo [1/5] Checking for Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo Error: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b
)
echo Node.js is ready.

:: 2. Install Dependencies
echo.
echo [2/5] Installing system dependencies (this may take a minute)...
call npm install --quiet
if %errorlevel% neq 0 (
    echo Error during installation. Please check your internet connection.
    pause
    exit /b
)

:: 3. Setup Database
echo.
echo [3/5] Initializing Database Engine...
set DATABASE_URL=file:./dev.db
call npx prisma generate
call node direct_seed.js

:: 4. Create Desktop Shortcut (Optional - but we'll create a simple launcher)
echo.
echo [4/5] Creating Launcher...
(
echo @echo off
echo set DATABASE_URL=file:./dev.db
echo cd /d "%%~dp0"
echo echo Starting 2M Store...
echo start http://localhost:3000
echo npm run dev
) > Run_System.bat

:: 5. Success
echo.
echo [5/5] Setup Completed Successfully!
echo ======================================================
echo.
echo To start the system in the future, just run 'Run_System.bat'
echo.
set /p startup="Do you want the system to start automatically with Windows? (y/n): "
if /i "%startup%"=="y" (
    echo Setting up auto-startup...
    set "scriptPath=%~dp0Run_System.bat"
    reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "2MStore" /t REG_SZ /d "\"!scriptPath!\"" /f
    echo Done!
)

echo.
echo The system will start now...
timeout /t 3
start http://localhost:3000
npm run dev
pause
