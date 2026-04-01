@echo off
chcp 65001 >nul
title 灵枢 - 一键部署本地服务
echo.
echo ========================================
echo   灵枢 - 一键部署本地服务
echo ========================================
echo.
echo 正在启动服务...
echo.

:: 启动HTTP服务（新窗口）
start "灵枢-HTTP服务" cmd /c "python -m http.server 9090 --directory ^"G:/CodeBuddy/灵枢^""

:: 启动Git服务（新窗口）
start "灵枢-Git服务" cmd /c "git daemon --reuseaddr --base-path=G:/CodeBuddy --export-all --listen=0.0.0.0 --port=9418 ^"G:/CodeBuddy/灵枢-git.git^""

echo.
echo ========================================
echo   服务已启动！
echo ========================================
echo.
echo  HTTP文件浏览: http://192.168.1.69:9090/
echo  Git克隆地址:  git://192.168.1.69/灵枢-git.git
echo.
echo  停止服务请关闭对应的命令行窗口
echo.
pause
