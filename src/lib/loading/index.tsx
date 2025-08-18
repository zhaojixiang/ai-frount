import type { ToastShowProps } from 'antd-mobile';
import { Toast } from 'antd-mobile';

class Loading {
  private toastHandler: (() => void) | null = null;

  open(options?: ToastShowProps) {
    // 如果已经有一个 loading，先关闭它
    this.close();

    this.toastHandler = Toast.show({
      icon: 'loading',
      content: '加载中...',
      duration: 0, // 不自动关闭
      maskClickable: false, // 防止点击穿透
      ...options
    }).close; // 保存关闭方法
  }

  close() {
    if (this.toastHandler) {
      this.toastHandler();
      this.toastHandler = null;
    }
  }
}

const loadingInstance = new Loading();

export default loadingInstance;
