@echo off
setlocal
set PYTHONDONTWRITEBYTECODE=1
title VTracer Image to Vector Converter

echo.
echo  ==============================================
echo    VTracer Image to Vector Converter
echo    Fully Offline - No Internet Required
echo  ==============================================
echo.

:: Open browser
start http://127.0.0.1:8765

:: Run server in foreground (blocking)
:: Close this window to stop the server
python app.py

:: Fallback: try python3
if errorlevel 1 (
    python3 app.py
)

:: If both fail, pause to show error
if errorlevel 1 (
    echo.
    echo  [ERROR] Failed to start. Make sure Python 3 is installed.
    echo  Press any key to exit...
    pause >nul
)
