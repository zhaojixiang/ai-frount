export const shopSource = {
  'dev.shusheng.JoJoRead': 'JOJO_APP', // 叫叫APP
  'com.shusheng.JoJoRead': 'JOJO_APP', // 叫叫APP
  'com.jojoread.JoJoSherlock': 'CHINESE_ADVENTURE', // 新识字/汉字大冒险
  'com.tinmanarts.JoJoSherlock': 'LITERACY_APP', // 老识字
  'com.jojoread.huiben': 'PICTURE_APP', // 绘本
  'com.jojoread.JoJoCalculate': 'ORAL_CALCULATION_APP', // 口算
  wx8734de71e9438268: 'POLARIS_MINI', // 北极星小程序
  wx53aed20bd888a9a7: 'POLARIS_MINI', // 北极星测试环境小程序,趣读西游
  wxed0b8a672924899a: 'GROWTH_CENTER_MINI', // 成长中心小程序
  wx1fbbaa6654693d53: 'CHILDREN_READ_MINI' // 叫叫儿童阅读小程序
};

export const platformLimitTypes = {
  1: 'H5',
  2: 'APPLETS',
  3: 'APP'
};

// 环境枚举
export enum EnvEnum {
  WechatBrowser = 1,
  Miniprogram = 2,
  JojoApp = 3
}
// 支付完成跳转地址key
export const PAY_AFTER_URL = '_pay_after_url';

export const PAY_WAY = {
  AliPayOnline: 110, // 支付宝在线支付
  AliPayScan: 111, // 支付宝扫码付
  AliPayBOC: 140, // 支付宝中行
  AliPayBOCScan: 142 // 支付宝中行扫码付
};
