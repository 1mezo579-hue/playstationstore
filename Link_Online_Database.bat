@echo off
title Link Online Database - 2M Store
color 0E

echo ======================================================
echo           2M Store - Link Online Database
echo ======================================================
echo.
echo This script will create the tables and add users to 
echo your online Supabase database.
echo.

set /p db_url="Paste your Supabase Connection String (URI): "

if "%db_url%"=="" (
    echo Error: No URL provided.
    pause
    exit /b
)

echo.
echo [1/2] Creating tables online...
set DATABASE_URL=%db_url%
call npx prisma db push --accept-data-loss

echo.
echo [2/2] Adding default users online...
call node direct_seed.js

echo.
echo ======================================================
echo SUCCESS! Your online database is now ready.
echo Go to your website and refresh the Users page.
echo ======================================================
pause
