export interface OS {
  /**
   * 本地调试
   */
  debug: boolean;

  /**
   * 环境名称
   */
  envName: string;

  /**
   * APP名称
   */
  appName: string;
  /**
   * 是APP（包含：叫叫识字、叫叫绘本、叫叫口算、叫叫儿童阅读、jojoup）
   */
  app: boolean;
  /**
   * 是jojoupAPP
   */
  jojoupApp: boolean;
  /**
   * 是叫叫儿童阅读APP
   */
  jojoReadApp: boolean;
  /**
   * 是叫叫儿童阅读APP 鸿蒙版
   */
  jojoReadHmApp: boolean;
  /**
   * 是矩阵APP
   */
  matrixApp: boolean;
  /**
   * 是识字APP
   */
  shiziAPP: boolean;
  /**
   * 是绘本APP
   */
  huibenAPP: boolean;
  /**
   * 是口算APP
   */
  kousuanAPP: boolean;

  /**
   * 当前 H5环境 是叫叫
   */
  jojo: boolean;
  /**
   * 当前 H5环境 是jojoup
   */
  jojoup: boolean;
  /**
   * 当前 H5环境 是矩阵
   */
  matrix: boolean;
  /**
   * 是小程序
   */
  xcx: boolean;
  /**
   * 是微信环境（包含：小程序、微信浏览器）
   */
  wechat: boolean;
  /**
   * 是微信浏览器
   */
  wechatBrowser: boolean;
  /**
   * 是支付宝
   */
  ali: boolean;
  /**
   * 是钉钉
   */
  dingding: boolean;
}
