import { createBrowserRouter, Navigate } from 'react-router-dom';

import App from '../App';
import Coupon from '../pages/coupon/Coupon';
import Rules from '../pages/coupon/Rules';
import DeliveryDetail from '../pages/delivery/Detail';
import Home from '../pages/Home';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          index: true,
          element: <Navigate to='/coupon' replace />
        },
        {
          path: 'home',
          element: <Home />
        },
        {
          path: 'coupon',
          children: [
            {
              index: true,
              element: <Navigate to='index' replace />
            },
            {
              path: 'index',
              element: <Coupon />
            },
            {
              path: 'rules',
              element: <Rules />
            }
          ]
        },
        {
          path: 'delivery',
          children: [
            {
              path: 'detail',
              element: <DeliveryDetail />
            }
          ]
        }
        // 可以添加更多子路由
      ]
    }
  ],
  {
    basename: import.meta.env.VITE_ENV_BASE
  }
);

export default router;
