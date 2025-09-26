// 与业务相关的公共方法
import wx from 'weixin-js-sdk';

import { EnvEnum, platformLimitTypes, shopSource } from '@/constants';
/**
 * 获取l9生c1参数 traceCode
 */
export function getCacheTraceCode() {
  const useType = sessionStorage.getItem('l9UpdateC1UseType') || undefined;
  let traceCode;
  if (useType === 'UPGRADE_CHINESE') {
    traceCode = localStorage.getItem('traceCode');
    if (traceCode) {
      traceCode = decodeURIComponent(traceCode);
    }
  }
  return traceCode;
}

/**
 * 获取平台限制ID
 * @returns 平台限制ID
 */
export const getPlatformId = async () => {
  let source = 'H5';
  if (JOJO.Os.app) {
    source = 'APP';
    try {
      const appInfo = await JOJO.bridge.appInfo();
      const { data: { bundleID = '' } = {} } = appInfo || {};
      source = shopSource[bundleID as keyof typeof shopSource] || 'APP';
    } catch (error) {
      console.log(error);
    }
    const isMiniProgram = await getIsMiniprogramEnv();
    if (isMiniProgram) {
      source = 'MINIPROGRAM';
      try {
        if (navigator.userAgent.match(/wx[0-9a-z]+$/)) {
          const appId = navigator.userAgent.match(/wx[0-9a-z]+$/)![0];
          source = shopSource[appId as keyof typeof shopSource] || 'MINIPROGRAM';
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  return source;
};

/**
 * 获取平台限制类型
 * @returns 平台限制类型
 */
export const getPlatformType = async () => {
  const env = await getEnvEnum();
  const platformLimitType = platformLimitTypes[env];
  return platformLimitType;
};

/**
 * 判断是否在小程序环境
 * @returns 是否在小程序环境
 */
export const getIsMiniprogramEnv = () =>
  new Promise((resolve) => {
    if (JOJO.Os.wechatBrowser) {
      // ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
      wx.miniProgram.getEnv((res: any) => {
        resolve(Boolean(res.miniprogram));
      });
    } else {
      resolve(false);
    }
  });

/**
 * 获取环境
 */
export const getEnvEnum = async (): Promise<EnvEnum> => {
  if (JOJO.Os.app) return EnvEnum.JojoApp;

  if (await getIsMiniprogramEnv()) return EnvEnum.Miniprogram;

  return EnvEnum.WechatBrowser; // 默认返回微信浏览器
};

/**
 * 获取包名枚举值
 */
export const getAppEnum = async () => {
  const packMap: any = {
    // 叫叫学院
    'com.shusheng.jojoread': '1',
    'dev.shusheng.jojoread': '1',
    'com.shusheng.hm.JoJoRead': '1',
    // 叫叫识字
    'com.tinmanarts.jojosherlock': '6',
    'com.jojoread.jojosherlock': '4',
    // 叫叫绘本
    'com.jojoread.huiben': '2',
    // 叫叫口算
    'com.jojoread.jojocalculate': '5',
    'com.mohezi.fairyland': '7'
  };
  let appName = '';
  if (JOJO.Os.app && JOJO.bridge.canUseBridge()) {
    try {
      appName = await JOJO.Utils.getAppName();
    } catch (error) {
      console.log('bridge ready error', error);
    }
  }
  return packMap?.[appName] || '';
};

/**
 * 获取当前系统枚举值
 * @returns {string}
 */
export const getSystem = () => {
  enum System {
    IOS = 'IOS',
    ANDROID = 'ANDROID',
    HMOS = 'HMOS',
    OTHER = 'OTHER'
  }
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua) && !/hmos/.test(ua)) {
    return System.ANDROID;
  } else if (/hmos/.test(ua)) {
    return System.HMOS;
  } else if (/iphone|ipad|ipod|ios|macintosh/.test(ua)) {
    return System.IOS;
  } else {
    return System.OTHER;
  }
};
