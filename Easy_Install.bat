@echo off
setlocal enabledelayedexpansion
title 2M Store - Easy Install
color 0B
mode con: cols=65 lines=30

echo.
echo  ========================================================
echo  =                                                      =
echo  =          2M Store Management System                  =
echo  =          Easy Install - v1.0                         =
echo  =                                                      =
echo  ========================================================
echo.
echo  [*] Checking system requirements...
echo.

:: Check Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo  [X] ERROR: Node.js is not installed!
    echo.
    echo  Please download and install Node.js from:
    echo  https://nodejs.org/
    echo.
    pause
    exit /b
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo  [OK] Node.js found: %NODE_VER%

:: Install Dependencies
echo.
echo  [*] Installing dependencies (please wait)...
call npm install --quiet --no-fund --no-audit 2>nul
if %errorlevel% neq 0 (
    echo  [X] Error during installation.
    pause
    exit /b
)
echo  [OK] Dependencies installed successfully.

:: Create Desktop Shortcut (Run_2M_Store.bat)
echo.
echo  [*] Creating launcher on Desktop...
set "DESKTOP=%USERPROFILE%\Desktop"

(
echo @echo off
echo title 2M Store System
echo color 0A
echo cd /d "%~dp0"
echo echo.
echo echo  Starting 2M Store System...
echo echo  Please wait...
echo echo.
echo start "" http://localhost:3000
echo call npm run dev
) > "%DESKTOP%\Run_2M_Store.bat"

echo  [OK] Shortcut created: Desktop\Run_2M_Store.bat

:: Create a copy of the launcher inside the project too
copy "%DESKTOP%\Run_2M_Store.bat" "%~dp0Run_2M_Store.bat" >nul

echo.
echo  ========================================================
echo  =                                                      =
echo  =   INSTALLATION COMPLETE!                             =
echo  =                                                      =
echo  =   To start the system:                               =
echo  =   Double-click "Run_2M_Store.bat" on your Desktop    =
echo  =                                                      =
echo  =   Login:                                             =
echo  =   Username: admin                                    =
echo  =   Password: 102030                                   =
echo  =                                                      =
echo  ========================================================
echo.

set /p START_NOW="  Start the system now? (y/n): "
if /i "%START_NOW%"=="y" (
    echo.
    echo  [*] Starting system...
    start "" http://localhost:3000
    call npm run dev
)

pause
