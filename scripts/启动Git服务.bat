@echo off
chcp 65001 >nul
title 灵枢 - Git Daemon服务
echo.
echo ========================================
echo   灵枢 - Git仓库克隆服务
echo ========================================
echo.
echo Clone地址: git://192.168.1.69/灵枢-git.git
echo 按 Ctrl+C 停止服务
echo.
git daemon --reuseaddr --base-path=G:/CodeBuddy --export-all --listen=0.0.0.0 --port=9418 "G:/CodeBuddy/灵枢-git.git"
