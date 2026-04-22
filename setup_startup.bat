@echo off
title 2M Store - Setup Auto Start
echo Setting up auto-start for 2M Store System...

set "SCRIPT_PATH=%~dp0start_system.bat"
set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT_NAME=2M_Store_System.lnk"

echo Creating shortcut for: %SCRIPT_PATH%
echo In folder: %STARTUP_FOLDER%

powershell -Command "$s=(New-Object -COM WScript.Shell).CreateShortcut('%STARTUP_FOLDER%\%SHORTCUT_NAME%');$s.TargetPath='%SCRIPT_PATH%';$s.WorkingDirectory='%~dp0';$s.Save()"

if exist "%STARTUP_FOLDER%\%SHORTCUT_NAME%" (
    echo [SUCCESS] Auto-start has been set up successfully.
    echo The system will now start automatically every time you turn on your computer.
) else (
    echo [ERROR] Failed to create shortcut. Please try running this script as Administrator.
)

pause
