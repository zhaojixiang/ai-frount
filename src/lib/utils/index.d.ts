export interface CaptureOptions {
  ignoreElements?: (element: HTMLElement) => boolean;
  scale?: number; // 缩放倍数，影响清晰度
  format?: 'image/png' | 'image/jpeg' | 'image/webp';
  quality?: number; // 仅对 jpeg/webp 有效
}

export interface UrlToBase64Options {
  outputFormat?: 'image/png' | 'image/jpeg' | 'image/webp';
  quality?: number;
}

export interface Utils {
  // 获取设备系统
  getDeviceOS: () => Promise<string>;
  // 获取查询参数
  getQuery: (search?: string) => Record<string, string>;
  // 是否是IOS APP
  isIosApp: () => Promise<boolean>;
  // 是否是Android APP
  isAndroidApp: () => Promise<boolean>;
  // 设置favicon
  setupFavicon: () => void;
  // 过滤掉对象中值为空字符串或 undefined 的属性
  filterEmptyParams: <T extends Record<string, any>>(params: T) => Partial<T>;
  // 获取包名
  getAppName: () => Promise<string>;
  // 是否是叫叫儿童阅读APP 鸿蒙版
  isJoJoReadAppForHM: () => Promise<boolean>;
  // 比较版本号
  isHigerVersion: (version1: string, version2: string) => boolean;
  // 是否安装支付宝
  getAliExist: () => Promise<boolean>;
  // 是否安装微信
  getWxExist: () => Promise<boolean>;
  // 将图片URL转换为Base64
  urlToBase64: (url: string, options?: UrlToBase64Options) => Promise<string>;
  // 截取HTML元素
  capture: (node: HTMLElement, options?: CaptureOptions) => Promise<string>;
  // sessionStorage
  session: {
    get: (key: string) => any;
    set: (key: string, value: any, expires?: number) => void;
    remove: (key: string) => void;
    clear: () => void;
  };
  // localStorage
  storage: {
    get: (key: string) => any;
    set: (key: string, value: any, expires?: number) => void;
    remove: (key: string) => void;
    clear: () => void;
  };
}
