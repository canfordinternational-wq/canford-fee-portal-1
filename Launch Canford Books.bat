@echo off
title Canford Books - Institutional Accounting & Billing Software
echo Starting Canford Books...

REM Launch in standalone native desktop app mode (no browser address bar/tabs)
start msedge.exe --app="file:///%~dp0index.html" --window-size=1280,820

if errorlevel 1 (
    REM Fallback to default browser if msedge app mode fails
    start "" "%~dp0index.html"
)
exit
