import SentryConfig from '@woulsl/sentry-config';

const envName = window.process.env.ENV_NAME;
const getSentryDNS = () => {
  if (JOJO.Os.matrix) {
    // 矩阵不需要上报sentry
    return '';
  } else {
    return 'https://40fee53cddfb46d384fd26e0bfb45c9a@sentry.tinman.cn/36';
  }
};

export const initSentry = () => {
  SentryConfig({
    dsn: getSentryDNS(),
    // 错误采样率，B端项目建议为1，C端项目可以不配置（默认为0.5）
    sampleRate: 0.5,
    // 请求采样率，B端项目建议为1，C端项目可以不配置（默认为0.5）
    tracesSampleRate: 0.5,
    environment: envName as any
  });
};
