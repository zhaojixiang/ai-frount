# 文章列表（Blog List）

## 路由

- `/blog`

## 业务梳理

博客文章列表页：卡片 Grid 展示，支持 **分页**（前端使用查询参数 `?page=`）。每条卡片需展示：封面、标题、摘要、发布时间、分类、标签、作者、阅读数、点赞数、评论数；点击跳转 `/blog/:id` 详情页。

数据按 **发布时间倒序**；分页从 **1** 开始。

## 接口名称建议

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/blog/articles` | 分页获取文章摘要列表 |

### 查询参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `page` | number | 否 | 页码，默认 `1` |
| `pageSize` | number | 否 | 每页条数，前端当前为 `4`，可配置 |

---

## 数据格式定义

### 列表项 `BlogArticleSummary`

与前端 `src/pages/blog/types.ts` 中 `BlogArticleSummary` 对齐（列表不含正文 Markdown）。

```json
{
  "id": "string",
  "title": "string",
  "excerpt": "string",
  "publishedAt": "string",
  "category": "string",
  "tags": ["string"],
  "views": 0,
  "likes": 0,
  "comments": 0,
  "author": "string",
  "coverImage": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 文章主键 |
| `title` | string | 是 | 标题 |
| `excerpt` | string | 是 | 摘要（列表展示） |
| `publishedAt` | string | 是 | 发布时间 |
| `category` | string | 是 | 分类展示名（或关联分类表后的名称） |
| `tags` | string[] | 是 | 标签列表，可为空数组 |
| `views` | number | 是 | 阅读量 |
| `likes` | number | 是 | 点赞量 |
| `comments` | number | 是 | 评论量 |
| `author` | string | 是 | 作者展示名 |
| `coverImage` | string | 是 | 封面图 URL |

### 分页包装 `BlogListResult`

```json
{
  "items": [ "BlogArticleSummary" ],
  "page": 1,
  "pageSize": 4,
  "total": 100,
  "totalPages": 25
}
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `items` | array | 当前页数据 |
| `page` | number | 当前页（非法页码时后端可钳制到合法范围） |
| `pageSize` | number | 每页条数 |
| `total` | number | 总条数 |
| `totalPages` | number | 总页数，至少为 `1` |

**响应示例**

```json
{
  "code": 200,
  "data": {
    "items": [],
    "page": 1,
    "pageSize": 4,
    "total": 8,
    "totalPages": 2
  }
}
```

---

## 数据库设计提示（可选）

- **posts**：`id`, `title`, `excerpt`, `content`（详情用）, `published_at`, `category_id`, `author_id`, `cover_url`, `views`, `likes`, `comments_count` 等。
- **tags**：多对多 `post_tags`。
- **categories**：`id`, `name`/`slug`。
- 列表查询：按 `published_at DESC` + `limit/offset` 或游标分页。
