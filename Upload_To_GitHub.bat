@echo off
title GitHub Upload Assistant - 2M Store (Clean Version)
color 0A

echo ======================================================
echo           2M Store - GitHub Upload Assistant
echo ======================================================
echo.

git add .
git commit -m "Cleanup and switch to Pure Supabase SDK"
git push origin main

echo.
echo ======================================================
echo Clean code uploaded! 
echo Your system is now using the modern Supabase SDK.
echo ======================================================
pause
