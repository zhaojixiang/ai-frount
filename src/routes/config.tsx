import { lazy } from 'react';

// 懒加载页面
const App = lazy(() => import('@/App'));
const Home = lazy(() => import('@/pages/Home'));
const Life = lazy(() => import('@/pages/Life'));
const BlogList = lazy(() => import('@/pages/blog/BlogList'));
const BlogDetail = lazy(() => import('@/pages/blog/BlogDetail'));
const ChatApi = lazy(() => import('@/pages/ChatApi'));
const Editor = lazy(() => import('@/pages/Editor'));
const Toolkit = lazy(() => import('@/pages/Toolkit'));

const NotFound = lazy(() => import('@/pages/NotFount'));
export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      { path: 'home', element: <Home /> },
      { path: 'life', element: <Life /> },
      { path: 'blog', element: <BlogList /> },
      { path: 'blog/:id', element: <BlogDetail /> },
      { path: 'toolkit', element: <Toolkit /> },
      { path: 'chat-api', element: <ChatApi /> },
      { path: 'editor', element: <Editor /> },
      { path: '*', element: <NotFound /> }
    ]
  }
];
