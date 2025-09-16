import { type AxiosRequestConfig } from 'axios';

import { serviceUrl } from '@/services/config';

/**
 * 获取商品详情(鉴权)
 */
export const getItemDetail = (
  params: { linkCode: string; traceCode?: string },
  option?: AxiosRequestConfig
) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.product,
    url: `/v1/products/${params.linkCode}`,
    ...option
  });
};

/**
 * 获取商品详情(不鉴权)
 */
export const getItemDetailWithoutAuth = (
  params: { linkCode: string; traceCode?: string },
  option?: AxiosRequestConfig
) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.product,
    url: `/product/queryDetail`,
    ...option
  });
};
/**
 * 获取微信签名
 */
export const getWxSignature = (params: { url: string }) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.product,
    url: `/wxmp/create-signature`
  });
};
/**
 * 获取扩科
 */
export const getRecommendSkus = (params: { saleSkuId: string }) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.product,
    url: `/sale-skus/${params.saleSkuId}/recommend-skus`
  });
};
