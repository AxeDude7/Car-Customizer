@echo off
REM Install frontend dependencies
cd frontend
echo Installing frontend dependencies...
call npm install

REM Install backend dependencies
cd ..\backend
echo Installing backend dependencies...
call npm install

REM Install AI service dependencies
cd ..\ai-service
echo Installing AI service dependencies...
python -m pip install -r requirements.txt

cd ..
echo All dependencies installed successfully!
pause
