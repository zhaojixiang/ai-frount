/// <reference types="vite/client" />

import { type ToastShowProps } from 'antd-mobile';
import { type AxiosRequestConfig } from 'axios';

import { type NavigatorConfig } from './lib/navigate';
import { type OS } from './lib/os/index.d';
import { type Utils } from './lib/utils/index.d';

interface ImportMetaEnv {
  readonly ENV_BASE?: string;
  readonly ENV_NAME?: string;
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 扩展 Axios 类型
declare module 'axios' {
  export interface InternalAxiosRequestConfig extends AxiosRequestConfig {
    handleResultCode?: boolean;
  }
}

declare global {
  type ToastType = {
    show: (options: ToastShowProps) => void;
    close: () => void;
  };
  type LoadingType = {
    show: (options?: ToastShowProps) => void;
    close: () => void;
  };
  type PopupType = {
    (content: React.ReactNode, options?: FullScreenPopupOptions): { destroy: () => void };
    confirm: (options: PopupConfirmOptions) => { destroy: () => void };
  };
  interface JJTYPE {
    Os: OS;
    loading: LoadingType;
    Utils: Utils;
    request: <T = any>(params: any, config?: AxiosRequestConfig) => Promise<T>;
    navigate: (url: string, { to, mode = 'navigate', params = {} }?: NavigatorConfig) => void;
    toast: ToastType;
    bridge: any;
    popup: PopupType;
  }
  /**
   * JJ
   */
  const JJ: JJTYPE;
  interface Window {
    JJ: JJTYPE;
    sensors: any;
    sensorsExpoSure: any;
    forceWebGL: boolean;
    _AMapSecurityConfig: any;
  }
}

declare module 'postcss-px-to-viewport';
