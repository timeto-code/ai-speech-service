@echo off
REM 进入脚本所在目录
cd %~dp0

echo Installing dependencies...
cmd /c npm install --omit=dev

echo Starting the app...
cmd /c call run.bat

echo Press any key to exit...
pause > nul

