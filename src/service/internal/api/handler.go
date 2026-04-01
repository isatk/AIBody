package api

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"

	"github.com/isatk/AIBody/service/config"
	"github.com/isatk/AIBody/service/internal/model"
	"github.com/isatk/AIBody/service/internal/queue"
	"gorm.io/gorm"
)

// Claims JWT声明
type Claims struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// Register 注册
func Register(db interface{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Username string `json:"username" binding:"required"`
			Email    string `json:"email" binding:"required,email"`
			Password string `json:"password" binding:"required,min=6"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		dbObj := db.(*gorm.DB)
		var existing model.User
		if dbObj.Where("username = ? OR email = ?", req.Username, req.Email).First(&existing).Error == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "用户已存在"})
			return
		}

		user := model.User{
			Username:     req.Username,
			Email:        req.Email,
			PasswordHash: hashPassword(req.Password),
		}

		if err := dbObj.Create(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "创建用户失败"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
		})
	}
}

// Login 登录
func Login(db interface{}, cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Username string `json:"username" binding:"required"`
			Password string `json:"password" binding:"required"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		dbObj := db.(*gorm.DB)
		var user model.User
		if err := dbObj.Where("username = ? OR email = ?", req.Username, req.Username).First(&user).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "用户名或密码错误"})
			return
		}

		if !verifyPassword(user.PasswordHash, req.Password) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "用户名或密码错误"})
			return
		}

		accessToken, _ := generateToken(user.ID, user.Username, cfg.JWT.Secret, cfg.JWT.AccessTokenExpire)
		refreshToken, _ := generateToken(user.ID, user.Username, cfg.JWT.Secret, cfg.JWT.RefreshTokenExpire)

		c.JSON(http.StatusOK, gin.H{
			"access_token":  accessToken,
			"refresh_token": refreshToken,
			"expires_in":    cfg.JWT.AccessTokenExpire,
			"token_type":    "Bearer",
		})
	}
}

// RefreshToken 刷新Token
func RefreshToken(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			RefreshToken string `json:"refresh_token" binding:"required"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		claims, err := parseToken(req.RefreshToken, cfg.JWT.Secret)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的refresh token"})
			return
		}

		accessToken, _ := generateToken(claims.UserID, claims.Username, cfg.JWT.Secret, cfg.JWT.AccessTokenExpire)

		c.JSON(http.StatusOK, gin.H{
			"access_token": accessToken,
			"expires_in":   cfg.JWT.AccessTokenExpire,
			"token_type":   "Bearer",
		})
	}
}

// AuthMiddleware 认证中间件
func AuthMiddleware(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "缺少Authorization头"})
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的Authorization格式"})
			c.Abort()
			return
		}

		claims, err := parseToken(parts[1], cfg.JWT.Secret)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的token"})
			c.Abort()
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("username", claims.Username)
		c.Next()
	}
}

// GetCurrentUser 获取当前用户
func GetCurrentUser(db interface{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetUint("user_id")
		dbObj := db.(*gorm.DB)

		var user model.User
		if err := dbObj.First(&user, userID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "用户不存在"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
			"role":     user.Role,
		})
	}
}

// CreateTask 创建任务
func CreateTask(db interface{}, taskQueue *queue.TaskQueue) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetUint("user_id")

		var req struct {
			Type     string                 `json:"type" binding:"required"`
			Content  map[string]interface{} `json:"content" binding:"required"`
			Priority int                    `json:"priority"`
			AgentID  string                 `json:"agent_id"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		taskID := uuid.New().String()

		dbObj := db.(*gorm.DB)
		task := model.Task{
			ID:       taskID,
			UserID:   userID,
			Type:     req.Type,
			Status:   "pending",
			Priority: req.Priority,
			AgentID:  req.AgentID,
		}

		inputJSON, _ := json.Marshal(req.Content)
		task.Input = string(inputJSON)

		if err := dbObj.Create(&task).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "创建任务失败"})
			return
		}

		queueTask := &queue.Task{
			ID:       taskID,
			UserID:   userID,
			Type:     req.Type,
			Content:  req.Content,
			Priority: req.Priority,
		}
		taskQueue.Enqueue(c.Request.Context(), queueTask)

		c.JSON(http.StatusCreated, gin.H{
			"id":         task.ID,
			"status":     task.Status,
			"created_at": task.CreatedAt,
		})
	}
}

// GetTask 获取任务
func GetTask(db interface{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		taskID := c.Param("id")
		userID := c.GetUint("user_id")
		dbObj := db.(*gorm.DB)

		var task model.Task
		if err := dbObj.Where("id = ? AND user_id = ?", taskID, userID).First(&task).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "任务不存在"})
			return
		}

		c.JSON(http.StatusOK, task)
	}
}

// ListTasks 列出任务
func ListTasks(db interface{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetUint("user_id")
		dbObj := db.(*gorm.DB)

		var tasks []model.Task
		dbObj.Where("user_id = ?", userID).Order("created_at DESC").Limit(50).Find(&tasks)

		c.JSON(http.StatusOK, tasks)
	}
}

// CancelTask 取消任务
func CancelTask(taskQueue *queue.TaskQueue) gin.HandlerFunc {
	return func(c *gin.Context) {
		taskID := c.Param("id")

		if err := taskQueue.Cancel(c.Request.Context(), taskID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "取消任务失败"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "任务已取消"})
	}
}

// GetTaskLogs 获取任务日志
func GetTaskLogs(db interface{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		taskID := c.Param("id")
		dbObj := db.(*gorm.DB)

		var logs []model.TaskLog
		dbObj.Where("task_id = ?", taskID).Order("created_at ASC").Find(&logs)

		c.JSON(http.StatusOK, logs)
	}
}

// ListSkills 列出技能
func ListSkills(db interface{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		dbObj := db.(*gorm.DB)

		var skills []model.Skill
		dbObj.Where("enabled = ?", true).Find(&skills)

		c.JSON(http.StatusOK, skills)
	}
}

// GetSkill 获取技能
func GetSkill(db interface{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		dbObj := db.(*gorm.DB)

		var skill model.Skill
		if err := dbObj.First(&skill, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "技能不存在"})
			return
		}

		c.JSON(http.StatusOK, skill)
	}
}

// ListAgents 列出智能体
func ListAgents(db interface{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		dbObj := db.(*gorm.DB)

		var agents []model.Agent
		dbObj.Where("enabled = ?", true).Find(&agents)

		c.JSON(http.StatusOK, agents)
	}
}

// GetAgent 获取智能体
func GetAgent(db interface{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		dbObj := db.(*gorm.DB)

		var agent model.Agent
		if err := dbObj.First(&agent, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "智能体不存在"})
			return
		}

		c.JSON(http.StatusOK, agent)
	}
}

// CreateConversation 创建会话
func CreateConversation(db interface{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetUint("user_id")

		var req struct {
			Title   string `json:"title"`
			Config  string `json:"config"`
		}

		c.ShouldBindJSON(&req)

		dbObj := db.(*gorm.DB)
		conv := model.Conversation{
			UserID: userID,
			Title:  req.Title,
			Config: req.Config,
		}

		if err := dbObj.Create(&conv).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "创建会话失败"})
			return
		}

		c.JSON(http.StatusCreated, conv)
	}
}

// ListConversations 列出会话
func ListConversations(db interface{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetUint("user_id")
		dbObj := db.(*gorm.DB)

		var convs []model.Conversation
		dbObj.Where("user_id = ?", userID).Order("updated_at DESC").Limit(50).Find(&convs)

		c.JSON(http.StatusOK, convs)
	}
}

// GetConversation 获取会话
func GetConversation(db interface{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		userID := c.GetUint("user_id")
		dbObj := db.(*gorm.DB)

		var conv model.Conversation
		if err := dbObj.Where("id = ? AND user_id = ?", id, userID).First(&conv).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "会话不存在"})
			return
		}

		c.JSON(http.StatusOK, conv)
	}
}

// DeleteConversation 删除会话
func DeleteConversation(db interface{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		userID := c.GetUint("user_id")
		dbObj := db.(*gorm.DB)

		if err := dbObj.Where("id = ? AND user_id = ?", id, userID).Delete(&model.Conversation{}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "删除会话失败"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "会话已删除"})
	}
}

// GetMessages 获取消息
func GetMessages(db interface{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		convID := c.Param("id")
		userID := c.GetUint("user_id")
		dbObj := db.(*gorm.DB)

		// 验证会话属于用户
		var conv model.Conversation
		if err := dbObj.Where("id = ? AND user_id = ?", convID, userID).First(&conv).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "会话不存在"})
			return
		}

		var msgs []model.Message
		dbObj.Where("conversation_id = ?", convID).Order("created_at ASC").Find(&msgs)

		c.JSON(http.StatusOK, msgs)
	}
}

// UpdateUserConfig 更新用户配置
func UpdateUserConfig(db interface{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetUint("user_id")

		var req struct {
			ConfigName  string `json:"config_name"`
			Skills      string `json:"skills"`
			Agents      string `json:"agents"`
			DisplayMode string `json:"display_mode"`
		}

		c.ShouldBindJSON(&req)

		dbObj := db.(*gorm.DB)
		cfg := model.UserConfig{
			UserID:      userID,
			ConfigName:  req.ConfigName,
			Skills:      req.Skills,
			Agents:      req.Agents,
			DisplayMode: req.DisplayMode,
			IsActive:    true,
		}

		// 更新为非活跃
		dbObj.Model(&model.UserConfig{}).Where("user_id = ?", userID).Update("is_active", false)

		if err := dbObj.Create(&cfg).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "保存配置失败"})
			return
		}

		c.JSON(http.StatusOK, cfg)
	}
}

// GetUserConfig 获取用户配置
func GetUserConfig(db interface{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetUint("user_id")
		dbObj := db.(*gorm.DB)

		var cfg model.UserConfig
		if err := dbObj.Where("user_id = ? AND is_active = ?", userID, true).First(&cfg).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "配置不存在"})
			return
		}

		c.JSON(http.StatusOK, cfg)
	}
}

// WebSocketHandler WebSocket处理
func WebSocketHandler(c *gin.Context, upgrader websocket.Upgrader, taskQueue *queue.TaskQueue) {
	// 简化实现
	c.JSON(http.StatusOK, gin.H{"message": "WebSocket endpoint"})
}

// 辅助函数
func generateToken(userID uint, username, secret string, expireSeconds int) (string, error) {
	claims := &Claims{
		UserID:   userID,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(expireSeconds) * time.Second)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

func parseToken(tokenString, secret string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, jwt.ErrSignatureInvalid
}

func hashPassword(password string) string {
	// 简化实现，实际应使用bcrypt
	return password
}

func verifyPassword(hash, password string) bool {
	// 简化实现，实际应使用bcrypt
	return hash == password
}
