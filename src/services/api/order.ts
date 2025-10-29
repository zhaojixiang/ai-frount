import Cookies from 'js-cookie';

import type { EnvEnum } from '@/constants';
import { serviceUrl } from '@/services/config';

import {
  getAppEnum,
  getCacheTraceCode,
  getPlatformId,
  getPlatformType,
  getSystem
} from '../common';

/**
 * 获取物流轨迹
 */
export const getDeliveryTrace = (params: { gpoNo: string; expressNo: string }) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.order,
    url: `/deliveryPage/queryTrace`
  });
};
/**
 * 获取订单详情
 */
export const getOrderDetail = (params: {
  orderId: string;
  skuId: string;
  expressNumber: string;
}) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.order,
    url: `/deliveryPage/queryOrderDetail`
  });
};
/**
 * 校验订单
 */
export const validateOrder = (params: {
  linkCode: string;
  skuId?: string;
  giftPools?: string;
  totalAmount: number;
  skuPrice: number;
  subscriptionType: number;
}) => {
  const uid = Cookies.get('uid') || 1;
  return JOJO.request(
    { ...params, userId: uid, quantity: 1 },
    {
      baseURL: serviceUrl.order,
      url: `/place-order/validateV2`,
      method: 'POST'
    }
  );
};
/**
 * 校验订单
 */
export const precheckOrder = (params: {
  payAmount?: string;
  skuId?: string;
  payMode?: string;
  orderSourceCode?: number;
  action: 'CHEAP' | 'LEARNING_PAY';
}) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.order,
    url: `/user/orders/precheck`,
    method: 'POST'
  });
};

/**
 * 获取促销商品详情
 * @param params
 * @returns
 */
export async function getProductDetail(params: {
  linkCode: string;
  userCouponIds?: string[]; // 优惠券id
  useRecommendCoupon: boolean; // 是否使用推荐优惠券
  giftSkuIds?: string[]; // 购买skuId
  skuId: string; // 购买skuId
  giftPools?: string; // 赠品池
  buyNum?: number; // 购买数量
  subscriptionMode?: string; // 订阅模式
  subscriptionMethod?: string; // 订阅方式
  voucherIds?: string[]; // 代金券
}) {
  const traceCode = getCacheTraceCode();
  const platformtId = await getPlatformId();
  const platformType = await getPlatformType();
  return JOJO.request(
    {
      ...params,
      platformtId,
      platformType,
      traceCode
    },
    {
      url: `/promotion-links/${params.linkCode}`,
      baseURL: serviceUrl.order
    }
  );
}
/**
 * 获取地址
 */
export const getUserAddress = () => {
  return JOJO.request(
    {},
    {
      baseURL: serviceUrl.order,
      url: `/address/get-userAddress`
    }
  );
};

/**
 * 获取签约方式
 */
export const getSignWays = (params: { payEnvEnum: EnvEnum; subscribeType: string }) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.order,
    url: `/v1/agreements/sign-ways`
  });
};
/**
 * 校验订单
 */
export const preCheck = (params: {
  payAmount: number;
  skuId: string;
  payMode: string;
  orderSourceCode: number;
  action: 'CHEAP' | 'MALL_BOOM_CAN_BIND_INVITE';
}) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.order,
    url: `/user/orders/precheck`,
    method: 'POST'
  });
};
/**
 * 创建订单
 */
export const createOrder = async (params: {
  linkCode: string; // 商品链接码
  skuId: string; // 商品skuId
  totalAmount: number; // 订单总金额
  userAddressId: string; // 收货地址id
  userCouponIdList: string[]; // 优惠券id
  quantity: number; // 购买数量
  orderSource: string; // 订单来源
  outToken: string; // 订单token
  orderChannel: string; // 老渠道参数
  channelNo: string; // 渠道码
  skuPrice: number; // 商品价格
  payMode: 'CASH' | 'POINT'; // 支付方式
  externalProductCode: string; // 海外版本：外部编码
  recommendSkuId: string; // 扩科商品id
  voucherIds: string[]; // 代金券
  giftPools: string; // M选N
  orderType: 'LEARNING_PAY' | 'NORMAL'; // 订单类型
}) => {
  const traceCode = getCacheTraceCode();
  const platformtId = await getPlatformId();
  const platformType = await getPlatformType();
  const app = await getAppEnum();
  const clientOs = getSystem();
  return JOJO.request(
    {
      ...params,
      traceCode,
      platformtId,
      platformType,
      app,
      clientOs
    },
    {
      baseURL: serviceUrl.order,
      url: `/v2/user/orders`,
      method: 'POST'
    }
  );
};

/**
 * 获取下一级区域
 */
export const getRegion = (params: { parentId: number | string }) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.order,
    url: `/address/get-region`
  });
};
/**
 * 获取省
 */
export const getProvince = () => {
  return JOJO.request(
    {},
    {
      baseURL: serviceUrl.order,
      url: `/address/get-province`
    }
  );
};
/**
 * 创建地址
 */
export const createAddress = (params: {
  recipientName: string;
  recipientPhone: string;
  addressDetail: string;
  provinceRegionId: number;
  cityRegionId: number;
  areaRegionId: number;
  regionCode: string;
}) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.order,
    method: 'POST',
    url: `/address/create-userAddress`
  });
};
/**
 * 更新地址
 */
export const updateAddress = (params: {
  id: string;
  recipientName?: string;
  recipientPhone?: string;
  addressDetail?: string;
  provinceRegionId?: number;
  cityRegionId?: number;
  areaRegionId?: number;
  regionCode?: string;
}) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.order,
    method: 'POST',
    url: `/address/update-userAddress`
  });
};
