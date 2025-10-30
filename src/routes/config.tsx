import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// 懒加载页面
const App = lazy(() => import('@/App'));
const Home = lazy(() => import('@/pages/Home'));
const Detail = lazy(() => import('@/pages/item/Detail'));
const Coupon = lazy(() => import('@/pages/coupon/Coupon'));
const Rules = lazy(() => import('@/pages/coupon/Rules'));
const DeliveryDetail = lazy(() => import('@/pages/delivery/Detail'));
const CreateOrder = lazy(() => import('@/pages/order/Create'));
const RightsProtection = lazy(() => import('@/pages/rightsProtection/index'));
const RightsProtectionDetail = lazy(() => import('@/pages/rightsProtection/detail'));

const NotFound = lazy(() => import('@/pages/NotFount'));
export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'home', element: <Home /> },
      { path: '/item/detail/:linkCode', element: <Detail /> },
      { path: '/order/create', element: <CreateOrder /> },
      {
        path: 'coupon',
        children: [
          { index: true, element: <Navigate to='index' replace /> },
          { path: 'index', element: <Coupon /> },
          { path: 'rules', element: <Rules /> }
        ]
      },
      { path: '/delivery/detail', element: <DeliveryDetail /> },
      {
        path: '/rightsProtection',
        children: [
          { path: ':orderId', element: <RightsProtection /> }, // 权益保障页面,
          { path: 'detail/:orderId', element: <RightsProtectionDetail /> }, // 权益升级页面,
          { index: true, element: <NotFound /> }
        ]
      },
      { path: '*', element: <NotFound /> }
    ]
  }
];
