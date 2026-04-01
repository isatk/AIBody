package queue

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/isatk/AIBody/service/config"
	"github.com/redis/go-redis/v9"
)

// TaskQueue 任务队列
type TaskQueue struct {
	client *redis.Client
}

// Task 任务结构
type Task struct {
	ID        string                 `json:"id"`
	UserID    uint                    `json:"user_id"`
	Type      string                 `json:"type"`
	Content   map[string]interface{}  `json:"content"`
	Priority  int                    `json:"priority"`
	Status    string                 `json:"status"`
	Progress  int                    `json:"progress"`
	CreatedAt time.Time              `json:"created_at"`
}

// InitRedis 初始化Redis连接
func InitRedis(cfg *config.Config) *redis.Client {
	client := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", cfg.Redis.Host, cfg.Redis.Port),
		Password: cfg.Redis.Password,
		DB:       cfg.Redis.DB,
		PoolSize: cfg.Redis.PoolSize,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		return nil
	}

	return client
}

// NewTaskQueue 创建任务队列
func NewTaskQueue(client *redis.Client) *TaskQueue {
	return &TaskQueue{client: client}
}

// Enqueue 入队
func (q *TaskQueue) Enqueue(ctx context.Context, task *Task) error {
	if task.ID == "" {
		task.ID = uuid.New().String()
	}
	task.Status = "pending"
	task.CreatedAt = time.Now()

	data, err := json.Marshal(task)
	if err != nil {
		return err
	}

	// 根据优先级加入不同的队列
	queueKey := getQueueKey(task.Priority)
	return q.client.RPush(ctx, queueKey, data).Err()
}

// Dequeue 出队
func (q *TaskQueue) Dequeue(ctx context.Context, timeout time.Duration) (*Task, error) {
	// 先尝试高优先级队列
	for priority := 3; priority >= 0; priority-- {
		queueKey := getQueueKey(priority)
		result, err := q.client.LPop(ctx, queueKey).Result()
		if err == redis.Nil {
			continue
		}
		if err != nil {
			return nil, err
		}

		var task Task
		if err := json.Unmarshal([]byte(result), &task); err != nil {
			return nil, err
		}
		return &task, nil
	}

	// 阻塞等待
	result, err := q.client.BLPop(ctx, timeout, "lingxu:tasks:p0", "lingxu:tasks:p1", "lingxu:tasks:p2", "lingxu:tasks:p3").Result()
	if err != nil {
		return nil, err
	}

	var task Task
	if err := json.Unmarshal([]byte(result[1]), &task); err != nil {
		return nil, err
	}
	return &task, nil
}

// UpdateProgress 更新进度
func (q *TaskQueue) UpdateProgress(ctx context.Context, taskID string, progress int) error {
	key := fmt.Sprintf("lingxu:task:%s:progress", taskID)
	return q.client.Set(ctx, key, progress, 24*time.Hour).Err()
}

// GetProgress 获取进度
func (q *TaskQueue) GetProgress(ctx context.Context, taskID string) (int, error) {
	key := fmt.Sprintf("lingxu:task:%s:progress", taskID)
	result, err := q.client.Get(ctx, key).Int()
	if err == redis.Nil {
		return 0, nil
	}
	return result, err
}

// UpdateStatus 更新状态
func (q *TaskQueue) UpdateStatus(ctx context.Context, taskID, status string) error {
	key := fmt.Sprintf("lingxu:task:%s:status", taskID)
	return q.client.Set(ctx, key, status, 24*time.Hour).Err()
}

// GetStatus 获取状态
func (q *TaskQueue) GetStatus(ctx context.Context, taskID string) (string, error) {
	key := fmt.Sprintf("lingxu:task:%s:status", taskID)
	result, err := q.client.Get(ctx, key).Result()
	if err == redis.Nil {
		return "pending", nil
	}
	return result, err
}

// Cancel 取消任务
func (q *TaskQueue) Cancel(ctx context.Context, taskID string) error {
	key := fmt.Sprintf("lingxu:task:%s:cancelled", taskID)
	return q.client.Set(ctx, key, "true", 24*time.Hour).Err()
}

// IsCancelled 检查是否已取消
func (q *TaskQueue) IsCancelled(ctx context.Context, taskID string) (bool, error) {
	key := fmt.Sprintf("lingxu:task:%s:cancelled", taskID)
	result, err := q.client.Exists(ctx, key).Result()
	if err != nil {
		return false, err
	}
	return result > 0, nil
}

// getQueueKey 获取队列键
func getQueueKey(priority int) string {
	return fmt.Sprintf("lingxu:tasks:p%d", priority)
}
