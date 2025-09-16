import { PAY_AFTER_URL } from '@/constants';
import { getSignWays, getUserAddress } from '@/services/api/order';
import { getEnvEnum } from '@/services/common';
import { JOIN_CLASS_URL } from '@/services/config';
/**
 * 判断是否需要跳转小程序订阅收银台
 */
export const needJumpToMiniPay = async (params: { subscriptionType: string }) => {
  let needJumpToMini = false;
  // 只有在叫叫儿童阅读小程序中才能跳转 小程序订阅收银台（排除在叫叫儿童阅读）
  if (JOJO.Os.xcx && !JOJO.Os.matrix) {
    // 小程序环境走开关控制：开关打开时，直接跳转到小程序订阅收银台;开关关闭时，跳转到H5订阅收银台
    // cashierDeskVersion： v1：走h5 | v2：走小程序
    try {
      const payEnv = await getEnvEnum();
      const res = await getSignWays({
        payEnvEnum: payEnv,
        subscribeType: params?.subscriptionType
      });

      if (res?.resultCode === 200 && res?.data?.cashierDeskVersion === 'v2') {
        needJumpToMini = true;
      }
    } catch (error) {
      console.log('跳转小程序订阅收银台报错：', error);
    }
  }
  return needJumpToMini;
};
/**
 * 跳转银联订阅收银台
 */
export const jumpToSubscribePay = async (params: any) => {
  const needJumpToMini = await needJumpToMiniPay(params);
  if (needJumpToMini) {
    JOJO.showPage('/pages/pkgs/mall/pages/subscribe_pay/main', {
      params,
      to: 'mini'
    });
  } else {
    console.log('不跳转小程序订阅收银台');
  }
};
/**
 * 格式化优惠券id
 */
export const formatUserCouponIdList = (cpId: string, useUserCouponIds: string[]) => {
  if (cpId) {
    return Array.isArray(cpId) ? cpId : cpId?.split(',');
  }
  if (useUserCouponIds.length) {
    return useUserCouponIds;
  }
  return [];
};

// 支付完成跳转逻辑
export const toPayAfter = async ({ data, orderId, shizi_url, platformOrderSource }: any) => {
  const { orderState, selfSupporting, autoActive } = data;
  // 地址后置
  if (String(orderState) === '301') {
    const res = await getUserAddress();
    // 需要发货且发货地址后置
    if (res?.data?.length) {
      JOJO.showPage('/address/list', {
        params: {
          type: 'addressDelayAddFromList',
          orderId,
          shizi_url,
          platformOrderSource
        },
        to: 'externalWeb',
        mode: 'replace'
      });
    } else {
      JOJO.showPage('/address/edit', {
        params: {
          type: 'addressDelayAdd',
          orderId,
          shizi_url,
          platformOrderSource
        },
        to: 'externalWeb',
        mode: 'replace'
      });
    }
    return;
  }
  // 有回跳地址
  const inner_shizi_url = shizi_url || sessionStorage.get(PAY_AFTER_URL);
  if (inner_shizi_url && inner_shizi_url !== 'undefined') {
    const payAfterUrl = window.atob(inner_shizi_url);
    const query = JOJO.Utils.getQuery(payAfterUrl);
    const newQuery = { ...query, payStatus: 'success', mallOrderNo: orderId };
    const location = payAfterUrl?.split('?')[0];
    const url = /\?$/g.test(location) ? location : `${location}?`;
    JOJO.showPage(url, {
      params: newQuery,
      to: 'externalWeb',
      mode: 'replace'
    });
    return;
  }

  // 自动激活
  if (autoActive) {
    JOJO.showPage(`${JOIN_CLASS_URL}`, {
      to: 'externalWeb',
      mode: 'replace',
      params: {
        orderId,
        sourceName: 'mall',
        payChannel: 'normal'
      }
    });
    return;
  }
  // 来源：绘本app
  if (data.orderSource === '304') {
    JOJO.showPage('/order/success', {
      params: {
        orderId,
        ss: 'false',
        platformOrderSource
      },
      to: 'externalWeb',
      mode: 'replace'
    });
    return;
  }
  // 有优惠券
  if (data.haveCoupon) {
    JOJO.showPage(`/order/coupon/success?ss=${!!selfSupporting}`, {
      to: 'externalWeb',
      mode: 'replace'
    });
    return;
  }
  // 没有课程
  if (!data.hasCourse) {
    JOJO.showPage('/order/success', {
      params: {
        orderId,
        ss: 'false',
        platformOrderSource
      },
      to: 'externalWeb',
      mode: 'replace'
    });
    return;
  }

  JOJO.showPage(`${JOIN_CLASS_URL}`, {
    to: 'externalWeb',
    mode: 'replace',
    params: {
      orderId,
      sourceName: 'mall',
      payChannel: 'normal'
    }
  });
};
