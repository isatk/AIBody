@echo off
chcp 65001 >nul
title 灵枢 - HTTP文件服务
echo.
echo ========================================
echo   灵枢 - HTTP文件浏览服务
echo ========================================
echo.
echo 访问地址: http://192.168.1.69:9090/
echo 按 Ctrl+C 停止服务
echo.
python -m http.server 9090 --directory "G:/CodeBuddy/灵枢"
