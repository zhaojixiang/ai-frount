# 启动项目

本地开发时的环境变量都定义在`.env.local`文件夹中，启动项目 `pnpm start` 即可，如需切换环境，请直接修改 `.env.local` 文件即可

示例：

```
ENV_NAME=dev | fat
APP_NAME=jojo | jojoup | matrix
```

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
│		│   ├── jojo/            // jojo图片资源
│		│   └── jojoup/          // jojoup图片资源
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

## 全局对象 JOJO

`JOJO` 对象中存储了一些全局变量

注意：由于vite在开发阶段会使用ESM对代码进行静态解析，因此在顶层代码使用`JOJO`时，`JOJO`可能还未完成初始化，因此会获取不到`JOJO`的值，所以请在函数内部使用它。

```js
import React from 'react';

// 这里无法获取到JOJO
console.log(JOJO);

export default () => {
  // 在函数内部才能获取到JOJO
  console.log(JOJO);
  return <div>JOJO</div>;
};
```

当需要在顶层使用时，请勿直接使用`JOJO`全局对象，应手动导入`JOJO`上挂载的对象，`JOJO`上挂载的对象都会在`@/lib/jojo`中进行导出，效果与直接使用`JOJO`全局对象一致。

```js
import React from 'react';

// 在顶层使用需手动导入
import { Os, request, showPage, Utils } from '@/lib/jojo';

console.log(Os, request, showPage, Utils);

export default () => {
  // 在函数内部依然使用JOJO全局变量
  console.log(JOJO.Os.jojoup, JOJO.request, JOJO.showPage, JOJO.Utils);

  return <div>JOJO</div>;
};
```

### Os

Os 对象中存储了一些设备信息，详细信息请看 `@lib/os/index.js`

```js
JOJO.OS.jojoup; // 是否是jojoup环境
```

### Utils

Utils 对象中存储了一些工具函数，详细信息请看 `@lib/utils/index.ts`

```js
JOJO.Utils.getQueryString(); // 获取url参数
```

### showPage

showPage 函数用于跳转到指定的页面，详细信息请看 `@lib/showPage/index.ts`

```js
JOJO.showPage('/home/index');
```

### request

request 函数用于发送请求，详细信息请看 `@lib/request/index.ts`

```js
JOJO.request('/api/test', { method: 'GET' });
```

### loading

loading 是对 antd-mobile toast 的封装，配置项与 antd-mobile toast 一致，详细信息请看 `@lib/loading/index.ts`

```js
JOJO.loading.show({ content: '加载中...' });
JOJO.loading.close();
```

### toast

toast 是对 antd-mobile toast 的封装，配置项与 antd-mobile toast 一致，详细信息请看 `@lib/toast/index.ts`

```js
JOJO.toast.show({ content: '请求中' });
JOJO.toast.error({ content: '请求失败' });

JOJO.toast.success({
  content: '请求成功',
  afterClose: () => {
    console.log('toast关闭回调');
  }
});

JOJO.toast.close();
```

### popup

```js
JOJO.popup.show(<div>1111</div>, {
  bodyStyle: {}
});
```

### bridge

```js
JOJO.bridge.userInfo();
```
