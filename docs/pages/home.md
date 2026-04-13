# 首页（Home）

## 路由

- `/`（index）
- `/home`

## 业务梳理

站点入口页，白底简约风格。由以下区块组成（均为展示型，无复杂表单）：

| 区块 | 说明 |
| --- | --- |
| 顶栏 / 页脚 | 全局导航与版权；一般不单独请求 |
| Hero | 静态文案与主视觉引导 |
| 最新文章 | 展示少量文章条目，点击跳转博客详情 |
| 推荐工具 | 展示少量工具卡片，跳转站内路由或外链 |
| 最近生活 | 展示少量生活记录摘要，可跳转生活页锚点或详情（当前为摘要列表） |

首页当前在 `src/pages/Home/mockData.ts` 中分别用 **mock** 拉取三类数据；上线后建议由 **1～3 个接口** 或 **1 个聚合接口** 提供。

## 接口名称建议

### 方案 A：分接口（便于各模块独立缓存与更新）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/home/latest-posts` | 首页「最新文章」列表 |
| `GET` | `/api/home/featured-tools` | 首页「推荐工具」列表 |
| `GET` | `/api/home/life-preview` | 首页「最近生活」列表 |

**查询参数（可选）**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `limit` | number | 各列表条数上限，默认如 `4` / `3` |

### 方案 B：聚合接口（减少首屏请求次数）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/home/dashboard` | 一次返回首页所需三块数据 |

---

## 数据格式定义

### 1. 最新文章条目 `HomePostItem`

与博客文章主键对齐，首页仅展示摘要级字段即可。

```json
{
  "id": "string",
  "title": "string",
  "publishedAt": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 文章 ID，与 `/blog/:id` 一致 |
| `title` | string | 是 | 标题 |
| `publishedAt` | string | 是 | 发布时间，建议 ISO 或 `YYYY-MM-DD` |

**响应示例（方案 A 之一）**

```json
{
  "code": 200,
  "data": [
    { "id": "1", "title": "示例标题", "publishedAt": "2026-04-02" }
  ]
}
```

---

### 2. 推荐工具条目 `HomeFeaturedTool`

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "href": "string",
  "tag": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 工具唯一标识（可与工具库主表 id 一致） |
| `name` | string | 是 | 名称 |
| `description` | string | 是 | 短描述 |
| `href` | string | 是 | 链接：站内路径如 `/editor` 或完整 URL |
| `tag` | string | 否 | 角标文案，如 `Lab` |

---

### 3. 最近生活条目 `HomeLifePreviewItem`

```json
{
  "id": "string",
  "date": "string",
  "excerpt": "string",
  "imageUrl": "string | null"
}
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 生活记录 ID |
| `date` | string | 是 | 日期，建议 `YYYY-MM-DD` |
| `excerpt` | string | 是 | 摘要正文 |
| `imageUrl` | string \| null | 否 | 封面图 URL，无图时前端可占位 |

---

### 方案 B 聚合响应 `HomeDashboard`

```json
{
  "latestPosts": [ "HomePostItem" ],
  "featuredTools": [ "HomeFeaturedTool" ],
  "lifePreview": [ "HomeLifePreviewItem" ]
}
```

---

## 数据库设计提示（可选）

- **文章**：与博客主表 `posts` 关联，`latest-posts` 可按 `published_at` 倒序 `limit`。
- **推荐工具**：可建 `home_featured_tools` 排序表（`tool_id`, `sort_order`）或配置表。
- **生活预览**：与生活记录主表一致，按 `date` 倒序 `limit`；或独立 `is_featured` 字段。
