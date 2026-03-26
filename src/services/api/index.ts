import { request } from '@/lib';

/**
 * 提交
 */
export async function submitVideo(url: string) {
  return await request(`/api/video/process`, { url }, { method: 'POST' });
}
/**
 * 获取优惠券列表
 */
export async function getScenes(id: string) {
  return await request(`/api/video/${id}/scenes`);
}
