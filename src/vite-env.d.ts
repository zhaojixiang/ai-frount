/// <reference types="vite/client" />
import { type ToastShowProps } from 'antd-mobile';
import { type AxiosRequestConfig } from 'axios';

import { type OS } from './lib/os/index';
import { type ShowPageConfig } from './lib/showPage';

declare global {
  type ToastType = {
    show: (options: ToastShowProps) => void;
    error: (options: ToastShowProps) => void;
    success: (options: ToastShowProps) => void;
    close: () => void;
  };
  type LoadingType = {
    open: (options?: ToastShowProps) => void;
    close: () => void;
  };
  interface JOJOTYPE {
    Os: OS;
    loading: LoadingType;
    Utils: any;
    request: <T = any>(params: any, config?: AxiosRequestConfig) => Promise<T>;
    showPage: (url: string, { to, mode = 'navigate', params = {} }?: ShowPageConfig) => void;
    toast: ToastType;
  }
  /**
   * jojo
   */
  const JOJO: JOJOTYPE;
  interface Window {
    JOJO: JOJOTYPE;
    sensors: any;
    sensorsExpoSure: any;
  }
}

declare module 'postcss-px-to-viewport';
