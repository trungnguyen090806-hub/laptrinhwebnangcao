@echo off
title Khoi Chay Toan Bo He Thong TechStore
echo ========================================================
echo      KHOI CHAY TOAN BO HE THONG WEBSITE BAN HANG
echo ========================================================
echo.
echo 1. Dang mo cua so Backend Spring Boot (Port 8080)...
start "Backend - Spring Boot" cmd /k "call run-backend.bat"

echo 2. Dang mo cua so Frontend ReactJS (Port 5173)...
start "Frontend - ReactJS" cmd /k "call run-frontend.bat"

echo.
echo ========================================================
echo Da mo ca 2 cua so console!
echo Hay cho Backend khoi dong xong, sau do mo trinh duyet vao:
echo 👉 http://localhost:5173
echo ========================================================
timeout /t 5
