@echo off
title Khoi Chay ReactJS Frontend (Port 5173)
echo ========================================================
echo   KHOI CHAY HE THONG WEBSITE BAN HANG - FRONTEND
echo ========================================================
echo.

cd /d "%~dp0frontend"

echo Dang khoi chay Vite ReactJS tai http://localhost:5173 ...
echo.

call npm run dev

pause
