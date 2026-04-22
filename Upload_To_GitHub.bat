@echo off
title GitHub Upload Assistant - 2M Store
color 0A

echo ======================================================
echo           2M Store - GitHub Upload Assistant
echo ======================================================
echo.

:: Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo Error: Git is not installed!
    echo Please install Git from https://git-scm.com/
    pause
    exit /b
)

echo [1/4] Initializing Git...
git init

echo.
echo [2/4] Adding files...
git add .

echo.
echo [3/4] Committing changes...
git commit -m "Initial online-ready version of 2M Store"

echo.
echo ======================================================
echo PLEASE READ CAREFULLY:
echo 1. Go to your GitHub account.
echo 2. Create a NEW repository (name it: playstation-store-manager).
echo 3. Copy the URL of the repository (e.g., https://github.com/YourName/repo.git).
echo ======================================================
echo.
set /p repo_url="Paste your GitHub Repository URL here: "

if "%repo_url%"=="" (
    echo Error: No URL provided.
    pause
    exit /b
)

echo.
echo [4/4] Connecting and Uploading...
git remote add origin %repo_url%
git branch -M main
git push -u origin main

echo.
echo ======================================================
echo Done! Your code is now on GitHub.
echo Next step: Connect this repo to Vercel.com
echo ======================================================
pause
