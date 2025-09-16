import { serviceUrl } from '@/services/config';

/**
 * 获取优惠券列表
 */
export const getCouponList = (params: {
  linkCode: string;
  productId: string;
  displayPosition: string;
}) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.coupon,
    url: `/products/${params.productId}/coupons`
  });
};

/**
 * 领取优惠券，批量couponIds以英文逗号间隔
 * @param params
 */
export const pickCoupon = (params: { couponIds: any[]; channel: string; activityCode: string }) =>
  JOJO.request(params, {
    baseURL: serviceUrl.coupon,
    url: `/user/coupons`,
    method: 'POST'
  });

/**
 * 获取推荐代金券
 * @param params
 */
export const getVoucherList = (params: {
  skuId: string;
  assetsType: 'OPTIMAL_CHOICE' | 'VALID' | 'USED' | 'EXPIRED';
}) =>
  JOJO.request(params, {
    baseURL: serviceUrl.coupon,
    url: `/v1/user/voucher-assets`
  });
