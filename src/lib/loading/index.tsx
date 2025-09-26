import type { ToastShowProps } from 'antd-mobile';
import { Toast } from 'antd-mobile';

import S from './index.module.less';

class Loading {
  private toastHandler: (() => void) | null = null;

  show(options?: ToastShowProps) {
    this.close();
    this.toastHandler = Toast.show({
      content: '加载中...',
      duration: 0, // 不自动关闭
      maskClickable: false, // 防止点击穿透
      maskClassName: 'loadingMask',
      maskStyle: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
      ...options,
      icon: <div className={S.loadingIcon} />
    }).close;
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
