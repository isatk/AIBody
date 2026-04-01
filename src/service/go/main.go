package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"

	"lingxu/config"
	"lingxu/handlers"
	"lingxu/middleware"
	"lingxu/models"
	"lingxu/services/queue"
	"lingxu/services/gateway"
)

// @title 灵枢 API
// @version 1.0
// @description 灵枢私有化AI智能中枢 API

func main() {
	// 加载配置
	cfg := config.Load()

	// 初始化数据库
	db, err := models.InitDB(cfg.Database)
	if err != nil {
		log.Fatalf("数据库连接失败: %v", err)
	}

	// 初始化Redis
	redis := models.InitRedis(cfg.Redis)

	// 初始化任务队列
	taskQueue := queue.NewTaskQueue(redis)

	// 初始化openclaw网关连接
	openclawGateway := gateway.NewOpenclawGateway(cfg.Engine)

	// 创建Gin应用
	r := gin.Default()

	// 中间件
	r.Use(middleware.CORS())
	r.Use(middleware.Logger())
	r.Use(middleware.Recovery())

	// WebSocket升级配置
	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true // 生产环境应验证origin
		},
	}

	// 路由组
	api := r.Group("/api/v1")
	{
		// 认证
		auth := api.Group("/auth")
		{
			auth.POST("/register", handlers.Register(db))
			auth.POST("/login", handlers.Login(db, cfg.JWT))
			auth.POST("/refresh", handlers.RefreshToken(cfg.JWT))
		}

		// 需要认证的路由
		protected := api.Group("")
		protected.Use(middleware.Auth(cfg.JWT))
		{
			// 用户
			users := protected.Group("/users")
			{
				users.GET("/me", handlers.GetCurrentUser())
				users.PUT("/me/config", handlers.UpdateUserConfig(db))
				users.GET("/me/config", handlers.GetUserConfig(db))
			}

			// 会话
			conversations := protected.Group("/conversations")
			{
				conversations.POST("", handlers.CreateConversation(db))
				conversations.GET("", handlers.ListConversations(db))
				conversations.GET("/:id", handlers.GetConversation(db))
				conversations.DELETE("/:id", handlers.DeleteConversation(db))
				conversations.GET("/:id/messages", handlers.GetMessages(db))
			}

			// 任务
			tasks := protected.Group("/tasks")
			{
				tasks.POST("", handlers.CreateTask(db, taskQueue, openclawGateway))
				tasks.GET("", handlers.ListTasks(db))
				tasks.GET("/:id", handlers.GetTask(db))
				tasks.DELETE("/:id", handlers.CancelTask(taskQueue))
				tasks.GET("/:id/logs", handlers.GetTaskLogs(db))
			}

			// 技能
			skills := protected.Group("/skills")
			{
				skills.GET("", handlers.ListSkills(db))
				skills.GET("/:id", handlers.GetSkill(db))
			}

			// 智能体
			agents := protected.Group("/agents")
			{
				agents.GET("", handlers.ListAgents(db))
				agents.GET("/:id", handlers.GetAgent(db))
			}

			// WebSocket
			ws := protected.Group("/ws")
			{
				ws.GET("", func(c *gin.Context) {
					handlers.WebSocketHandler(c, upgrader, taskQueue, openclawGateway)
				})
			}
		}
	}

	// 健康检查
	r.GET("/health", handlers.Health())

	// 启动服务器
	go func() {
		if err := r.Run(":" + cfg.Server.Port); err != nil {
			log.Fatalf("服务器启动失败: %v", err)
		}
	}()

	// 优雅关闭
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("关闭服务...")
}
