@echo off
cd /d "%~dp0"
start "Nauat server" cmd /k ""%~dp0scripts\dev.cmd""
powershell -NoProfile -Command "Start-Sleep -Seconds 6"
start http://192.168.1.132:3000
