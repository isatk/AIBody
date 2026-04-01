package model

import (
	"fmt"
	"time"

	"github.com/isatk/AIBody/service/config"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// InitDB 初始化数据库连接
func InitDB(cfg *config.Config) (*gorm.DB, error) {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		cfg.Database.Username,
		cfg.Database.Password,
		cfg.Database.Host,
		cfg.Database.Port,
		cfg.Database.Name,
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}

	sqlDB.SetMaxOpenConns(cfg.Database.MaxOpenConns)
	sqlDB.SetMaxIdleConns(cfg.Database.MaxIdleConns)
	sqlDB.SetConnMaxLifetime(time.Duration(cfg.Database.ConnMaxLifetime) * time.Second)

	return db, nil
}

// User 用户模型
type User struct {
	ID           uint      `gorm:"primarykey" json:"id"`
	Username     string    `gorm:"uniqueIndex;size:50;not null" json:"username"`
	Email        string    `gorm:"uniqueIndex;size:100;not null" json:"email"`
	PasswordHash string    `gorm:"size:255;not null" json:"-"`
	Role         string    `gorm:"size:20;default:user" json:"role"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	LastLoginAt  *time.Time `json:"last_login_at"`
}

// TableName 表名
func (User) TableName() string {
	return "users"
}

// Conversation 会话模型
type Conversation struct {
	ID        uint      `gorm:"primarykey" json:"id"`
	UserID    uint      `gorm:"not null;index" json:"user_id"`
	Title     string    `gorm:"size:255;default:新会话" json:"title"`
	Config    string    `gorm:"type:json" json:"config"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at"`
	User      User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

// TableName 表名
func (Conversation) TableName() string {
	return "conversations"
}

// Message 消息模型
type Message struct {
	ID             uint      `gorm:"primarykey" json:"id"`
	ConversationID uint      `gorm:"not null;index" json:"conversation_id"`
	Role           string    `gorm:"size:20;not null" json:"role"` // user/assistant/system
	Content        string    `gorm:"type:text;not null" json:"content"`
	Metadata       string    `gorm:"type:json" json:"metadata"`
	CreatedAt      time.Time `json:"created_at"`
	Conversation   Conversation `gorm:"foreignKey:ConversationID" json:"conversation,omitempty"`
}

// TableName 表名
func (Message) TableName() string {
	return "messages"
}

// Task 任务模型
type Task struct {
	ID          string     `gorm:"primarykey;size:36" json:"id"` // UUID
	UserID      uint       `gorm:"not null;index" json:"user_id"`
	AgentID     string     `gorm:"size:36;index" json:"agent_id"`
	Type        string     `gorm:"size:50;not null" json:"type"` // chat/code/analysis/etc
	Status      string     `gorm:"size:20;not null;default:pending;index" json:"status"`
	Priority    int        `gorm:"default:0" json:"priority"`
	Input       string     `gorm:"type:json;not null" json:"input"`
	Output      string     `gorm:"type:json" json:"output"`
	Error       string     `gorm:"type:text" json:"error"`
	Progress    int        `gorm:"default:0" json:"progress"`
	CreatedAt   time.Time  `json:"created_at"`
	StartedAt   *time.Time `json:"started_at"`
	CompletedAt *time.Time `json:"completed_at"`
	User        User       `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

// TableName 表名
func (Task) TableName() string {
	return "tasks"
}

// TaskLog 任务日志模型
type TaskLog struct {
	ID        uint      `gorm:"primarykey" json:"id"`
	TaskID    string    `gorm:"size:36;not null;index" json:"task_id"`
	Level     string    `gorm:"size:10;not null;default:info" json:"level"` // info/warn/error
	Message   string    `gorm:"type:text" json:"message"`
	Step      string    `gorm:"size:100" json:"step"`
	Progress  int       `json:"progress"`
	CreatedAt time.Time `json:"created_at"`
}

// TableName 表名
func (TaskLog) TableName() string {
	return "task_logs"
}

// Skill 技能模型
type Skill struct {
	ID         uint      `gorm:"primarykey" json:"id"`
	Name       string    `gorm:"uniqueIndex;size:100;not null" json:"name"`
	Category   string    `gorm:"size:50" json:"category"`
	Command    string    `gorm:"size:50" json:"command"`
	Definition string    `gorm:"type:json;not null" json:"definition"`
	Enabled    bool      `gorm:"default:true" json:"enabled"`
	Version    string    `gorm:"size:20;default:1.0.0" json:"version"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// TableName 表名
func (Skill) TableName() string {
	return "skills"
}

// Agent 智能体模型
type Agent struct {
	ID             uint      `gorm:"primarykey" json:"id"`
	Name           string    `gorm:"uniqueIndex;size:100;not null" json:"name"`
	Department     string    `gorm:"size:50" json:"department"`
	Persona        string    `gorm:"type:json;not null" json:"persona"`
	Capabilities   string    `gorm:"type:json" json:"capabilities"`
	TriggerKeywords string   `gorm:"type:json" json:"trigger_keywords"`
	Enabled        bool      `gorm:"default:true" json:"enabled"`
	Version        string    `gorm:"size:20;default:1.0.0" json:"version"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// TableName 表名
func (Agent) TableName() string {
	return "agents"
}

// UserConfig 用户配置模型
type UserConfig struct {
	ID          uint      `gorm:"primarykey" json:"id"`
	UserID      uint      `gorm:"not null;index" json:"user_id"`
	ConfigName  string    `gorm:"size:100;default:默认配置" json:"config_name"`
	Skills      string    `gorm:"type:json" json:"skills"`
	Agents      string    `gorm:"type:json" json:"agents"`
	DisplayMode string    `gorm:"size:20;default:standard" json:"display_mode"` // detailed/standard/minimal/off
	Preferences string    `gorm:"type:json" json:"preferences"`
	IsActive    bool      `gorm:"default:false" json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	User        User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

// TableName 表名
func (UserConfig) TableName() string {
	return "user_configs"
}
