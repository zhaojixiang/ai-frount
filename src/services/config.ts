import Os from '@/lib/os';

// 环境前缀分隔符
let separator = '';
if (import.meta.env.VITE_ENV_NAME !== 'pro') {
  separator = Os.jojo ? '.' : '-';
}
// 环境前缀
const env = import.meta.env.VITE_ENV_NAME === 'pro' ? '' : import.meta.env.VITE_ENV_NAME;

// 服务端域名前缀
const serviceUrlPrefix = `https://api${separator}${env}.tinman.cn/mall`;
/**
 * 服务端域名
 */
export const serviceUrl = {
  product: `${serviceUrlPrefix}/product/api/fe`,
  coupon: `${serviceUrlPrefix}/coupon/api/coupon/fe`,
  order: `${serviceUrlPrefix}/order/api/fe`
};

export const AUTH_SIGN_URL = 'https://uc-api.tinman.cn/page/wechatMp/portal/entrance';

export default {
  serviceUrl,
  AUTH_SIGN_URL
};
