# 启动项目

本地开发时的环境变量都定义在`.env.local`文件夹中，启动项目 `pnpm start` 即可，如需切换环境，请直接修改 `.env.local` 文件即可

示例：

```
ENV_NAME=dev | fat
```

# 功能模块

路由在 `src/routes/config.tsx` 中集中配置，页面均为 **懒加载**。以下模块为当前仓库中的主要功能；多数列表/详情在无后端时使用 **mock 数据**，接入接口时可按各模块内注释替换。

**后端 / 数据库设计**：按页面整理的 **接口说明与数据格式** 见目录 [`docs/pages/`](./docs/pages/README.md)（含各路由独立 Markdown）。

| 路由 | 目录 | 说明 |
| --- | --- | --- |
| `/`、`/home` | `src/pages/Home` | 个人站点首页：顶栏、Hero、最新文章、推荐工具、生活切片、页脚；白底黑字简约风格 |
| `/blog` | `src/pages/blog/BlogList` | 文章列表：封面、标题、摘要、分类、标签、作者、阅读/点赞/评论、分页（`?page=`） |
| `/blog/:id` | `src/pages/blog/BlogDetail` | 文章详情：Markdown 正文（`react-markdown` + `remark-gfm`）、阅读量等、上一篇/下一篇 |
| `/life` | `src/pages/Life` | 生活记录：按年月归档、时间轴 + 图文卡片流 |
| `/toolkit` | `src/pages/Toolkit` | 工具库：分类筛选、关键词搜索、卡片 Grid；卡片为深色渐变（按工具 id 稳定映射） |
| `/editor` | `src/pages/Editor` | AI 视频分镜编辑：时间轴与分镜数据（接口轮询等，见页面实现） |
| `/chat-api` | `src/pages/ChatApi` | Chat / API 联调演示页（注意勿在前端硬编码密钥） |
| `*` | `src/pages/NotFount` | 404 未找到 |

**公共布局与资源**

- 顶栏组件：`src/pages/Home/components/HomeHeader`（首页 / 文章 / 工具 / 生活导航与高亮）
- 页脚组件：`src/pages/Home/components/HomeFooter`
- 首页主题变量：`src/pages/Home/styles/variables.less`（多处页面样式复用）

**技术栈提示**

- 框架：React 18 + TypeScript + Vite；路由：`react-router-dom`
- 博客正文：Markdown 渲染依赖 `react-markdown`、`remark-gfm`
- 样式：各页面以 `index.module.less` 为主（CSS Modules + Less 嵌套）；未使用 Tailwind

# 编码

1. src/components 公共组件 例：Button、下拉刷新
2. src/modules 与业务相关的公共模块 例：
3. src/services/common 与请求接口相关的公共方法
4. src/lib 工具

```jsx
public // 静态文件
envs // 本地开发环境变量配置
├── .env
├── .env.dev
├── .env.fat
src/
├── assets/                  // 静态资源
│   ├── images/              // 图片资源
├── style/                   // 全局样式
│   └── global.less          // 全局样式
├── components/              // 通用组件
├── pages/                   // 功能模块(按业务划分)
│   ├── product/             // 产品模块
│   ├── order/               // 订单模块
│   └── ...                  // 其他业务模块
│
├── hooks/                   // 自定义hooks
├── lib/                     // 第三方库封装/工具函数
├── modules/                 // 与业务逻辑关联的模块
├── routes/                  // 路由配置
├── services/                // API服务层
│   ├── api/                 // API请求封装
│   ├── config.ts            // 各种服务配置
│   ├── common.ts            // 获取请求参数的通用方法（区别于 lib & modules）
│   └── models/              // 数据类型定义
│
├── App.tsx                  // 主应用组件
├── main.tsx                 // 应用入口
└── vite-env.d.ts            // Vite环境ts定义
```

## 全局对象 JJ

`JJ` 对象中存储了一些全局变量

注意：由于vite在开发阶段会使用ESM对代码进行静态解析，因此在顶层代码使用`JJ`时，`JJ`可能还未完成初始化，因此会获取不到`JJ`的值，所以请在函数内部使用它。

```js
import React from 'react';

// 这里无法获取到JJ
console.log(JJ);

export default () => {
  // 在函数内部才能获取到JJ
  console.log(JJ);
  return <div>JJ</div>;
};
```

当需要在顶层使用时，请勿直接使用`JJ`全局对象，应手动导入`JJ`上挂载的对象，`JJ`上挂载的对象都会在`@/lib/index.ts`中进行导出，效果与直接使用`JJ`全局对象一致。

```js
import React from 'react';

// 在顶层使用需手动导入
import { Os, request, navigate, Utils } from '@/lib/index';

console.log(Os, request, navigate, Utils);

export default () => {
  // 在函数内部依然使用JJ全局变量
  console.log(JJ.request, JJ.navigate, JJ.Utils);

  return <div>JJ</div>;
};
```

### Os

Os 对象中存储了一些设备信息，详细信息请看 `@lib/os/index.js`

```js
JJ.OS.debug; // 是否是调试环境
JJ.OS.xcx; // 是否是小程序
JJ.OS.wechat; // 是否是微信环境
JJ.OS.wechatBrowser; // 是否是微信浏览器
JJ.OS.ali; // 是否是支付宝
JJ.OS.dingding; // 是否是钉钉
```

### Utils

Utils 对象中存储了一些工具函数，详细信息请看 `@lib/utils/index.ts`

```js
JJ.Utils.getQueryString(); // 获取url参数
```

### navigate

navigate 函数用于跳转到指定的页面，详细信息请看 `@lib/navigate/index.ts`

```js
JJ.navigate('/home/index');
```

### request

request 函数用于发送请求，详细信息请看 `@lib/request/index.ts`

```js
JJ.request('/api/test', { method: 'GET' });
```

### loading

loading 是对 antd-mobile toast 的封装，配置项与 antd-mobile toast 一致，详细信息请看 `@lib/loading/index.ts`

```js
JJ.loading.show({ content: '加载中...' });
JJ.loading.close();
```

### toast

toast 是对 antd-mobile toast 的封装，配置项与 antd-mobile toast 一致，详细信息请看 `@lib/toast/index.ts`

```js
JJ.toast.show({ content: '请求中' });
JJ.toast.error({ content: '请求失败' });

JJ.toast.success({
  content: '请求成功',
  afterClose: () => {
    console.log('toast关闭回调');
  }
});

JJ.toast.close();
```

### popup

```js
JJ.popup(<div>1111</div>, {
  bodyStyle: {}
});
```

### bridge

```js
JJ.bridge.userInfo();
```
