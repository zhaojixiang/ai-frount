import { getBlogArticlesDetailMock } from '@/pages/blog/mockData';

import type { BlogPost, LifeMoment, ToolEntry } from './types';

/**
 * 最新文章
 * 将来接入示例：
 * import request from '@/lib/request';
 * const res = await request.get<{ data: BlogPost[] }>('/api/blog/posts', { params: { limit: 6 } });
 * return res.data;
 */
export function getLatestPostsMock(): BlogPost[] {
  return getBlogArticlesDetailMock()
    .slice()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 4)
    .map(({ id, title, publishedAt }) => ({ id, title, publishedAt }));
}

/**
 * 推荐工具
 * 将来接入示例：
 * const res = await request.get<{ data: ToolEntry[] }>('/api/tools/recommended');
 */
export function getToolsMock(): ToolEntry[] {
  return [
    {
      id: 't1',
      name: 'AI 视频分镜',
      description: '时间轴预览与分镜重排，实验中的编辑流。',
      href: '/editor',
      tag: 'Lab'
    },
    {
      id: 't2',
      name: 'Chat API 演示',
      description: '接口联调与消息流的简易试验台。',
      href: '/chat-api',
      tag: 'Dev'
    },
    {
      id: 't3',
      name: '工具库',
      description: '按分类浏览与搜索更多工具。',
      href: '/toolkit',
      tag: 'Toolkit'
    }
  ];
}

/**
 * 生活记录
 * 将来接入示例：
 * const res = await request.get<{ data: LifeMoment[] }>('/api/life/feed', { params: { limit: 4 } });
 */
export function getLifeMomentsMock(): LifeMoment[] {
  return [
    {
      id: 'l1',
      date: '2026-04-08',
      excerpt: '雨后的街道反光像一层薄釉，走路变慢了，反而看清了路边的树影。',
      imageUrl: undefined
    },
    {
      id: 'l2',
      date: '2026-03-22',
      excerpt: '把咖啡角重新收了一遍，只留下一只杯子和一本书，桌面终于呼吸了。',
      imageUrl: undefined
    },
    {
      id: 'l3',
      date: '2026-03-05',
      excerpt: '深夜调试结束，关显示器前看到窗外只剩一盏路灯，突然觉得今天不算亏。',
      imageUrl: undefined
    }
  ];
}
