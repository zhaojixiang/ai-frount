# 文章详情（Blog Detail）

## 路由

- `/blog/:id`

## 业务梳理

单篇文章阅读页：展示标题、摘要、封面、分类、标签、作者、发布时间、阅读/点赞/评论数；正文为 **Markdown**，前端使用 `react-markdown` + `remark-gfm` 渲染。

底部提供 **上一篇 / 下一篇** 导航：按 **发布时间** 排序时，**上一篇** 指时间更早的一条，**下一篇** 指时间更晚的一条（与当前 `mockData` 中 `prevId` / `nextId` 语义一致）。

访问不存在 `id` 时，前端展示「未找到」并引导回列表。

## 接口名称建议

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/blog/articles/:id` | 获取单篇文章详情及相邻篇 ID |

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `id` | 文章 ID |

---

## 数据格式定义

### 详情 `BlogArticleDetail`

在列表摘要基础上增加正文字段：

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
  "coverImage": "string",
  "contentMarkdown": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `contentMarkdown` | string | 是 | 正文，Markdown 源码 |

其余字段同 [blog-list.md](./blog-list.md) 中的 `BlogArticleSummary`。

### 详情接口扩展：相邻篇

前端 `BlogDetailResult` 需要：

```json
{
  "article": "BlogArticleDetail",
  "prevId": "string | null",
  "nextId": "string | null"
}
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `article` | object | 当前文章详情 |
| `prevId` | string \| null | **较旧**一篇的 ID（发布时间更早）；无则为 `null` |
| `nextId` | string \| null | **较新**一篇的 ID（发布时间更晚）；无则为 `null` |

**响应示例**

```json
{
  "code": 200,
  "data": {
    "article": {
      "id": "1",
      "title": "标题",
      "excerpt": "摘要",
      "publishedAt": "2026-04-02",
      "category": "随笔",
      "tags": ["标签"],
      "views": 100,
      "likes": 10,
      "comments": 2,
      "author": "Journal",
      "coverImage": "https://...",
      "contentMarkdown": "# 正文\n\n..."
    },
    "prevId": "2",
    "nextId": null
  }
}
```

### 可选：独立接口

若希望详情接口只返回正文，相邻篇再请求：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/blog/articles/:id/neighbors` | 仅返回 `{ prevId, nextId }` |

---

## 其它接口（可选）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `POST` | `/api/blog/articles/:id/view` | 阅读次数 +1（防刷策略由后端决定） |

---

## 数据库设计提示（可选）

- 正文可存 `content_markdown`；若需检索可冗余 `content_plain`。
- `prevId`/`nextId` 可由查询 `published_at` 相邻记录计算，不必落库。
