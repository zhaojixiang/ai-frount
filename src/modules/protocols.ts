enum AgreementKeyEnum {
  AutoRenewableSubscription = 'autoRenewableSubscription',
  UserPurchaseAgreement = 'userPurchaseAgreement',
  UserServiceAgreement = 'userServiceAgreement'
}

type ParamsType = {
  appKey: string;
  channel: string;
  platform: string;
  appVersion: string;
};
/**
 * 获取自动续费协议链接 (目前只在叫叫APP中使用，其他都走兜底逻辑，如有其他APP使用， 需要修改获取协议参数)
 * @param agreementKey 协议key
 * @param minVersion 最低版本
 * @param params 兜底参数
 * @param useDefault 是否直接使用兜底参数
 */
const getProtocolsLink = async (
  agreementKey: AgreementKeyEnum,
  minVersion: string,
  params: ParamsType,
  useDefault: boolean = false
) => {
  let innerParams = { ...params };
  if (JOJO.Os.app && !useDefault) {
    try {
      // 叫叫App中
      const appInfo = await JOJO.bridge.appInfo();
      const {
        data: { bundleID, version }
      } = appInfo || {};

      const res = await JOJO.bridge.call('getDeviceInfo');
      const { data } = res || {};
      // IOS
      if (data?.deviceOS === 'iOS' && JOJO.Utils.isHigerVersion(minVersion, version)) {
        const { platform } = data;
        if (bundleID === 'com.shusheng.JoJoRead' || bundleID === 'dev.shusheng.JoJoRead') {
          innerParams.appKey = 'D04JBD';
          innerParams = { ...innerParams, channel: 'appstore', platform, appVersion: version };
        }
      }
      // 安卓
      if (data?.deviceOS === 'Android' && JOJO.Utils.isHigerVersion(minVersion, version)) {
        if (bundleID === 'com.shusheng.JoJoRead') {
          innerParams.appKey = 'D04JBD';
          innerParams = {
            ...innerParams,
            channel: 'tinman',
            platform: 'adr',
            appVersion: version
          };
        }
      }
    } catch (error) {
      console.log('bridge ready error', error);
    }
  }
  return `https://jojosz.tinman.cn/market/agreement?agreementKey=${agreementKey}&appChannel=${innerParams?.channel}&appKey=${innerParams?.appKey}&appVersion=${innerParams?.appVersion}&platform=${innerParams?.platform}`;
};

/**
 * 获取自动续费协议链接
 * @returns string
 */
export const getSubscribeProtocoLink = async () => {
  // 兜底链接
  let url = '';
  if (JOJO.Os.jojo) {
    url = `https://jojosz.tinman.cn/market/agreement?agreementKey=autoRenewableSubscription&appChannel=tinman&appKey=AH9WFZMIWI0&appVersion=1.0.0&platform=adr`;
  } else if (JOJO.Os.matrix) {
    // 矩阵H5兜底协议
    url =
      'https://jojosz.tinman.cn/market/agreement?agreementKey=autoRenewableSubscription&appChannel=tinman&appKey=UI8A9C&appVersion=2.77.0&platform=adr';
  }

  if (JOJO.Os.app && canUseBridge) {
    try {
      const res = await JOJO.bridge.call('getDeviceInfo');
      const { data } = res || {};
      const { deviceOS } = data || {};

      if (JOJO.Os.jojo) {
        if (deviceOS === 'iOS') {
          url =
            'https://jojosz.tinman.cn/market/agreement?agreementKey=autoRenewableSubscription&appChannel=appstore&appKey=D04JBD&appVersion=1.68.1&platform=ios';
        }
        if (deviceOS === 'Android') {
          url =
            'https://jojosz.tinman.cn/market/agreement?agreementKey=autoRenewableSubscription&appChannel=tinman&appKey=D04JBD&appVersion=1.68.1&platform=adr';
        }
      }
      if (JOJO.Os.matrix) {
        url =
          'https://jojosz.tinman.cn/market/agreement?agreementKey=autoRenewableSubscription&appChannel=tinman&appKey=UI8A9C&appVersion=2.77.0&platform=adr';
      }
    } catch (error) {
      console.log('bridge ready error', error);
    }
  }
  return url;
};

/**
 * 获取用户购买协议链接
 * @returns string
 */
export const getUserPurchaseProtocoLink = async () => {
  const params = {
    appKey: 'D04JBD',
    channel: 'tinman',
    platform: 'adr',
    appVersion: '1.78.0'
  };
  return await getProtocolsLink(AgreementKeyEnum.UserPurchaseAgreement, '1.78.0', params);
};

/**
 * 获取用户服务协议链接
 * @returns string
 */
export const getUserServiceProtocoLink = async () => {
  // 兜底链接
  let url = '';
  if (JOJO.Os.jojoup) {
    url =
      'https://pages.mohezi.cn/sherlock/market/agreement?agreementKey=userServiceAgreement&appChannel=tinman&appKey=ASAFVV8E5UZ&appVersion=1.0.0&platform=adr';
  } else if (JOJO.Os.jojo) {
    url = 'https://jojosz.tinman.cn/market/policyConfig/?ct=userServiceAgreement&ak=xueyuan&p=adr';
  } else if (JOJO.Os.matrix) {
    // 矩阵H5兜底协议
    url =
      'https://jojosz.tinman.cn/market/agreement?agreementKey=userServiceAgreement&appChannel=tinman&appKey=UI8A9C&appVersion=2.77.0&platform=adr';
  }

  if (JOJO.Os.app && JOJO.bridge.canUseBridge()) {
    const isHM = await JOJO.Utils.isJoJoReadAppForHM();
    try {
      const res = await JOJO.bridge.call('getDeviceInfo');
      const { data } = res || {};
      const { deviceOS } = data || {};

      const appInfo = await JOJO.bridge.appInfo();
      const {
        data: { version }
      } = appInfo || {};

      if (JOJO.Os.jojoup) {
        if (deviceOS === 'iOS') {
          url =
            'https://pages.mohezi.cn/sherlock/market/agreement?agreementKey=userServiceAgreement&appChannel=appstore&appKey=ASAFVV8E5UZ&appVersion=1.0.0&platform=ios';
        }
        if (deviceOS === 'Android') {
          url =
            'https://pages.mohezi.cn/sherlock/market/agreement?agreementKey=userServiceAgreement&appChannel=tinman&appKey=ASAFVV8E5UZ&appVersion=1.0.0&platform=adr';
        }
      }
      if (JOJO.Os.jojo) {
        if (deviceOS === 'iOS') {
          url =
            'https://jojosz.tinman.cn/market/policyConfig/?ct=userServiceAgreement&ak=xueyuan&p=ios_hg';
        }
        if (deviceOS === 'Android') {
          url =
            'https://jojosz.tinman.cn/market/policyConfig/?ct=userServiceAgreement&ak=xueyuan&p=adr';
        }
        if (isHM) {
          url = `https://jojosz.tinman.cn/market/agreement?agreementKey=userServiceAgreement&appChannel=huawei&appKey=D04JBD&appVersion=${version}&platform=Harmony`;
        }
      }
      // 矩阵协议未区分安卓和ios
      if (JOJO.Os.matrix) {
        url =
          'https://jojosz.tinman.cn/market/agreement?agreementKey=userServiceAgreement&appChannel=tinman&appKey=UI8A9C&appVersion=2.77.0&platform=adr';
      }
    } catch (error) {
      console.log('bridge ready error', error);
    }
  }
  return url;
};
