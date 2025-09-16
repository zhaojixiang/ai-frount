import { Toast } from 'antd-mobile';
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

import { serviceUrl } from '@/services/config';

import { isLogin } from '../../modules/auth';
import Os from '../os';
import whiteApi from './whiteApi';

const TIMEOUT = 10000;

const userId = localStorage.getItem('userId');

// 模拟调试header信息，跳过授权检测
export const DEBUG_HEADER_INFO = Os.debug
  ? {
      'X-UAGW-userId': userId,
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
    if (!isLogin() && !whiteApi.includes(config.url || '')) {
      Toast.show({ icon: 'fail', content: '请先登录' });
      return Promise.reject(new Error('未登录或登录已过期'));
    }

    return config;
  },
  (error) => {
    Toast.show({ icon: 'fail', content: '请求发送失败' });
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { resultCode, errorMsg } = response.data;

    // 请求成功
    if (resultCode === 200) {
      return response.data;
    }

    // 未登录
    if ([1001, 1005].includes(resultCode)) {
      Toast.show({ icon: 'fail', content: errorMsg || '未登录' });
      return Promise.reject(new Error(errorMsg || '未登录'));
    }

    // 需获取openId
    if ([1002].includes(resultCode)) {
      Toast.show({ icon: 'fail', content: errorMsg || '需要获取openId' });
      // const redirectUrl = toAuthrize({
      //   appId: data.authWechatAppId,
      //   mode: 3,
      //   wechatAuthType: 2
      // });
      // window.location.replace(redirectUrl);
      return Promise.reject(new Error(errorMsg || '需要获取openId'));
    }
    return Promise.reject(response.data);
  },
  (error) => {
    Toast.show({ icon: 'fail', content: error.message || '网络错误' });
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
