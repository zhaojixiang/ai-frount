import { customError } from '@woulsl/sentry-config';
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

import {
  //  isLogin,
  jojoAppDirectLogin,
  toAuthrize
} from '@/modules/auth';
import { serviceUrl } from '@/services/config';

import { toast } from '../index';
import Os from '../os';
// import whiteApi from './whiteApi';

const TIMEOUT = 10000;

const userId = localStorage.getItem('userId');

// 模拟调试header信息，跳过授权检测
export const DEBUG_HEADER_INFO = Os.debug
  ? {
      'X-UAGW-userId': userId || '200051446',
      'X-UAGW-authMode': 1
    }
  : {};

const instance: AxiosInstance = axios.create({
  baseURL: serviceUrl.product, // 默认值 baseUrl
  timeout: TIMEOUT,
  method: 'get',
  withCredentials: true,
  headers: DEBUG_HEADER_INFO
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 未登录拦截
    // if (!isLogin() && !whiteApi.includes(config.url || '')) {
    //   toast.show({ icon: 'fail', content: '请先登录' });
    //   return Promise.reject(new Error('未登录或登录已过期'));
    // }

    return config;
  },
  (error) => {
    toast.show({ icon: 'fail', content: '请求发送失败' });
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  async (response: AxiosResponse) => {
    const { resultCode, code, errorMsg, status } = response.data;

    // 请求成功
    if (resultCode === 200 || code === 'SUCCESS') {
      return response.data;
    }
    // 当接口有返回但是我们服务端处理失败时，我们需要根据配置来判断是否展示错误提示，默认展示，
    // 可以在请求时配置 hideError: true 来隐藏错误提示
    // if (resultCode !== 200 && response.config?.hideError !== true) {
    //   toast.show({ icon: 'fail', content: errorMsg || '请求失败' });
    // }
    // 未登录
    if ([1001, 1005].includes(status)) {
      toast.show({ icon: 'fail', content: errorMsg || '未登录' });
      // 跨租户使用链接：在非jojoup app中使用jojo的链接
      const isCorssTenant = (Os.jojoReadApp && Os.jojoup) || (Os.jojoupApp && Os.jojo);
      if (Os.app && !isCorssTenant) {
        jojoAppDirectLogin();
        return response.data;
      }
      const redirectUrl: string = await toAuthrize({
        appId: response.data?.authWechatAppId,
        mode: 1,
        authBizType: 3
      });
      console.log('redirectUrl1', redirectUrl);

      window.location.replace(redirectUrl);
      return Promise.reject(new Error(errorMsg || '未登录'));
    }

    // 需获取openId
    if ([1002].includes(status)) {
      toast.show({ icon: 'fail', content: errorMsg || '需要获取openId' });
      const redirectUrl = await toAuthrize({
        appId: response.data?.authWechatAppId,
        mode: 3,
        wechatAuthType: 2
      });
      console.log('redirectUrl2', redirectUrl);

      window.location.replace(redirectUrl);
      return Promise.reject(new Error(errorMsg || '需要获取openId'));
    }

    return response.data;
  },
  (error) => {
    toast.show({ icon: 'fail', content: error.message || '网络错误' });
    customError({
      name: '接口请求失败',
      message: error.message,
      captureContext: {
        level: 'info',
        extra: {
          err: error
        }
      }
    });
    return Promise.reject(error);
  }
);

const request = <T = any>(
  dataOrParams: any, // 第一个参数：接口所需的参数
  config: AxiosRequestConfig = {} // 第二个参数：其他配置
): Promise<T> => {
  // 根据请求方法决定将参数放在 data 还是 params
  const method = config.method?.toLowerCase() || 'get';
  const finalConfig: AxiosRequestConfig = {
    ...config,
    [method === 'get' ? 'params' : 'data']: dataOrParams
  };

  return instance(finalConfig) as Promise<T>;
};

export default request;
