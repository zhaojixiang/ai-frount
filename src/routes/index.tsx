import { createBrowserRouter, Navigate } from 'react-router-dom';

import App from '../App';
import Home from '../pages/Home';

console.log('import.meta.env：', import.meta.env);

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          index: true,
          element: <Navigate to='/home' replace />
        },
        {
          path: 'home',
          element: <Home />
        }
        // 可以添加更多子路由
      ]
    }
  ],
  {
    // basename: import.meta.env.VITE_ENV_BASE
    basename: '/velocity'
  }
);

export default router;
