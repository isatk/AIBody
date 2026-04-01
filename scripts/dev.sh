#!/bin/bash

# 灵枢开发环境启动脚本
# 使用方法: ./scripts/dev.sh

set -e

echo "========================================"
echo "  灵枢开发环境启动"
echo "========================================"

# 检查Docker服务
echo "[1/5] 检查Docker服务..."
if ! docker info > /dev/null 2>&1; then
    echo "错误: Docker服务未运行，请先启动Docker"
    exit 1
fi

# 启动Docker Compose服务
echo "[2/5] 启动Docker服务 (MySQL/Redis/MinIO/Prometheus/Grafana)..."
cd "$(dirname "$0")/../deploy/docker"
docker-compose up -d

# 等待服务就绪
echo "[3/5] 等待服务就绪..."
sleep 10

# 检查服务健康状态
echo "[4/5] 检查服务健康状态..."
docker-compose ps

# 启动Go服务
echo "[5/5] 启动Go服务..."
cd "$(dirname "$0")/../src/service/go"
go run main.go &

echo ""
echo "========================================"
echo "  开发环境已启动!"
echo "========================================"
echo ""
echo "服务地址:"
echo "  - API服务:     http://localhost:8080"
echo "  - WebSocket:   ws://localhost:8080/api/v1/ws"
echo "  - Grafana:     http://localhost:3000"
echo "  - Prometheus:   http://localhost:9090"
echo "  - MinIO控制台:  http://localhost:9001"
echo ""
echo "数据库:"
echo "  - Host: localhost:3306"
echo "  - User: lingxu"
echo "  - Password: LingxuDB2024!"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo "========================================"

# 等待退出
wait
