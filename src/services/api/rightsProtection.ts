import { type AxiosRequestConfig } from 'axios';

import { serviceUrl } from '@/services/config';

// 获取订单价保相关信息
export const getOrderProtection = (params: { orderId: string }, option?: AxiosRequestConfig) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.cashback,

    url: `/api/fe/user/orders/${params.orderId}/price-protection`,
    ...option
  });
};

// 获取订单商品相关信息
export const getOrderProduct = (params: { orderId: string }, option?: AxiosRequestConfig) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.cashback,
    url: `/api/fe/user/orders/${params.orderId}/products`,
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
    baseURL: serviceUrl.lego,
    url: `/fe/user/promotions/${params.promotionId}`,
    ...option
  });
};

export const submitPriceProtection = (
  params: {
    orderId: string;
    promotionId: string | number;
    promotionVersion: number | string;
    userAddressId?: string | number;
    chooseGifts: any;
  },
  option?: AxiosRequestConfig
) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.cashback,
    url: `/api/fe/user/orders/${params?.orderId}/price-protection`,
    method: 'POST',
    ...option
  });
};

export const getApolloBackground = (params: { key: string }, option?: AxiosRequestConfig) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.cashback_apollo,
    url: `/get-by-key`,
    ...option
  });
};
