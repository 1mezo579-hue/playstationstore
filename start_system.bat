@echo off
set DATABASE_URL=file:./dev.db
title 2M Store System - Starter
echo Starting 2M Store Management System...
echo --------------------------------------

cd /d "%~dp0"

if not exist node_modules (
    echo node_modules not found. Installing dependencies...
    call npm install
)

echo [1/3] Preparing Database...
call npx prisma generate

echo [2/3] Seeding Admin User...
cmd /c node direct_seed.js

echo [3/3] Starting Server...
start /b cmd /c "npm run dev"

echo Waiting for server to start...
timeout /t 10 /nobreak > nul

echo Opening browser...
start http://localhost:3000

echo System is running! Keep this window open.
pause
