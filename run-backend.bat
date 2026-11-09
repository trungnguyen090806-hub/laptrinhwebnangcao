@echo off
title Khoi Chay Spring Boot Backend (Port 8080)
echo ========================================================
echo   KHOI CHAY HE THONG WEBSITE BAN HANG - BACKEND
echo ========================================================
echo.

cd /d "%~dp0backend"

if "%JAVA_HOME%"=="" (
    if exist "C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.2\jbr" (
        set "JAVA_HOME=C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.2\jbr"
        set "PATH=C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.2\jbr\bin;%PATH%"
    )
)

echo Kiem tra Java:
java -version
echo.
echo Dang khoi chay Spring Boot tai http://localhost:8080 ...
echo (Vui long cho vai giay de he thong ket noi MySQL)
echo.

if exist "C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.2\plugins\maven-plugin\lib\maven3\bin\mvn.cmd" (
    "C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.2\plugins\maven-plugin\lib\maven3\bin\mvn.cmd" spring-boot:run
) else (
    mvn spring-boot:run
)

pause
