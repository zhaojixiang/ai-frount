import { createBrowserRouter } from 'react-router-dom';

import { routes } from './config';
import { withSuspense } from './withSuspense';

// 递归给所有 route.element 包裹 Suspense
function wrapRoutes(routeList: any[]): any {
  return routeList.map((route) => ({
    ...route,
    element: route.element ? withSuspense(route.element) : undefined,
    children: route.children ? wrapRoutes(route.children) : undefined
  }));
}

const router = createBrowserRouter(wrapRoutes(routes), {
  basename: window.process.env.ENV_BASE
});

export default router;
