import jojoAccount from '@jojo/account-sdk';
import Cookies from 'js-cookie';
import qs from 'query-string';

import { getClassIdsByLinkCode } from '@/services/api';
import { AUTH_SIGN_URL, UC_API_URL_BASE } from '@/services/config';

import { isIosApp } from '../../lib/utils';
import type { AuthorizeType, WxAuthOptions } from './index.d';

const IS_NEW_ACCOUNT_AUTH = 'dubbleAccountLogin';

/**
 * 获取授权页面地址
 * @param {AuthorizeType} param0 - 授权参数
 * @returns {string} - 授权页面地址
 */
export async function toAuthrize({
  appId,
  mode,
  wechatAuthType,
  authBizType,
  requestUrl
}: AuthorizeType): Promise<string> {
  const url = requestUrl || window.location.href;
  const classIds = await _getClassIdsByLinkCode();

  const queryParams = qs.stringify({
    mode,
    authWechatAppId: appId,
    wechatAuthType,
    authBizType,
    dubbleAccountLoginClassIds: classIds,
    requestUrl: url
  });
  console.log(`${AUTH_SIGN_URL}?${queryParams}`);
  return `${AUTH_SIGN_URL}?${queryParams}`;
}

/**
 * 是否普通登录
 */
export const isLogin = (): boolean => {
  return !!Cookies.get('authToken') || JOJO.Os.debug;
};

/**
 * 检测是否是双账号登录
 * @returns {boolean}
 */
export function isDoubleAccountLogin() {
  // 普通登录token
  const authToken = isLogin();
  // 双账号登录标识
  const isNewAccountAuth = Cookies.get(IS_NEW_ACCOUNT_AUTH);
  // 在微信浏览器环境内，已登录新授权
  if ((JOJO.Os.wechatBrowser && authToken && isNewAccountAuth === 'yes') || JOJO.Os.debug) {
    return true;
  }
  return false;
}

/**
 * 是否需要唤起新授权
 * @returns {boolean}
 */
export function needNewAuth() {
  if (JOJO.Os.wechatBrowser) {
    if (isDoubleAccountLogin()) {
      setTimeout(async () => {
        const redirectUrl = await toAuthrize({
          mode: 1,
          authBizType: 3
        });
        window.location.replace(redirectUrl);
      }, 100);
      return true;
    }
    return false;
  }
  return false;
}

/**
 * 根据linkCode获取班期id
 * @param linkCode
 * @returns
 */
export const _getClassIdsByLinkCode = async () => {
  const params = new URLSearchParams(window.location.search);
  const linkCode = params.get('linkCode'); // 获取参数 linkCode 的值
  const activityId = params.get('activityId'); // 获取参数 activityId 的值

  let classIdStr = '';
  // 仅微信浏览器环境，促销链路需要获取班期id
  if (JOJO.Os.wechatBrowser && (linkCode?.startsWith('NL') || activityId?.startsWith('B'))) {
    try {
      const res = await getClassIdsByLinkCode({ linkCode: linkCode || activityId || '' });
      const classIds = res?.data?.map((item: any) => item?.id) || [];

      classIdStr = classIds?.length ? String(classIds) : '';
    } catch (error) {
      console.error(error);
    }
  }
  return classIdStr;
};

/**
 * 微信授权: 用于仅授权不登录
 */
export const wxAuth = async (props?: WxAuthOptions) => {
  // 非微信浏览器环境，不进行微信授权
  if (!JOJO.Os.wechatBrowser || JOJO.Os.debug) {
    return true;
  }
  const { needPopLogin = false } = props || {};

  // 已授权，不进行微信授权
  const wxAuthCode = Cookies.get('uc_dubbleAccount_wxAuthCode');
  if (wxAuthCode) {
    return true;
  }

  // 仅授权时，已有登录态，不进行微信授权
  if (!needPopLogin) {
    const _isDoubleAccountLogin = isDoubleAccountLogin();
    if (_isDoubleAccountLogin) {
      return true;
    }
  }

  // 未授权，进行微信授权
  let url = window.location.href;
  if (needPopLogin) {
    const [baseUrl, queryString] = url.split('?');
    const existingParams = qs.parse(queryString);
    const mergedParams = { ...existingParams, needPopLogin: true };
    const newQueryString = qs.stringify(mergedParams);
    url = `${baseUrl}?${newQueryString}`;
  }
  const authUrl = await toAuthrize({
    mode: 1,
    authBizType: 4,
    requestUrl: url
  });
  window.location.replace(authUrl);
  return false;
};

/**
 * 清除链接上的 needPopLogin 参数
 */
const clearNeedPopLoginInUrl = () => {
  const existingParams = qs.parse(window.location.search.replace(/^\?/, ''));
  const { needPopLogin, ...rest } = existingParams || {};
  const url = `${window.location.pathname?.replace(/\/(mall\/center|velocity)/g, '')}?${qs.stringify(rest)}`;
  JOJO.showPage(url, { mode: 'replace' });
};

interface PopLoginOptions {
  callback?: () => void;
}
/**
 * 弹窗登录
 */
export const popLogin = (props?: PopLoginOptions) => {
  if (JOJO.Os.app || JOJO.Os.xcx) {
    return;
  }

  if (JOJO.Os.wechatBrowser) {
    // 先微信授权
    const isWxAuth = wxAuth({ needPopLogin: true });
    if (!isWxAuth) {
      return;
    }
  }

  const { callback } = props || {};

  // 弹出弹窗，清除链接上的标识，避免刷新页面再次弹出
  clearNeedPopLoginInUrl();

  jojoAccount.popupLogin({
    wechatLogin: {
      mode: 1,
      wechatAuthType: 1,
      requestUrl: window.location.href
    },
    platformName: JOJO.Os.jojoup ? 'mall-jojoup-order' : 'mall-jojo-order',
    showWechatBtn: 'hidden',
    ...(JOJO.Os.wechatBrowser ? { dubbleAccountLoginVersion: 'V2' } : {}),
    dubbleAccountLoginClassIds: localStorage.getItem('classIdStr') || '',
    dubbleAccountLogin: true,
    callback: () => {
      callback?.();
    },
    onError: (res) => {
      // 微信授权code失效，重新授权
      if (String(res?.subCode) === '3033') {
        wxAuth({ needPopLogin: true });
      }
    }
  });
};

enum AccountState {
  NOT_APPLY = 'NOT_APPLY', // 未申请注销
  WAIT_CANCELLATION = 'WAIT_CANCELLATION', // 等待注销
  CANCELLATION = 'CANCELLATION', // 已注销
  CANCELED = 'CANCELED' // 已取消
}
/*
 * 校验用户是否申请注销
 */
export async function popupLogout(props: any = {}) {
  let isShowLogout = false;
  try {
    const res = await jojoAccount.popupLogout({
      confirmCallback: () => {
        JOJO.toast.show({
          content: '撤销成功',
          icon: 'success'
        });
      },
      ...props
    });
    const { status, data } = res || {};
    if (status === 0) {
      const { accountState } = data || {};
      if (accountState === AccountState.WAIT_CANCELLATION) {
        isShowLogout = true;
      }
    }
  } catch (error) {
    console.log(error);
  }
  return isShowLogout;
}
// 直接登录
let loginTimer: any = null;
// 游客模式下，需要调用另外的登录原生页面
export const jojoAppDirectLoginNoGuest = async (url = '') => {
  try {
    if (JOJO.Os.jojoReadApp && JOJO.Os.jojoup) {
      await jojoAccount.logout();
      // 叫叫app中使用jojoup链接时
      const redirectUrl: string = await toAuthrize({
        mode: 1,
        authBizType: 3
      });
      window.location.replace(redirectUrl);
    } else {
      clearTimeout(loginTimer);
      loginTimer = setTimeout(async () => {
        const { status, data } = await JOJO.bridge.call('nativeOnlyLogin');
        if (status === 200 && data && data.authToken) {
          window.location.href = `${UC_API_URL_BASE}/page/appWeb/portal/appWebLogin?authToken=${
            data.authToken
          }&packageName=mp.tinman.JoJoRead&targetUrl=${encodeURIComponent(
            url || window.location.href
          )}`;
        }
      }, 300);
    }
  } catch (e) {
    console.error('ERROR===', e);
  }
};

export const isAuditGuestLogin = async () => {
  let audit = false;
  let guest = false;
  const _isIosApp = await isIosApp();

  if (_isIosApp && JOJO.Os.jojoReadApp) {
    const deviceInfo = await JOJO.bridge.call('getDeviceInfo');
    if (deviceInfo?.status === 200 && deviceInfo?.data) {
      audit = deviceInfo?.data?.iosAudit === '1';
      guest = deviceInfo?.data?.iosAuditVisitor === '1';
    }
  }
  if (audit && guest) {
    jojoAppDirectLoginNoGuest();
    return true;
  } else {
    return false;
  }
};

// 直接登录
let appDirectloginTimer: any = null;
export const jojoAppDirectLogin = async (url = '') => {
  try {
    if (JOJO.Os.jojoReadApp && JOJO.Os.jojoup) {
      await jojoAccount.logout();
      // 叫叫app中使用jojoup链接时, 走H5登录
      const redirectUrl: string = await toAuthrize({
        mode: 1,
        authBizType: 3
      });
      window.location.replace(redirectUrl);
    } else {
      clearTimeout(appDirectloginTimer);
      appDirectloginTimer = setTimeout(async () => {
        let packageName = JOJO.Os.jojoup ? 'mp.mohezi.JoJoUp' : 'mp.tinman.JoJoRead';
        const ua = window.navigator.userAgent;
        const [{ status, data }, bundleID] = await Promise.all([
          JOJO.bridge.call('nativeLogin'),
          JOJO.Utils.getAppName()
        ]);
        if (/huiben/gim.test(ua)) {
          packageName = 'com.jojoread.huiben';
        } else if (bundleID) {
          packageName = bundleID;
        }
        if (status === 200 && data && data.authToken) {
          window.location.href = `${UC_API_URL_BASE}/page/appWeb/portal/appWebLogin?authToken=${
            data.authToken
          }&packageName=${packageName}&targetUrl=${encodeURIComponent(
            url || window.location.href
          )}`;
        }
      }, 300);
    }
  } catch (e) {
    console.error('ERROR===', e);
  }
};
