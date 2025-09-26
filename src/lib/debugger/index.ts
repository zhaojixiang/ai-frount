import Cookies from 'js-cookie';
import qs from 'query-string';

import { debuggerList } from './whiteList';

/**
 *  初始化调试工具
 */
export const initDebugger = () => {
  const userId: any = Cookies.get('userId');
  const query = qs.parse(window.location.search);
  if (
    ['dev', 'fat', 'uat'].includes(window.process.env.ENV_NAME) ||
    (window.process.env.ENV_NAME === 'pro' &&
      query.debug === 'true' &&
      debuggerList.includes(userId))
  ) {
    import('eruda').then((eruda) => eruda.default.init());
  }
};
