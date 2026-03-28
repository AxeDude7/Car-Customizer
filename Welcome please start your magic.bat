@echo off
REM 🚗 Car Customizer - Master launcher
REM Single entrypoint for all actions, no secondary .bat dependencies

cd /d "%~dp0"

:menu
cls
echo.
echo ================================================
echo  🚗 Car Customizer Launcher - "Welcome please start your magic" 
echo ================================================

echo 1. Start all services (Backend + Frontend + AI + Watcher)
echo 2. Stop all services
echo 3. Copy .glb models from Car files\ to frontend\public\models\
echo 4. Check setup status
echo 5. Open docs and status files
echo 6. Exit

echo.
set /p choice="Choose an option [1-6]: "

if "%choice%"=="1" goto start_all
if "%choice%"=="2" goto stop_all
if "%choice%"=="3" goto copy_models
if "%choice%"=="4" goto check_status
if "%choice%"=="5" goto open_docs
if "%choice%"=="6" goto exit_script

echo Invalid choice. Press any key to try again.
pause >nul
goto menu

:start_all
echo Starting all services...

REM Backend
start "Car Customizer - Backend" cmd /k "cd /d %~dp0backend && npm start"
timeout /t 2 /nobreak >nul

REM Frontend
start "Car Customizer - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 2 /nobreak >nul

REM AI Service
start "Car Customizer - AI Service" cmd /k "cd /d %~dp0ai-service && python -m uvicorn detect:app --reload --port 8000"
timeout /t 2 /nobreak >nul

REM Ensure required directories exist
if not exist "%~dp0Car files" mkdir "%~dp0Car files"
if not exist "%~dp0frontend\public\models" mkdir "%~dp0frontend\public\models"

REM Model Watcher (runs in PowerShell window)
start "Car Customizer - Model Watcher" powershell -NoExit -Command "Set-Location -Path '%~dp0'; $watcher=New-Object System.IO.FileSystemWatcher '%~dp0Car files' -Property @{Filter='*.glb'; NotifyFilter=[System.IO.NotifyFilters]'FileName,LastWrite'; IncludeSubdirectories=$false}; Register-ObjectEvent $watcher Created -SourceIdentifier 'CarModelCreated' -Action {Start-Sleep -Milliseconds 300; Copy-Item $Event.SourceEventArgs.FullPath -Destination '%~dp0frontend\public\models\'+(Split-Path $Event.SourceEventArgs.FullPath -Leaf) -Force; Write-Host '[Auto-copy]' $Event.SourceEventArgs.Name '-> frontend/public/models'}; Register-ObjectEvent $watcher Changed -SourceIdentifier 'CarModelChanged' -Action {Start-Sleep -Milliseconds 300; Copy-Item $Event.SourceEventArgs.FullPath -Destination '%~dp0frontend\public\models\'+(Split-Path $Event.SourceEventArgs.FullPath -Leaf) -Force; Write-Host '[Auto-sync]' $Event.SourceEventArgs.Name}; $watcher.EnableRaisingEvents=$true; Write-Host 'File watcher active: Car files\ -> frontend/public/models\'; while ($true){Start-Sleep -Seconds 5}"

echo All services started.
pause
goto menu

:stop_all
echo Stopping all services...

taskkill /FI "WINDOWTITLE eq Car Customizer - Backend" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Car Customizer - Frontend" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Car Customizer - AI Service" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Car Customizer - Model Watcher" /T /F >nul 2>&1

echo All services stopped.
pause
goto menu

:copy_models
echo Copying .glb models from Car files\ to frontend\public\models\ ...

if not exist "%~dp0Car files" mkdir "%~dp0Car files"
if not exist "%~dp0frontend\public\models" mkdir "%~dp0frontend\public\models"

set "count=0"
for %%F in ("%~dp0Car files\*.glb") do (
    set /a count+=1
    copy "%%F" "%~dp0frontend\public\models\%%~nxF" >nul
    echo Copied: %%~nxF
)

echo.
if %count%==0 (
    echo No .glb files found in Car files\. Add files and run this again.
) else (
    echo %count% model(s) copied successfully.
)

pause
goto menu

:check_status
echo Checking setup status...

if exist "%~dp0frontend\public\models" (echo [✓] frontend\public\models exists) else (echo [✗] frontend\public\models missing)
if exist "%~dp0backend\data\cars.json" (echo [✓] backend\data\cars.json exists) else (echo [✗] backend\data\cars.json missing)
if exist "%~dp0Car files" (echo [✓] Car files exists) else (echo [✗] Car files missing)

set model_count=0
for %%F in ("%~dp0Car files\*.glb") do (set /a model_count+=1)
echo Car files .glb count: %model_count%

pause
goto menu

:open_docs
echo Opening documentation files...
start "" "%~dp0QUICK_START.md"
start "" "%~dp03D_MODELS_DOWNLOAD_GUIDE.md"
start "" "%~dp0AUTO_WATCHER_SYSTEM.md"
pause
goto menu

:exit_script
exit /b 0
