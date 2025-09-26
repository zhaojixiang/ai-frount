import type { EnvEnum } from '@/constants';
import { serviceUrl } from '@/services/config';
/**
 * 支付宝：获取支付token
 */
export const getTokenForBillCheckOut = (params: any) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.orderpay,
    url: `/api/fe/pay/get-token-for-bill-check-out`,
    method: 'POST'
  });
};
/**
 * 支付宝：获取支付token
 */
export const billCheckOutByToken = (params: any) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.orderpay,
    url: `/noRight/api/fe/pay/bill-check-out-by-token`,
    method: 'GET'
  });
};
/**
 * 获取地址
 */
export const getPayMethods = (params: {
  aliCashierType: string;
  wechatCashierType: string;
  env: EnvEnum;
  skuId: string;
  linkCode: string;
}) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.orderpay,
    url: `/api/fe/pay/list-pay-way`,
    method: 'POST'
  });
};
/**
 * 创建支付单
 */
export const getOrderPayOrCreate = (params: { bizId: string; bizType: string }) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.orderpay,
    url: `/api/fe/pay/get-order-pay-or-create`,
    method: 'POST'
  });
};
/**
 * 订单状态检测
 */
export const getPayedOrderInfo = (params: { orderId: string }) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.orderpay,
    url: `/api/fe/order/get-paid-order-info`
  });
};
/**
 * 获取支付结果
 */
export const getPaiedBillInfo = (params: { orderPayId: string }) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.orderpay,
    url: `/api/fe/order/get-paid-bill-info`
  });
};
