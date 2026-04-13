# 工具库（Toolkit）

## 路由

- `/toolkit`

## 业务梳理

工具展示首页：**分类**筛选（含「全部」）、**关键词搜索**（匹配名称、描述、标签）、**Grid 卡片**布局。卡片为深色渐变样式，前端用工具 `id` 稳定映射渐变，与数据无关。

链接类型：

- 站内路径：如 `/editor`、`/chat-api`，前端使用 `react-router` 的 `Link`。
- 外链：完整 `http(s)://`，新标签打开。
- 占位：`#`，无跳转。

## 接口名称建议

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/toolkit/categories` | 工具分类列表（含「全部」或由前端拼接） |
| `GET` | `/api/toolkit/tools` | 工具条目列表，可带筛选 |

### `GET /api/toolkit/tools` 查询参数（可选）

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `categoryId` | string | 分类 ID；不传或 `all` 表示全部 |
| `q` | string | 搜索关键词，匹配名称、描述、标签 |

> 说明：当前前端在浏览器内对 mock 做过滤；上线后可将 `q` 与 `categoryId` 交给后端，减少传输量。

---

## 数据格式定义

### 分类 `ToolkitCategory`

```json
{
  "id": "string",
  "label": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 分类 ID；`all` 表示全部时**可仅在前端维护**，不必入库 |
| `label` | string | 是 | 展示名，如 `开发` |

### 工具条目 `ToolkitTool`

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "categoryId": "string",
  "href": "string",
  "tags": ["string"]
}
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 工具唯一 ID |
| `name` | string | 是 | 名称 |
| `description` | string | 是 | 短描述 |
| `categoryId` | string | 是 | 外键关联分类（不含 `all`） |
| `href` | string | 是 | 跳转：站内路径、完整 URL 或 `#` |
| `tags` | string[] | 是 | 标签，可空数组 |

**列表响应示例**

```json
{
  "code": 200,
  "data": {
    "categories": [
      { "id": "all", "label": "全部" },
      { "id": "dev", "label": "开发" }
    ],
    "tools": [ "ToolkitTool" ]
  }
}
```

分类与工具也可分两个接口分别请求。

---

## 数据库设计提示（可选）

- `toolkit_categories`：`id`, `label`, `sort_order`。
- `toolkit_tools`：`id`, `name`, `description`, `category_id`, `href`, `sort_order`；标签用 `toolkit_tool_tags` 多对多或 JSON 字段（视查询需求而定）。
