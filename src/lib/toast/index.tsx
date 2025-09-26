import type { ToastShowProps } from 'antd-mobile';
import { Toast } from 'antd-mobile';

import S from './index.module.less';

class ToastWrapper {
  private toastHandler: (() => void) | null = null;

  show(options: ToastShowProps) {
    if (options.icon === 'loading') {
      console.error('loading: 请使用JOJO.loading.show() 替换 JOJO.toast.show()');
      return;
    }
    // 如果有未关闭的 toast，先关闭
    this.close();
    const iconOptions = {
      fail: <div className={S.failIcon} />,
      success: <div className={S.successIcon} />,
      warning: <div className={S.warningIcon} />
    };

    this.toastHandler = Toast.show({
      ...options,
      icon: ['fail', 'success', 'warning'].includes(options.icon as string)
        ? iconOptions[options.icon as keyof typeof iconOptions]
        : options.icon
    }).close;
  }

  close() {
    if (this.toastHandler) {
      this.toastHandler();
      this.toastHandler = null;
    }
  }
}

const toastInstance = new ToastWrapper();

export default toastInstance;
