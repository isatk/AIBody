package config

import (
	"os"

	"gopkg.in/yaml.v3"
)

// Config 应用配置
type Config struct {
	App      AppConfig      `yaml:"app"`
	Server   ServerConfig   `yaml:"server"`
	Database DatabaseConfig `yaml:"database"`
	Redis    RedisConfig    `yaml:"redis"`
	JWT      JWTConfig      `yaml:"jwt"`
	Engine   EngineConfig   `yaml:"engine"`
}

// AppConfig 应用配置
type AppConfig struct {
	Name    string `yaml:"name"`
	Version string `yaml:"version"`
	Env     string `yaml:"env"`
}

// ServerConfig 服务器配置
type ServerConfig struct {
	Host string `yaml:"host"`
	Port string `yaml:"port"`
}

// DatabaseConfig 数据库配置
type DatabaseConfig struct {
	Host            string `yaml:"host"`
	Port            int    `yaml:"port"`
	Username        string `yaml:"username"`
	Password        string `yaml:"password"`
	Name            string `yaml:"name"`
	MaxOpenConns    int    `yaml:"max_open_conns"`
	MaxIdleConns    int    `yaml:"max_idle_conns"`
	ConnMaxLifetime int    `yaml:"conn_max_lifetime"`
}

// RedisConfig Redis配置
type RedisConfig struct {
	Host     string `yaml:"host"`
	Port     int    `yaml:"port"`
	Password string `yaml:"password"`
	DB       int    `yaml:"db"`
	PoolSize int    `yaml:"pool_size"`
}

// JWTConfig JWT配置
type JWTConfig struct {
	Secret            string `yaml:"secret"`
	AccessTokenExpire int   `yaml:"access_token_expire"`
	RefreshTokenExpire int   `yaml:"refresh_token_expire"`
}

// EngineConfig 引擎配置
type EngineConfig struct {
	Host  string `yaml:"host"`
	Port  int    `yaml:"port"`
	APIKey string `yaml:"api_key"`
}

// Load 加载配置文件
func Load(path string) *Config {
	data, err := os.ReadFile(path)
	if err != nil {
		return defaultConfig()
	}

	var cfg Config
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return defaultConfig()
	}

	return &cfg
}

// defaultConfig 返回默认配置
func defaultConfig() *Config {
	return &Config{
		App: AppConfig{
			Name:    "灵枢",
			Version: "1.0.0",
			Env:     "development",
		},
		Server: ServerConfig{
			Host: "0.0.0.0",
			Port: "8080",
		},
		Database: DatabaseConfig{
			Host:            "localhost",
			Port:            3306,
			Username:        "lingxu",
			Password:        "LingxuDB2024!",
			Name:            "lingxu",
			MaxOpenConns:    100,
			MaxIdleConns:    10,
			ConnMaxLifetime: 3600,
		},
		Redis: RedisConfig{
			Host:     "localhost",
			Port:     6379,
			Password: "",
			DB:       0,
			PoolSize: 100,
		},
		JWT: JWTConfig{
			Secret:            "lingxu-jwt-secret-change-in-production",
			AccessTokenExpire: 900,   // 15分钟
			RefreshTokenExpire: 604800, // 7天
		},
		Engine: EngineConfig{
			Host:   "localhost",
			Port:   3000,
			APIKey: "",
		},
	}
}
