import qs from 'query-string';

export function setupFavicon() {
  const faviconMap: Record<string, string> = {
    jojo: '/jojo_logo.png',
    jojoup: '/jojoup_logo.png',
    matrix: '/jojo_logo.png'
  };

  const faviconUrl = faviconMap[JOJO.Os.appName];

  // 删除现有的favicon
  const existingIcons = document.querySelectorAll("link[rel*='icon']");
  existingIcons.forEach((icon) => icon.remove());

  // 创建新的favicon
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/x-icon';
  link.href = faviconUrl;
  document.head.appendChild(link);
}

export function getQuery(search: string) {
  // 移除开头的 '?' 字符（如果存在）
  const searchStr = search.startsWith('?') ? search.substring(1) : search;
  // 使用 query-string 解析查询参数并转换为字符串值的对象
  const parsed = qs.parse(searchStr);
  // 转换所有值为字符串
  const res: Record<string, string> = {};
  for (const [key, value] of Object.entries(parsed)) {
    res[key] = value === null || value === undefined ? '' : String(value);
  }

  return res;
}

/**
 * 获取设备系统
 */
export const getDeviceOS = async () => {
  if (JOJO.Os.app) {
    const deviceInfo = await JOJO.bridge.call('getDeviceInfo');
    const { data } = deviceInfo || {};
    return data?.deviceOS;
  }
  return '';
};
/**
 * 是否是IOS APP
 */
export const isIosApp = async () => {
  const deviceInfo = await getDeviceOS();
  return deviceInfo === 'iOS';
};

/**
 * 是否是Android APP
 */
export const isAndroidApp = async () => {
  const deviceInfo = await getDeviceOS();
  return deviceInfo === 'Android';
};

export default {
  setupFavicon,
  getQuery,
  getDeviceOS,
  isIosApp,
  isAndroidApp
};
