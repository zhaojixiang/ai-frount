// 在 test 目录下创建一个全局设置文件
// test/setupGlobals.ts

global.JOJO = {
  Os: {
    debug: false,
    envName: 'test',
    appName: 'jojo',
    app: true,
    jojoupApp: false,
    jojoReadApp: false,
    jojoReadHmApp: false,
    matrixApp: false,
    shiziAPP: false,
    huibenAPP: false,
    kousuanAPP: false,
    jojo: true,
    jojoup: false,
    matrix: false,
    xcx: false,
    wechat: false,
    wechatBrowser: false,
    ali: false,
    dingding: false
  },
  loading: {
    show: jest.fn(),
    close: jest.fn()
  },
  Utils: {
    getDeviceOS: jest.fn(),
    getQuery: jest.fn(),
    isIosApp: jest.fn(),
    isAndroidApp: jest.fn(),
    setupFavicon: jest.fn(),
    filterEmptyParams: jest.fn(),
    getAppName: jest.fn(),
    isJoJoReadAppForHM: jest.fn(),
    isHigerVersion: jest.fn(),
    getAliExist: jest.fn(),
    getWxExist: jest.fn(),
    urlToBase64: jest.fn(),
    capture: jest.fn(),
    session: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn()
    },
    storage: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn()
    }
  },
  request: jest.fn(),
  showPage: jest.fn(),
  toast: {
    show: jest.fn(),
    error: jest.fn(),
    success: jest.fn(),
    close: jest.fn()
  },
  bridge: {
    canUseBridge: jest.fn(() => true),
    appInfo: jest.fn(),
    call: jest.fn(),
    isAppInstalled: jest.fn(),
    isWechatInstalled: jest.fn()
  },
  popup: jest.fn()
};

export {};
