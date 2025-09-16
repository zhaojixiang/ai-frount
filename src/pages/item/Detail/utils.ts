import { Modal } from 'antd-mobile';
import Cookies from 'js-cookie';

import { isIosApp } from '@/lib/utils';
import { subtract } from '@/lib/utils/mathUtils';
import { isDoubleAccountLogin, isLogin, popupLogout } from '@/modules/auth';
import { precheckOrder, validateOrder } from '@/services/api/order';
import { getItemDetail, getItemDetailWithoutAuth } from '@/services/api/product';
import { getCacheTraceCode } from '@/services/common';
import { JOJO_FROUNT_URL, JOJOUP_FROUNT_URL, UNBIND_URL } from '@/services/config';

import type { SkuSaleResp } from './type';

/**
 * 小升初
 * @param useType 使用类型,链接上带的useType
 * @param linkCode 链路码
 */
export const upgradeChinese = (useType: string, linkCode: string) => {
  if (JOJO.Os.jojoup && useType === 'UPGRADE_CHINESE') {
    // 判断当前链路，是否是续费
    sessionStorage.setItem('l9UpdateC1UseType', 'UPGRADE_CHINESE');
    // 是不是微信内
    if (JOJO.Os.wechatBrowser || JOJO.Os.xcx) {
      // 是不是登录了
      console.log('打印日志：进入小升初', Cookies.get('authToken'));
      if (Cookies.get('authToken')) {
        // 缓存中是否有code对应的trackID
        const traceCodeSameUid = localStorage.getItem('traceCodeUid') === Cookies.get('uid');
        // 是不是当前登录的用户已经有追踪码了
        if (!traceCodeSameUid) {
          // 在追踪码页面中，最后跳转的地址
          const trackUrl = window.location.href;
          // 调转到UC换取授权unionId,然后跳转到追踪码页面，然后跳回来。
          const requestUrl = `https://mall.tinman.cn/item/track?trackUrl=${encodeURIComponent(
            trackUrl
          )}&linkCode=${linkCode}`;
          const url = `https://uc-api.tinman.cn/page/wechatMp/portal/entrance?mode=3&wechatAuthType=1&requestUrl=${encodeURIComponent(
            requestUrl
          )}`;
          localStorage.setItem('打印日志：跳转到UC情况下的路由1', url);
          localStorage.setItem('打印日志：跳转到UC情况下的路由2', requestUrl);
          window.location.href = url;
        }
      }
      return '';
    } else {
      return 'env error';
    }
  }
  return '';
};

/**
 * 商品详情页：jojoApp、jojoupApp跨租户使用矩阵链接 || 矩阵App中跨租户使用jojo、jojoup链接
 */
export async function crossTenantForMatrix() {
  let isCorssTenant = false;
  if (JOJO.Os.app) {
    const matrixApp = await JOJO.Os.matrixApp;
    if ((JOJO.Os.matrix && !matrixApp) || (!JOJO.Os.matrix && matrixApp)) {
      isCorssTenant = true;
    }
  }
  return isCorssTenant;
}
/**
 * 商品详情页跨租户售卖商品: jojo 和 jojoup混卖，重定向至商品租户域名下
 * @param productTenant 商品租户
 */
export async function crossTenantForSale(params: any, option: any) {
  let isCorssTenant = false;
  try {
    // 请求商品详情数据
    const res = await getItemDetailWithoutAuth(params, option);
    const tenant = res?.data?.ssTenantId;
    if (tenant === 'jojo' && JOJO.Os.jojoup) {
      // 重定向至jojo商品详情
      isCorssTenant = true;
      window.location.replace(`${JOJO_FROUNT_URL}/item/detail${window.location.search}`);
    }
    if (tenant === 'jojoup' && JOJO.Os.jojo) {
      // 重定向至jojoup商品详情
      isCorssTenant = true;
      window.location.replace(`${JOJOUP_FROUNT_URL}/item/detail${window.location.search}`);
    }
  } catch (error) {
    console.log(error);
  }
  return isCorssTenant;
}

/**
 * 获取商品详情
 * @param params 商品详情参数
 * @param isLogin 是否登录
 * @returns 商品详情数据
 */
export async function getDetail(params: any, innerIsLogin: boolean) {
  // 矩阵跨租户情况拦截
  const isCorssTenantForMatrix = await crossTenantForMatrix();
  if (isCorssTenantForMatrix) {
    return {
      resultCode: 500,
      data: {
        isCorssTenant: true
      },
      errorMsg: '当前APP暂不支持购买该商品'
    };
  }

  // 审核模式请求头
  const option: any = {};
  if (JOJO.Os.app) {
    try {
      const deviceInfo = await JOJO.bridge.call('getDeviceInfo');
      const { data: { iosAudit = '' } = {} } = deviceInfo || {};
      if (iosAudit?.toString() === '1') {
        option.headers = {
          'TM-UserAgent-am': '1'
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  const { linkCode } = params;
  let req;
  if (innerIsLogin) {
    req = getItemDetail;
  } else {
    req = getItemDetailWithoutAuth;
  }
  // 获取l9生c1参数、
  const traceCode = getCacheTraceCode() || '';
  const reqParams = { linkCode, traceCode };

  // jojo，jojoup跨租户切换商品链接
  const isCorssTenant = await crossTenantForSale(reqParams, option);
  if (isCorssTenant) {
    return {
      resultCode: 500,
      data: {
        isCorssTenant: true
      },
      errorMsg: '商品链接切换中'
    };
  }

  // 获取商品详情
  let res: any = {};
  try {
    res = await req(reqParams, option);
  } catch (error: any) {
    console.log(error);
  }

  return res;
}

/**
 * 商品详情页是否登录
 */
export const isLoginInDetail = () => {
  // 微信浏览器
  if (JOJO.Os.wechatBrowser) {
    return isDoubleAccountLogin();
  }
  // 普通浏览器（排除 微信内环境 和 APP环境）
  if (!JOJO.Os.wechat && !JOJO.Os.app) {
    return isLogin();
  }
  // 其他环境默认走鉴权接口
  return true;
};

function splitOssUrl(url: string) {
  if (url?.indexOf('?ossUrl') > -1) {
    return url?.split('?ossUrl')?.[0];
  }
  return url;
}

// 当页面在小程序中打开时，静态替换url地址
export const replaceStateInMiniApp = (data: any) => {
  try {
    if (JOJO.Os.xcx) {
      // 获取URL中的参数
      const params = new URLSearchParams(window.location.search);
      // 需要判断链接上是否已经存在了当前几个参数
      if (!params.get('shareUrl') && data?.shareUrl) {
        params.append('shareUrl', data?.shareUrl);
      }
      if (!params.get('shareImage') && data?.shareImage) {
        params.append('shareImage', splitOssUrl(data?.shareImage));
      }
      if (!params.get('shareTitle') && data?.shareTitle) {
        params.append('shareTitle', data?.shareTitle);
      }
      // 将新的参数字符串化并附加到URL
      window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * 校验是否可以购买
 * @param skuDetail
 * @param withToast
 */
export const validateSkuCanBuy = (skuDetail: SkuSaleResp) => {
  // 订阅类型
  let nextSubscribeType: number | string = '';
  // 是否可以购买
  let canBuy = true;

  // 订阅购买
  if (skuDetail?.subscriptionList?.length) {
    // 有订阅模式时进行校验
    if (skuDetail?.existActivated || skuDetail?.isOnArgument) {
      nextSubscribeType = '';
    } else {
      nextSubscribeType = skuDetail?.subscriptionList[0].subscriptionType;
    }
  }
  // 不可普通购买
  if (skuDetail?.onlyRenewPay) {
    canBuy = false;
  }

  return {
    nextSubscribeType,
    canBuy
  };
};

export const checkOrder = async (properties: any, callbacks: any) => {
  const {
    skuDetail,
    linkCode,
    orderSource,
    payMode,
    curSubscribeType,
    giftPools,
    curPrice,
    learningPay,
    currencyType,
    isAlReadyShowvalidatePricePop
  } = properties;
  const {
    closeSkuSelectModal,
    setDownloadAppPopupVisible,
    refresh,
    showValidatePriceModal,
    showValidatePayAfterModal
  } = callbacks;
  // 海外商品环境拦截
  if (!JOJO.Os.jojoReadApp && currencyType === 'USD') {
    setDownloadAppPopupVisible(true);
    return false;
  }

  // 申请注销拦截
  const isLogout = await popupLogout();
  if (isLogout) {
    return false;
  }

  // 国内IOS APP中，纯虚拟商品下单拦截
  const iosApp = await isIosApp();
  if (iosApp && currencyType !== 'USD') {
    if (!skuDetail?.needShip) {
      JOJO.toast.show({
        content: '该商品暂时无法购买，请联系客服'
      });
      return false;
    }
  }

  // 构造参数
  const skuId = skuDetail.id;
  const unitPrice = skuDetail.promotionPrice;

  const params = {
    linkCode,
    skuId,
    giftPools,
    totalAmount: unitPrice,
    skuPrice: skuDetail.skuPrice,
    subscriptionType: curSubscribeType
  };

  let res;
  try {
    res = await validateOrder(params);
  } catch (error) {
    console.log(error);
    JOJO.toast.show({
      content: '请检查网络重试',
      icon: 'fail'
    });
    return false;
  }
  const { resultCode, errorMsg } = res || {};

  // 3001 子账号购买
  if (resultCode === 3001) {
    closeSkuSelectModal();
    Modal.confirm({
      title: '提示',
      content: '你当前是子账号状态，不能单独购买商品，如需购买商品，需要解绑账号后重试',
      onConfirm: () => {
        const url = `${UNBIND_URL}?redirect=${window.location.href}`;
        window.location.replace(url);
      },
      // onCancel: () => {},
      confirmText: '解绑账号',
      cancelText: '暂不绑定'
    });
    return false;
  }

  // 价格发生变化
  if (resultCode === 1001) {
    JOJO.toast.show({
      content: '抱歉，价格已发生变化!',
      icon: 'fail'
    });
    refresh?.();
    return false;
  }

  if (resultCode !== 200) {
    JOJO.toast.show({
      content: errorMsg || '抱歉，验证未通过!',
      icon: 'fail'
    });
    return false;
  }

  // 先学后付 0元签约
  if (learningPay) {
    try {
      const res2: any = await precheckOrder({
        skuId,
        action: 'LEARNING_PAY'
      });
      if (res2?.data?.orderId) {
        showValidatePayAfterModal?.({
          orderId: res2?.data?.orderId
        });
        return false;
      }
    } catch (error) {
      console.log('校验订单接口报错', error);
    }
  }

  // 验证是否有更优惠的待支付订单
  if (!isAlReadyShowvalidatePricePop) {
    try {
      const res1: any = await precheckOrder({
        payAmount: curPrice,
        skuId,
        payMode,
        orderSourceCode: orderSource || 101,
        action: 'CHEAP'
      });
      if (res1?.data?.orderId) {
        showValidatePriceModal?.({
          orderId: res1?.data?.orderId,
          payAmount: res1?.data?.payAmount
        });
        return false;
      }
    } catch (error) {
      console.log('校验订单接口报错', error);
    }
  }
  return true;
};

/**
 * 计算券后价
 * @param price 原价
 * @param discount 优惠金额
 * @returns 券后价
 */
export const calculatePrice = (price: number | string, discount: number | string): string => {
  const adjustedPrice = subtract(price, discount || 0);
  return adjustedPrice.toString().replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1');
};
