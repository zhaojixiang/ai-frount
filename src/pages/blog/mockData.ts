import type { BlogArticleDetail, BlogDetailResult, BlogListResult } from './types';

const ARTICLES: BlogArticleDetail[] = [
  {
    id: '1',
    title: '在噪声里写清自己的节奏',
    excerpt: '当通知、群聊与待办同时涌来，如何把注意力收束到真正重要的事上。',
    publishedAt: '2026-04-02',
    category: '随笔',
    tags: ['专注', '效率'],
    views: 1280,
    likes: 86,
    comments: 12,
    author: 'Journal',
    coverImage: 'https://picsum.photos/seed/blog-1/960/540',
    contentMarkdown: `# 在噪声里写清自己的节奏

信息越多，越需要**自己的节奏**。不是更努力，而是更清楚：此刻该做什么。

## 三个小习惯

1. 每天只选 *一件* 最重要的事先完成。
2. 把「稍后处理」写进清单，而不是留在脑子里。
3. 睡前五分钟复盘：今天哪一步走对了。

> 安静不是环境，而是你把注意力放在哪里。

\`\`\`ts
const focus = (task: string) => commit(task);
\`\`\`

祝你今天也有一条清晰的线。`
  },
  {
    id: '2',
    title: '笔记系统：从收集到内化',
    excerpt: '剪藏不等于学习。用一套轻量流程，把链接变成自己的句子。',
    publishedAt: '2026-03-18',
    category: '方法',
    tags: ['笔记', '学习'],
    views: 2104,
    likes: 142,
    comments: 28,
    author: 'Journal',
    coverImage: 'https://picsum.photos/seed/blog-2/960/540',
    contentMarkdown: `## 收集与内化

剪藏只是起点。真正有用的是 **用自己的话重写一遍**。

| 阶段 | 动作 |
| --- | --- |
| 捕获 | 标题 + 一句话摘要 |
| 连接 | 链到已有笔记 |
| 输出 | 写一段应用或反例 |

> 笔记的价值在检索之前，在复述之后。`
  },
  {
    id: '3',
    title: '一次重构留下的三条原则',
    excerpt: '边界清晰、命名诚实、删除犹豫时先加测试。',
    publishedAt: '2026-03-01',
    category: '技术',
    tags: ['重构', '工程'],
    views: 956,
    likes: 64,
    comments: 9,
    author: 'Journal',
    coverImage: 'https://picsum.photos/seed/blog-3/960/540',
    contentMarkdown: `# 重构之后

这次重构没有「大新闻」，只有三条**朴素**的原则：

- **边界**：模块之间只通过明确类型对话。
- **命名**：如果解释比名字长，就换名字。
- **测试**：动刀前先锁住行为。

\`\`\`text
小步提交 > 大爆炸合并
\`\`\`
`
  },
  {
    id: '4',
    title: '阅读清单：四月',
    excerpt: '小说与非虚构各半，留一本在床头，只读纸质。',
    publishedAt: '2026-02-20',
    category: '阅读',
    tags: ['书单', '生活'],
    views: 743,
    likes: 51,
    comments: 6,
    author: 'Journal',
    coverImage: 'https://picsum.photos/seed/blog-4/960/540',
    contentMarkdown: `## 四月书单

1. 一本长篇小说（慢读）
2. 一本非虚构（做笔记）
3. 一本文集（随意翻）

**规则**：床头那本不带到地铁上，给阅读一点仪式感。`
  },
  {
    id: '5',
    title: '前端性能：从感知开始',
    excerpt: '指标很多，用户只在乎「卡不卡」。先稳住首屏与交互反馈。',
    publishedAt: '2026-01-10',
    category: '技术',
    tags: ['性能', '前端'],
    views: 1822,
    likes: 97,
    comments: 15,
    author: 'Journal',
    coverImage: 'https://picsum.photos/seed/blog-5/960/540',
    contentMarkdown: `# 感知性能

\`LCP\`、\`FID\` 很重要，但用户口头说的往往是：**卡不卡**。

- 首屏先出来
- 点击要有反馈
- 长任务拆开

> 优化不是一次做完，而是一次次把最碍眼的那条先搬走。`
  },
  {
    id: '6',
    title: '周末散步路线',
    excerpt: '沿河边走四十分钟，耳机里不放音乐，只听风声与脚步声。',
    publishedAt: '2025-12-05',
    category: '生活',
    tags: ['散步', '城市'],
    views: 412,
    likes: 33,
    comments: 4,
    author: 'Journal',
    coverImage: 'https://picsum.photos/seed/blog-6/960/540',
    contentMarkdown: `没有攻略，只有**同一条路反复走**。

河边的风、路灯的高度、桥洞的回声，都会慢慢变得熟悉。

适合想清空脑子的时候。`
  },
  {
    id: '7',
    title: '写作：从段落开始',
    excerpt: '不要从「一篇文章」开始，从一段能独立成立的话开始。',
    publishedAt: '2025-11-18',
    category: '随笔',
    tags: ['写作'],
    views: 889,
    likes: 58,
    comments: 11,
    author: 'Journal',
    coverImage: 'https://picsum.photos/seed/blog-7/960/540',
    contentMarkdown: `## 一段就好

写完一段，再决定要不要第二段。

标题可以最后起；开头可以删掉三次。

> 能单独成立的一段，比半篇正确的废话更有用。`
  },
  {
    id: '8',
    title: '季度复盘模板',
    excerpt: '三件事：继续 / 停止 / 开始。写满一页纸就停。',
    publishedAt: '2025-10-22',
    category: '方法',
    tags: ['复盘'],
    views: 1205,
    likes: 76,
    comments: 8,
    author: 'Journal',
    coverImage: 'https://picsum.photos/seed/blog-8/960/540',
    contentMarkdown: `# 复盘

每个季度只回答三个问题：

1. **继续**什么？
2. **停止**什么？
3. **开始**什么？

写满一页纸就停，不要追加第四页。`
  }
];

/**
 * 全量文章（按发布时间倒序，已与列表展示一致）
 * 将来接入示例：
 * import request from '@/lib/request';
 * const res = await request.get<{ data: BlogArticleDetail[] }>('/api/blog/articles');
 * return res.data;
 */
export function getBlogArticlesDetailMock(): BlogArticleDetail[] {
  return [...ARTICLES];
}

/**
 * 分页列表
 * 将来接入示例：
 * const res = await request.get('/api/blog/articles', { params: { page, pageSize } });
 * return res.data;
 */
export function getBlogListPageMock(page: number, pageSize: number): BlogListResult {
  const sorted = [...ARTICLES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize).map((row) => {
    const { contentMarkdown, ...rest } = row;
    return rest;
  });

  return {
    items,
    page: safePage,
    pageSize,
    total,
    totalPages
  };
}

/**
 * 详情 + 上一篇 / 下一篇（时间轴：较新 → 较旧）
 * 将来接入示例：
 * const res = await request.get(`/api/blog/articles/${id}`);
 * return res.data; // { article, prevId, nextId }
 */
export function getBlogDetailMock(id: string): BlogDetailResult | null {
  const sorted = [...ARTICLES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const idx = sorted.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const article = sorted[idx];
  const nextId = idx > 0 ? sorted[idx - 1].id : null;
  const prevId = idx < sorted.length - 1 ? sorted[idx + 1].id : null;
  return { article, prevId, nextId };
}
