# Chat API 演示页（ChatApi）

## 路由

- `/chat-api`

## 业务梳理

当前页面为 **演示用途**：在浏览器内直接请求第三方大模型流式接口（代码中存在 **API Key 硬编码**，存在安全风险，**不应在生产环境保留**）。

从产品上可理解为：**对话式输出展示**（流式追加文本）。若产品化，建议：

1. 浏览器只调 **自有后端**；
2. 后端持有密钥，转发至 OpenAI 兼容接口或其它模型服务；
3. 返回 **SSE** 或 **分块 JSON**，与前端现有流式解析逻辑对齐。

## 接口名称建议（目标架构）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `POST` | `/api/chat/completions` | 统一对话接口（后端代理模型） |

### 请求体（建议与 OpenAI Chat Completions 对齐，便于迁移）

```json
{
  "model": "string",
  "messages": [
    { "role": "system", "content": "string" },
    { "role": "user", "content": "string" }
  ],
  "stream": true
}
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `model` | string | 模型名，由后端映射 |
| `messages` | array | 多轮消息 |
| `stream` | boolean | 是否流式 |

### 响应

- **流式**：`text/event-stream` 或分块 body，与现有前端解析 `data: ` 行、`[DONE]` 等逻辑对齐；或改为 **WebSocket** 并更新前端协议文档。

### 非流式（可选）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `POST` | `/api/chat/completions/sync` | 一次性返回全文 |

```json
{
  "code": 200,
  "data": {
    "content": "string"
  }
}
```

---

## 数据格式定义（消息项）

```json
{
  "role": "system | user | assistant",
  "content": "string"
}
```

---

## 数据库设计提示（可选）

- **conversations**：会话 ID、用户 ID、标题、时间。
- **messages**：`conversation_id`, `role`, `content`, `created_at`。
- 若不做持久化，可仅日志与限流。

---

## 安全与合规

- **禁止**在仓库或前端环境变量中提交真实第三方密钥；由后端密钥管理（KMS / 环境变量）注入。
- 建议增加：鉴权、速率限制、内容审核策略（视业务而定）。
