@echo off
REM Car Customizer - Complete Startup Script
REM This script starts all required services for the Car Customizer application

setlocal enabledelayedexpansion

echo.
echo ================================
echo  Car Customizer - Startup Script
echo ================================
echo.

REM Colors for output
for /F %%A in ('copy /Z "%~f0" nul') do set "BS=%%A"

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo [✓] Node.js found: !
node --version

echo [✓] Python found: !
python --version

echo.
echo Starting services...
echo.

REM Install dependencies if needed
if not exist "frontend\node_modules" (
    echo [→] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

if not exist "backend\node_modules" (
    echo [→] Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

REM Check Python virtual environment
if not exist "ai-service\venv" (
    echo [→] Setting up Python virtual environment...
    cd ai-service
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
    cd ..
) else (
    echo [✓] Python venv found
)

echo.
echo [→] Starting Frontend (http://localhost:5173)...
cd frontend
start "Car Customizer - Frontend" cmd /k npm run dev
cd ..

timeout /t 3

echo [→] Starting Backend (http://localhost:3000)...
cd backend
start "Car Customizer - Backend" cmd /k npm start
cd ..

timeout /t 3

echo [→] Starting AI Detection Service (http://localhost:8000)...
cd ai-service
call venv\Scripts\activate.bat
start "Car Customizer - AI Service" cmd /k python detect.py
cd ..

timeout /t 3

echo.
echo ================================
echo  Services starting...
echo ================================
echo.
echo Frontend:     http://localhost:5173
echo Backend API:  http://localhost:3000
echo AI Service:   http://localhost:8000
echo.
echo [!] Close any of these windows to stop that service
echo [!] Close this window to stop all services
echo.
pause
