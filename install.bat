@echo off
REM 进入脚本所在目录
cd %~dp0

echo Installing dependencies...
cmd /c npm install --omit=dev

echo Initializing sqlite3...
timeout /t 3 /nobreak
cmd /c npx prisma generate

echo Starting the app...
timeout /t 3 /nobreak
cmd /c call run.bat

echo Press any key to exit...
pause > nul