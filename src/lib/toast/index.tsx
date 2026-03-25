import type { ToastShowProps } from 'antd-mobile';
import { Toast } from 'antd-mobile';

class ToastWrapper {
  private toastHandler: (() => void) | null = null;

  show(options: ToastShowProps) {
    if (options.icon === 'loading') {
      console.error('loading: 请使用JJ.loading.show() 替换 JJ.toast.show()');
      return;
    }
    // 如果有未关闭的 toast，先关闭
    this.close();

    this.toastHandler = Toast.show({
      ...options
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
