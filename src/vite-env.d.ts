/// <reference types="vite/client" />
import { type ToastShowProps } from 'antd-mobile';
import { type AxiosRequestConfig } from 'axios';

import { type OS } from './lib/os/index.d';
import { type ShowPageConfig } from './lib/showPage';
import { type Utils } from './lib/utils/index.d';

declare global {
  type ToastType = {
    show: (options: ToastShowProps) => void;
    error: (options: ToastShowProps) => void;
    success: (options: ToastShowProps) => void;
    close: () => void;
  };
  type LoadingType = {
    show: (options?: ToastShowProps) => void;
    close: () => void;
  };
  interface JOJOTYPE {
    Os: OS;
    loading: LoadingType;
    Utils: Utils;
    request: <T = any>(params: any, config?: AxiosRequestConfig) => Promise<T>;
    showPage: (url: string, { to, mode = 'navigate', params = {} }?: ShowPageConfig) => void;
    toast: ToastType;
    bridge: any;
    popup: (content: React.ReactNode, options?: FullScreenPopupOptions) => { destroy: () => void };
  }
  /**
   * jojo
   */
  const JOJO: JOJOTYPE;
  interface Window {
    JOJO: JOJOTYPE;
    sensors: any;
    sensorsExpoSure: any;
    forceWebGL: boolean;
    _AMapSecurityConfig: any;
  }
}

declare module 'postcss-px-to-viewport';

declare module '@woulsl/storage' {
  interface StorageAPI {
    get: (key: string) => any;
    set: (key: string, value: any) => void;
    remove: (key: string) => void;
    clear: () => void;
  }

  const storage: StorageAPI;
  export default storage;
}

declare module '@woulsl/storage/session' {
  interface SessionStorageAPI {
    get: (key: string) => any;
    set: (key: string, value: any) => void;
    remove: (key: string) => void;
    clear: () => void;
  }

  const session: SessionStorageAPI;
  export default session;
}
