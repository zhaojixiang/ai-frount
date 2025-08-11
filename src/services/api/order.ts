import { serviceUrl } from '@/services/config';

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
