import { serviceUrl } from './config';

/**
 * 获取
 */
export const getDetail = (params: { linkCode: string }) =>
  JOJO.request(params, {
    url: '/product/queryDetail'
  });

/**
 * 获取班期id用于双账号登录判断
 */
export const getClassIdsByLinkCode = (params: { linkCode: string }) =>
  JOJO.request(params, {
    baseURL: serviceUrl.coupon,
    url: '/noRight/promotion-links/linkCode/classes'
  });

/**
 * 获取优惠券活动
 */
export const getCouponActivityDetail = (params: { activityId: string }) => {
  console.log('params', params);
  return JOJO.request(params, {
    baseURL: serviceUrl.coupon,
    url: `/coupon-activities/${params.activityId}`
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
 * 根据链接id获取商品列表信息
 * @param params
 */
export const getProductsByLinkIds = (params: { recommendProductLinks: any[] }) =>
  JOJO.request(params, {
    url: `/product/link-product`,
    method: 'POST'
  });
