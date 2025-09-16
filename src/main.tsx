import './index.less';
import './lib/i18n';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { initJOJO } from '@/lib/initJOJO';
import { setupFavicon } from '@/lib/utils';

import AppWrapper from './components/AppWrapper';
import { initDebugger } from './lib/debugger';
import { initSensors } from './lib/sensors';
import { initSentry } from './lib/sentry';
import router from './routes';

const queryClient = new QueryClient();
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

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AppWrapper>
          <RouterProvider router={router} />
        </AppWrapper>
      </QueryClientProvider>
    </StrictMode>
  );
});
