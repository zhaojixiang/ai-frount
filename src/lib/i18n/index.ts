import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入语言资源
import en from '@/locales/en-US';
import zh from '@/locales/zh-CN';

// 配置i18n
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh }
  },
  lng: 'zh', // 默认语言
  fallbackLng: 'zh', // 回退语言
  interpolation: {
    escapeValue: false // React已经防止XSS
  }
});

export default i18n;
