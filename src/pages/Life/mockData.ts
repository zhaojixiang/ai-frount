import type { LifeRecord } from './types';

/**
 * 生活记录列表（全量）
 * 将来接入示例：
 * import request from '@/lib/request';
 * const res = await request.get<{ data: LifeRecord[] }>('/api/life/records', {
 *   params: { page: 1, pageSize: 100 }
 * });
 * return res.data;
 */
export function getLifeRecordsMock(): LifeRecord[] {
  return [
    {
      id: 'lr-1',
      date: '2026-04-10',
      title: '雨后',
      excerpt: '街道反光像一层薄釉，走路变慢了，反而看清了路边的树影。',
      imageUrl: 'https://picsum.photos/seed/life-lr-1/800/500'
    },
    {
      id: 'lr-2',
      date: '2026-04-02',
      title: '整理桌面',
      excerpt: '只留下一只杯子和一本书，桌面终于呼吸了。',
      imageUrl: 'https://picsum.photos/seed/life-lr-2/800/500'
    },
    {
      id: 'lr-3',
      date: '2026-03-28',
      title: '夜归',
      excerpt: '关显示器前看到窗外只剩一盏路灯，突然觉得今天不算亏。',
      imageUrl: undefined
    },
    {
      id: 'lr-4',
      date: '2026-03-15',
      title: '早茶',
      excerpt: '和朋友约在未名的巷子里，聊工作也聊各自在读的书。',
      imageUrl: 'https://picsum.photos/seed/life-lr-4/800/500'
    },
    {
      id: 'lr-5',
      date: '2026-02-08',
      title: '立春',
      excerpt: '风还是冷的，但阳光已经有点诚意了，把被子抱到天台晒了一上午。',
      imageUrl: 'https://picsum.photos/seed/life-lr-5/800/500'
    },
    {
      id: 'lr-6',
      date: '2025-12-20',
      title: '年末清单',
      excerpt: '把今年没读完的书列在纸上，发现比读完的还多，也算一种收获。',
      imageUrl: undefined
    },
    {
      id: 'lr-7',
      date: '2025-11-03',
      title: '散步',
      excerpt: '绕湖一圈，耳机里放播客，走到第三公里才开始想正事。',
      imageUrl: 'https://picsum.photos/seed/life-lr-7/800/500'
    }
  ];
}
