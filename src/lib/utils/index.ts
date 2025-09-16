import storage from '@woulsl/storage';
import session from '@woulsl/storage/session';
import html2canvas from 'html2canvas';
import qs from 'query-string';

import { type CaptureOptions, type UrlToBase64Options } from './index.d';

export const setupFavicon = () => {
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
};

/**
 * 获取查询参数
 */
export const getQuery = (search: string = window.location.search) => {
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
};

/**
 * 过滤掉对象中值为空字符串或 undefined 的属性
 * @param params 需要过滤的参数对象
 * @returns 过滤后的对象
 */
export const filterEmptyParams = <T extends Record<string, any>>(params: T): Partial<T> => {
  const filteredParams: Partial<T> = {};

  Object.keys(params).forEach((key) => {
    const value = params[key];
    // 过滤掉 undefined 和空字符串
    if (value !== undefined && value !== '') {
      filteredParams[key as keyof T] = value;
    }
  });

  return filteredParams;
};

/**
 * 获取包名
 */
export const getAppName = async () => {
  let curBundleId = '';
  if (JOJO.Os.app && JOJO.bridge.canUseBridge()) {
    try {
      const appInfo = await JOJO.bridge.appInfo();
      const { data: { bundleID = '' } = {} } = appInfo || {};
      curBundleId = bundleID?.toLowerCase();
    } catch (error) {
      console.log('bridge ready error', error);
    }
  }
  return curBundleId;
};

/**
 * 是否是叫叫儿童阅读APP 鸿蒙版
 * @returns {boolean}
 */
export const isJoJoReadAppForHM = async () => {
  const appName = await getAppName();
  return appName === 'com.shusheng.hm.jojoread';
};

/**
 * 比较版本号
 * @param version1 基准版本号
 * @param version2 比较版本号
 * @returns {boolean}
 */
export const isHigerVersion = (version1: string, version2: string) => {
  let isHigher = false;
  if (version1 && version2) {
    const newVersion1 = version1.split('.').map((el) => Number(el));
    const newVersion2 = version2.split('.').map((el) => Number(el));
    let diff = 0;
    do {
      isHigher =
        diff === 2 ? newVersion2[diff] >= newVersion1[diff] : newVersion2[diff] > newVersion1[diff];
      diff += 1;
    } while (diff <= 2 && !isHigher && newVersion2[diff - 1] === newVersion1[diff - 1]);
  }
  return isHigher;
};

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

/**
 * 是否安装支付宝
 */
export const getAliExist = async () => {
  let alipayExist = true;
  if (JOJO.Os.app && JOJO.bridge.canUseBridge()) {
    try {
      try {
        const res = await JOJO.bridge.isAppInstalled({
          packageName: 'com.eg.android.AlipayGphone',
          urlScheme: 'alipays://'
        });
        console.log('aliRes', res);
        const { status, data } = res || {};
        if (!(status === 200 && data && data.isInstalled)) {
          alipayExist = false;
        }
      } catch (error) {
        alipayExist = false;
        console.log('aliError', error);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return alipayExist;
};

/**
 * 是否安装微信
 */
export const getWxExist = async () => {
  let wxExist = true;
  if (JOJO.Os.app && JOJO.bridge.canUseBridge()) {
    try {
      try {
        const res = await JOJO.bridge.isWechatInstalled();
        console.log('wxRes', res);
        const { status, data } = res || {};
        if (!(status === 200 && data && data.isInstalled)) {
          wxExist = false;
        }
      } catch (error) {
        wxExist = false;
        console.log('wxError', error);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return wxExist;
};

/**
 * 将图片URL转换为Base64
 * @param url - 图片URL
 * @param outputFormat - 输出格式
 * @param quality - 图片质量
 * @returns Promise<string> Base64编码的图片
 */
export const urlToBase64 = async (url: string, options: UrlToBase64Options): Promise<string> => {
  const { outputFormat = 'image/png', quality } = options;
  if (!url) {
    throw new Error('URL is required');
  }

  return new Promise<string>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous'; // 解决跨域导致的 canvas 污染问题
    image.decoding = 'async'; // 提示浏览器异步解码，提高性能
    image.referrerPolicy = 'no-referrer'; // 避免请求时带上 referrer

    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法获取 canvas 上下文'));
          return;
        }

        ctx.drawImage(image, 0, 0);

        const result = canvas.toDataURL(outputFormat, quality);
        resolve(result);
      } catch (error: any) {
        reject(new Error(`图片转换失败: ${error.message}`));
      }
    };

    image.onerror = () => reject(new Error('图片加载失败'));
    image.src = url;
  });
};

/**
 * 截取HTML元素
 * @param node - DOM元素
 * @param options - 截取选项
 * @returns Promise<string> Base64编码的图片
 */
export const capture = async (
  node: HTMLElement,
  { ignoreElements, scale = 2, format = 'image/png', quality }: CaptureOptions = {}
): Promise<string> => {
  if (!node) {
    throw new Error('Node element is required');
  }

  try {
    const canvas = await html2canvas(node, {
      scale,
      useCORS: true,
      backgroundColor: null, // 保持透明背景
      ignoreElements: (el) => {
        if (ignoreElements && ignoreElements(el as HTMLElement)) return true;
        // 默认忽略 <script> 和 <style>
        const tag = el.tagName.toLowerCase();
        return tag === 'script' || tag === 'style';
      }
    });

    return canvas.toDataURL(format, quality);
  } catch (err: any) {
    throw new Error(`Capture failed: ${err?.message || err}`);
  }
};

export { session, storage };

export default {
  setupFavicon,
  getQuery,
  filterEmptyParams,
  getDeviceOS,
  isIosApp,
  isAndroidApp,
  getAppName,
  isJoJoReadAppForHM,
  isHigerVersion,
  getAliExist,
  getWxExist,
  urlToBase64,
  capture,
  session,
  storage
};
