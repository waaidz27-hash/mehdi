@echo off
cd /d "%~dp0"
start "OpenRouter Backend" cmd /k "npm run server"
start "Vite Frontend" cmd /k "npm run dev"
echo Launched backend and frontend in separate terminals.
pause
