import Os from '@/lib/os';

// 环境前缀分隔符
let separator = '';
if (window.process.env.ENV_NAME !== 'pro') {
  separator = Os.jojo ? '.' : '-';
}
// 环境前缀
const env = window.process.env.ENV_NAME === 'pro' ? '' : window.process.env.ENV_NAME;
// 分隔符 + 环境前缀
const separatorEnv = separator + env;

// --------------------商城前端域名----------------------
// 商城前端基础域名
export const JOJO_FROUNT_URL_BASE = `https://mall${separatorEnv}.tinman.cn`;
export const JOJOUP_FROUNT_URL_BASE = `https://pages${separatorEnv}.mohezi.cn`;
export const MATRIX_FROUNT_URL_BASE = `https://mall${separatorEnv}.cdssylkj.com`;

// 商城前端域名 新版
export const JOJO_FROUNT_URL = `https://mall${separatorEnv}.tinman.cn/velocity`;
export const JOJOUP_FROUNT_URL = `https://pages${separatorEnv}.mohezi.cn/mall/velocity`;
export const MATRIX_FROUNT_URL = `https://mall${separatorEnv}.cdssylkj.com/velocity`;
const frontUrl: Record<string, string> = {
  jojo: JOJO_FROUNT_URL,
  jojoup: JOJOUP_FROUNT_URL,
  matrix: MATRIX_FROUNT_URL
};
export const FROUNT_URL = frontUrl[Os.appName];

// 商城前端域名 旧版
export const JOJO_FROUNT_URL_OLD = JOJO_FROUNT_URL_BASE;
export const JOJOUP_FROUNT_URL_OLD = `https://pages${separatorEnv}.mohezi.cn/mall/center`;
export const MATRIX_FROUNT_URL_OLD = MATRIX_FROUNT_URL_BASE;
const frontUrlOld: Record<string, string> = {
  jojo: JOJO_FROUNT_URL_OLD,
  jojoup: JOJOUP_FROUNT_URL_OLD,
  matrix: MATRIX_FROUNT_URL_OLD
};
export const FROUNT_URL_OLD = frontUrlOld[Os.appName];

// --------------------外部前端域名----------------------
// 营销landing
const landing_base_url: Record<string, string> = {
  jojo: `https://act${separatorEnv}.tinman.cn/act2/qwerty`,
  jojoup: `https://pages${separatorEnv}.mohezi.cn/mall/landing`,
  matrix: `https://act${separatorEnv}.cdssylkj.com/act2/qwerty`
};
export const LANDING_BASE_URL = landing_base_url[Os.appName];

// 营销marketing
const marketing_base_url: Record<string, string> = {
  jojo: `https://act${separatorEnv}.tinman.cn`,
  jojoup: `https://pages${separatorEnv}.mohezi.cn/mall/market`,
  matrix: `https://act${separatorEnv}.cdssylkj.com`
};
export const MARKETING_BASE_URL = marketing_base_url[Os.appName];

// 加班页
export const JOIN_CLASS_URL = `${LANDING_BASE_URL}${
  Os.jojoup ? '/orderTransfer.html' : '/act2/17xlpt/orderTransfer.html'
}`;

// 教务地址
const jojo_read_base_url: Record<string, string> = {
  jojo: `https://jojoread${separatorEnv}.tinman.cn`,
  jojoup: `https://pages${separatorEnv}.mohezi.cn/read`,
  matrix: `https://jojoread${separatorEnv}.cdssylkj.com`
};
export const JOJO_READ_BASE_URL = jojo_read_base_url[Os.appName];

// 智齿客服地址
export const JING_TAN_NO_AUTH_URL = Os.jojoup
  ? `https://api.mohezi.cn/fb/pagani/api/pagani/view/jingtan/chat`
  : `https://api${separatorEnv}.tinman.cn/api/pagani/view/jingtan/chat`;

// 解绑子账号地址
export const UNBIND_URL = Os.jojoup
  ? `https://pages${separatorEnv}.mohezi.cn/read/server-v2/page/userSubAccount/view/bind`
  : `https://jojoread${separatorEnv}.tinman.cn/page/userSubAccount/view/bind`;

// UC授权地址
const uc_api_url_base: Record<string, string> = {
  jojo: `https://uc-api${separatorEnv}.tinman.cn`,
  jojoup: `https://pages${separatorEnv}.mohezi.cn/uc/r`,
  matrix: `https://uc-api${separatorEnv}.cdssylkj.com`
};
export const UC_API_URL_BASE = uc_api_url_base[Os.appName];

export const ACT_ORDER_TRANSFER_URL = '';

// --------------------服务端域名----------------------
// 商城服务端域名前缀
export const SERVICE_URL_PREFIX = {
  jojo: `https://api${separatorEnv}.tinman.cn`,
  jojoup: `https://pages${separatorEnv}.mohezi.cn`,
  matrix: `https://api${separatorEnv}.cdssylkj.com`
}[Os.appName];
/**
 * 服务端域名
 */
export const serviceUrl = {
  product: `${SERVICE_URL_PREFIX}/mall/product/api/fe`,
  coupon: `${SERVICE_URL_PREFIX}/mall/coupon/api/coupon/fe`,
  order: `${SERVICE_URL_PREFIX}/mall/order/api/fe`,
  orderpay: `${SERVICE_URL_PREFIX}/mall/order-pay/`,
  cashback: `${SERVICE_URL_PREFIX}/mall/cashback`,
  cashback_apollo: `${SERVICE_URL_PREFIX}/mall/cashback/noRight/apollo`,
  lego: `${SERVICE_URL_PREFIX}/api/lego`
};

export const AUTH_SIGN_URL = `${UC_API_URL_BASE}/page/wechatMp/portal/entrance`;

/**
 * 高德地图
 */
export const GAODE_MAP = {
  key: '58839b048067f50763de692640d7f583', // 申请好的Web端开发者Key，首次调用 load 时必填
  securityJsCode: '0b52e760fa1a12be0fdf9337b21d656c' // 谷歌地图安全密钥
};

export default {
  serviceUrl,
  AUTH_SIGN_URL
};
