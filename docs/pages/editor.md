# AI 视频编辑器（Editor）

## 路由

- `/editor`

## 业务梳理

用户提交 **视频 URL**，后端创建 **异步处理任务**，返回 **任务 ID**；前端使用任务 ID **轮询**获取 **分镜（场景）列表**。当接口返回 `code === 200` 且 `data` 为分镜数组时，进入可播放、可编辑时间轴状态；否则间隔约 2s 继续轮询。

前端调用见 `src/services/api/index.ts`：`submitVideo`、`getScenes`。

## 接口名称建议（与现有前端路径对齐）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `POST` | `/api/video/process` | 提交视频地址，创建处理任务 |
| `GET` | `/api/video/:taskId/scenes` | 查询任务状态与分镜列表（轮询） |

---

## 数据格式定义

### 1. 提交处理 `POST /api/video/process`

**请求体**

```json
{
  "url": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `url` | string | 是 | 可访问的视频地址 |

**响应（与前端兼容）**

前端从 `data` 中解析任务 ID，字段名兼容 `taskId` 或 `id`；并读取 `status` 文案展示。

```json
{
  "code": 200,
  "message": "ok",
  "data": {
    "taskId": "string"
  },
  "status": "processing"
}
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `code` | number | `200` 表示受理成功 |
| `data` | object | 须含 `taskId`（或 `id`）供轮询 |
| `status` | string | 可选，任务状态文案 |
| `message` / `msg` | string | 可选，错误时前端会展示 |

**错误示例**

```json
{
  "code": 400,
  "message": "无效地址"
}
```

---

### 2. 查询分镜 `GET /api/video/:taskId/scenes`

**路径参数**

| 参数 | 说明 |
| --- | --- |
| `taskId` | 任务 ID，与提交接口返回一致 |

**响应（轮询语义）**

- 处理中：可返回 `code !== 200` 或 `data` 为 `null`，前端继续轮询。
- 完成：`code === 200` 且 `data` 为 **分镜数组**。

```json
{
  "code": 200,
  "status": "done",
  "data": [ "Scene" ]
}
```

#### 分镜条目 `Scene`

与 `src/components/VideoPlayer` 中结构一致：

```json
{
  "id": "string",
  "start": 0,
  "end": 0,
  "file": "string",
  "thumbnail": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 分镜 ID |
| `start` | number | 是 | 在原视频中的开始时间（**秒**，浮点） |
| `end` | number | 是 | 结束时间（秒） |
| `file` | string | 是 | 可播放视频 URL（与现播放器逻辑一致） |
| `thumbnail` | string | 否 | 缩略图 URL；无则前端可截帧生成 |

---

## 数据库设计提示（可选）

- **tasks**：`id`, `source_url`, `status`, `created_at`, `error_message`。
- **scenes**：`id`, `task_id`, `start_sec`, `end_sec`, `file_url`, `thumbnail_url`, `sort_order`。

---

## 备注

- 轮询间隔、超时策略由前后端共同约定；当前前端约 **2s** 间隔。
- 若改为 WebSocket / SSE 推送状态，可再增文档说明事件格式。
