package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"

	"github.com/isatk/AIBody/service/config"
	"github.com/isatk/AIBody/service/internal/api"
	"github.com/isatk/AIBody/service/internal/model"
	"github.com/isatk/AIBody/service/internal/queue"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // 生产环境应验证origin
	},
}

func main() {
	// 加载配置
	cfg := config.Load("config/config.yaml")
	if cfg == nil {
		log.Fatal("配置加载失败")
	}

	// 初始化数据库
	db, err := model.InitDB(cfg)
	if err != nil {
		log.Fatalf("数据库连接失败: %v", err)
	}

	// 初始化Redis
	redisClient := queue.InitRedis(cfg)
	if redisClient == nil {
		log.Fatal("Redis连接失败")
	}

	// 初始化任务队列
	taskQueue := queue.NewTaskQueue(redisClient)

	// 创建Gin应用
	if cfg.App.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(corsMiddleware())

	// 路由配置
	setupRoutes(r, db, taskQueue, cfg)

	// 创建服务器
	srv := &http.Server{
		Addr:    fmt.Sprintf(":%s", cfg.Server.Port),
		Handler: r,
	}

	// 启动服务器
	go func() {
		log.Printf("服务启动: http://localhost:%s", cfg.Server.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("服务器启动失败: %v", err)
		}
	}()

	// 优雅关闭
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("关闭服务...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("服务强制关闭:", err)
	}
	log.Println("服务已关闭")
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func setupRoutes(r *gin.Engine, db interface{}, taskQueue *queue.TaskQueue, cfg *config.Config) {
	// 健康检查
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "version": cfg.App.Version})
	})

	// API v1路由组
	v1 := r.Group("/api/v1")
	{
		// 认证
		auth := v1.Group("/auth")
		{
			auth.POST("/register", api.Register(db))
			auth.POST("/login", api.Login(db, cfg))
			auth.POST("/refresh", api.RefreshToken(cfg))
		}

		// 需要认证的路由
		protected := v1.Group("")
		protected.Use(api.AuthMiddleware(cfg))
		{
			// 用户
			users := protected.Group("/users")
			{
				users.GET("/me", api.GetCurrentUser(db))
				users.PUT("/me/config", api.UpdateUserConfig(db))
				users.GET("/me/config", api.GetUserConfig(db))
			}

			// 会话
			conversations := protected.Group("/conversations")
			{
				conversations.POST("", api.CreateConversation(db))
				conversations.GET("", api.ListConversations(db))
				conversations.GET("/:id", api.GetConversation(db))
				conversations.DELETE("/:id", api.DeleteConversation(db))
				conversations.GET("/:id/messages", api.GetMessages(db))
			}

			// 任务
			tasks := protected.Group("/tasks")
			{
				tasks.POST("", api.CreateTask(db, taskQueue))
				tasks.GET("", api.ListTasks(db))
				tasks.GET("/:id", api.GetTask(db))
				tasks.DELETE("/:id", api.CancelTask(taskQueue))
				tasks.GET("/:id/logs", api.GetTaskLogs(db))
			}

			// 技能
			skills := protected.Group("/skills")
			{
				skills.GET("", api.ListSkills(db))
				skills.GET("/:id", api.GetSkill(db))
			}

			// 智能体
			agents := protected.Group("/agents")
			{
				agents.GET("", api.ListAgents(db))
				agents.GET("/:id", api.GetAgent(db))
			}

			// WebSocket
			ws := protected.Group("/ws")
			{
				ws.GET("", func(c *gin.Context) {
					api.WebSocketHandler(c, upgrader, taskQueue)
				})
			}
		}
	}
}
