import { type AxiosRequestConfig } from 'axios';

import { serviceUrl } from '@/services/config';

// 获取订单价保相关信息
export const getOrderProtection = (params: { orderId: string }, option?: AxiosRequestConfig) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.order,
    url: `/orders/${params.orderId}/price-protection`,
    ...option
  });
};

// 获取订单商品相关信息
export const getOrderProduct = (params: { orderId: string }, option?: AxiosRequestConfig) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.order,
    url: `/orders/${params.orderId}/price-protection`,
    ...option
  });
};

// 获取促销规则
export const getOrderRules = (
  params: {
    promotionId: string | number;
    promotionVersion: number | string;
    skuList: string;
    productId: string | number;
    matchedRuleTime: number;
  },
  option?: AxiosRequestConfig
) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.order,
    url: `/fe/promotions/${params.promotionId}`,
    ...option
  });
};
