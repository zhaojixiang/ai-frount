import sensors from '@woulsl-tools/sensors';

export const initSensors = () => {
  if (JOJO.Os.debug) {
    return;
  }
  let platform = '其他';
  const envName = window.process.env.ENV_NAME;

  if (JOJO.Os.xcx) {
    platform = '微信小程序';
  } else if (JOJO.Os.wechatBrowser) {
    platform = '微信内';
  } else if (JOJO.Os.app) {
    platform = 'APP内';
  }

  let server_url = '';
  if (envName === 'pro') {
    if (JOJO.Os.jojoup) {
      server_url = 'https://sensors.tinman.cn/sa?project=jojoup';
    } else if (JOJO.Os.matrix) {
      server_url = 'https://sensors.tinman.cn/sa?project=jojo_matrix';
    } else {
      server_url = 'https://sensors.tinman.cn/sa?project=production';
    }
  } else {
    server_url = 'https://sensors.tinman.cn/sa?project=default';
  }

  // 注册sensors
  sensors.tinmanSensorsInit({
    lob: 'mall',
    env_name: envName || '',
    // show_log: "<%= context.ENV_DEBUG %>",
    show_log: false,
    server_url, // 可手动配置神策服务地址，需区分环境
    autoTrackSet() {
      sensors.quick('isReady', function () {
        // 注册公共属性
        const registerParams = {
          custom_platform: platform
        };

        sensors.registerPage(registerParams);
      });
      // 配置自动上报
      // const isAutoTrackPath = [].indexOf(window.location.pathname) > -1;
      // if (isAutoTrackPath) {
      // 	return false;
      // }
      return true;
    }
  });

  window.sensors = sensors;
};
