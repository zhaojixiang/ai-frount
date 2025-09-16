/**
 * 顶部注释
 * @author: zhaojixiang
 * @date: 2025-05-13
 * @description: 跳转到小程序、Flutter、原生页面或H5页面。
 */
import qs from 'query-string';
import wx from 'weixin-js-sdk';

import Os from '@/lib/os';
import router from '@/routes';

export interface ShowPageConfig {
  // 跳转目标环境：mini（小程序）、externalWeb（外部H5）、flutter（Flutter页面）、native（原生页面）
  to?: 'mini' | 'externalWeb' | 'flutter' | 'native';
  // 跳转方式：navigate（跳转）、replace（替换），to === flutter | native 时，mode 无效
  mode?: 'navigate' | 'replace';
  // 跳转参数：以键值对形式传递的参数
  params?: Record<string, any>;
  // 小程序跳转完成后的回调
  onNavigateToMiniComplete?: () => void;
}

/**
 * 小程序内webview跳转到小程序
 * eg：
 */
export const miniprogramNavigateTo = (
  url: string,
  { params = {}, mode = 'navigate', onFinish }: any
) => {
  const path = `${url}?${qs.stringify(params)}`;
  if (mode === 'replace') {
    wx.miniProgram.redirectTo({ url: path, complete: onFinish });
  } else {
    wx.miniProgram.navigateTo({ url: path, complete: onFinish });
  }
};

/**
 * 合并URL & 参数
 * @param url 路径
 * @param params 参数
 */
const mergeUrlAndParams = (url: string, params: Record<string, any>) => {
  const [baseUrl, searchStr = ''] = url.split('?');
  const baseParams = qs.parse(searchStr);
  const finalParams = { ...baseParams, ...params };
  const finalUrl = `${baseUrl}?${qs.stringify(finalParams)}`;
  return finalUrl;
};

const showPage = (
  url: string,
  { to, mode = 'navigate', params = {}, onNavigateToMiniComplete }: ShowPageConfig = {}
) => {
  switch (to) {
    case 'mini':
      // 跳转小程序原生页
      if (Os.xcx) {
        miniprogramNavigateTo(url, { params, mode, onFinish: onNavigateToMiniComplete });
      } else {
        console.error('未检测到小程序环境');
      }
      break;
    case 'externalWeb': {
      // 跳转外部 H5 页面 (指的是非当前项目域名以外的H5页面)
      const finalUrl = mergeUrlAndParams(url, params);
      if (mode === 'navigate') {
        window.location.href = finalUrl;
      } else {
        window.location.replace(finalUrl);
      }
      break;
    }
    case 'flutter':
      // 叫叫儿童阅读 app中跳转 flutter 页面，传入H5页面完整url即可，会自动映射到 flutter 页面
      if (Os.jojoReadApp) {
        const resUrl = `${url}?${qs.stringify(params)}`;
        window.location.href = `tinman-router://cn.tinman.jojoread/webview?url=${encodeURIComponent(
          resUrl
        )}`;
      } else {
        console.error('非叫叫儿童阅读 app 环境');
      }
      break;
    case 'native':
      // app中跳转 原生页面，需传入完整的 app url 例：tinman-router://cn.tinman.jojoread/home/course
      if (Os.app) {
        window.location.href = url;
      } else {
        console.error('非叫叫 app 环境');
      }
      break;
    default: {
      const finalUrl = mergeUrlAndParams(url, params);
      // 页面内路由跳转
      router.navigate(finalUrl, { replace: mode === 'replace' });
      break;
    }
  }
};

export default showPage;
