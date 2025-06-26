import { initReactI18next } from 'react-i18next';

import { l10n } from '@jojo-design/fc';
import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import chainedBackend from 'i18next-chained-backend';
// import httpBackend from 'i18next-http-backend';
import resourcesToBackend from 'i18next-resources-to-backend';

/**
 * `l10n`和`i18next-browser-languagedetector`的参数保持一致
 */
const detectorConf = {
  detection: {
    lookupLocalStorage: 'hl'
  }
};

i18n
  .use(initReactI18next) // 将 i18n 向下传给 react-i18next
  .use(detector) // 默认语言自动检测
  .use(chainedBackend) // 链式后端
  .init({
    compatibilityJSON: 'v3',
    returnObjects: false,
    ...detectorConf,
    fallbackLng: 'zh-CN', // 默认语言
    // fallbackLng: 'en-US', // 默认语言
    load: 'currentOnly', // 语言定义策略：只加载 zh-CN ，而不加载 zh
    ns: 'mall', // 命名空间（appKey）
    backend: {
      backends: [
        // 优先三方加载
        // httpBackend,
        // 其次加载本地
        resourcesToBackend((language, _, callback) => {
          /**
           * 需要修改为本地语言包路径
           * 为了与目前 umi 更好兼容，可就以 umi 的国际化语言包格式
           * 那么，路径即：`@/locales/${language}.ts`
           */
          import(`../locales/${language}/index.ts`)
            .then((resources) => {
              callback(null, resources.default);
            })
            .catch((error) => callback(error, null));
        })
      ]
      // backendOptions: [
      //   {
      //     /*
      //      * 三方加载 url(可任意)
      //      * 建议为此规则【xxx/locales/{{lng}}/{{ns}}.json】
      //      * eg: xxx/locales/zh-CN/bs-ds.json
      //      */
      //     // loadPath: 'http://localhost:8080/locales/{{lng}}/{{ns}}.json'
      //   }
      // ]
    }
  });

//
l10n.L10n.init(detectorConf);

export default i18n;
