import './index.less';
import './lib/i18n';

import jojoAccount from '@jojo/account-sdk';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { initJOJO } from '@/lib/initJOJO';
import { setupFavicon } from '@/lib/utils';

import AppWrapper from './components/AppWrapper';
import { initDebugger } from './lib/debugger';
import { initSensors } from './lib/sensors';
import { initSentry } from './lib/sentry';
import router from './routes';
import { JOJO_READ_BASE_URL, SERVICE_URL_PREFIX, UC_API_URL_BASE } from './services/config';

// 注册全局变量 JOJO
initJOJO().then(() => {
  // 初始化Sentry
  initSentry();

  // 初始化神策
  initSensors();

  // 初始化调试工具
  initDebugger();

  // 设置favicon
  setupFavicon();

  // 初始化jojoAccount sdk
  jojoAccount.config({
    envName: window.process.env.ENV_NAME, // 测试环境
    hosts: {
      ucHost: UC_API_URL_BASE,
      serverHost: JOJO_READ_BASE_URL,
      apiHost: SERVICE_URL_PREFIX
    }
  });

  // 设置高德地图
  // 强制使用webGL
  window.forceWebGL = true;
  // 设置高德安全密钥
  window._AMapSecurityConfig = {
    serviceHost: window.location.origin + '/_AMapService'
  };

  createRoot(document.getElementById('root')!).render(
    <AppWrapper>
      <RouterProvider router={router} />
    </AppWrapper>
  );
});
