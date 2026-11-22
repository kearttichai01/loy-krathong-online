@echo off
title Push Loy Krathong to GitHub
echo ========================================================
echo   Pushing to https://github.com/kearttichai01/loy-krathong-online
echo ========================================================
echo.
set "PATH=%LOCALAPPDATA%\Programs\MinGit\cmd;%PATH%"
cd /d "C:\Users\KearT\.gemini\antigravity\scratch\loy-krathong-web"

echo Remote is configured as:
git remote -v
echo.
echo Now pushing to GitHub...
echo.
echo (If asked for Username, enter: kearttichai01)
echo (If asked for Password, use your GitHub Personal Access Token or Token)
echo.

git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo  [SUCCESS] Code pushed to GitHub successfully!
    echo ========================================================
    echo.
    echo Next step:
    echo 1. Open: https://github.com/kearttichai01/loy-krathong-online/settings/pages
    echo 2. Set 'Source' to 'GitHub Actions'
    echo 3. Your website will be live in about 1 minute!
) else (
    echo.
    echo [NOTE] If password authentication is rejected:
    echo GitHub requires a Personal Access Token (classic) instead of password.
    echo You can create a token in 1 click at: https://github.com/settings/tokens/new
    echo (Tick 'repo' permission, copy the token, and paste it as Password)
)
echo.
pause
