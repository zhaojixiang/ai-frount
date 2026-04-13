# 路由页面接口说明（索引）

本目录按**路由级页面**拆分文档，供后端接口与数据库设计对齐前端数据需求。约定：

- 传输格式：**JSON**；时间字段建议统一 **ISO 8601** 字符串（如 `2026-04-02T08:00:00.000Z` 或按业务简化为 `YYYY-MM-DD`）。
- 列表分页：默认参数 `page`（从 1 开始）、`pageSize`；响应中带 `total`、`totalPages` 等与前端 `BlogList` 等页对齐。
- 成功响应：可与现有 `request` 封装一致，使用 `{ code: 200, data: ... }`；下文以 **`data` 载荷**为主描述业务结构。

| 文档 | 路由 | 说明 |
| --- | --- | --- |
| [home.md](./home.md) | `/`、`/home` | 站点首页聚合区 |
| [blog-list.md](./blog-list.md) | `/blog` | 文章列表 + 分页 |
| [blog-detail.md](./blog-detail.md) | `/blog/:id` | 文章详情 + 上下篇 |
| [life.md](./life.md) | `/life` | 生活记录时间轴 |
| [toolkit.md](./toolkit.md) | `/toolkit` | 工具库分类与搜索 |
| [editor.md](./editor.md) | `/editor` | AI 视频分镜任务与切片 |
| [chat-api.md](./chat-api.md) | `/chat-api` | 对话演示（建议经后端代理） |
| [not-found.md](./not-found.md) | `*` | 404，无业务接口 |
