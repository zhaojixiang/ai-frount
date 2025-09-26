import type { CenterPopupProps } from 'antd-mobile';
import { CenterPopup } from 'antd-mobile';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

type FullScreenPopupOptions = CenterPopupProps & {
  animate?: boolean; // 是否需要动画（默认 true）
};

export default function showPopup(content: React.ReactNode, options?: FullScreenPopupOptions) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = ReactDOM.createRoot(div);

  let destroyFn: () => void;

  const PopupWrapper = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      if (options?.animate === false) {
        // 无动画场景：直接显示
        setVisible(true);
      } else {
        // 有动画场景：下一帧设为 true，触发动画
        requestAnimationFrame(() => setVisible(true));
      }
    }, []);

    destroyFn = () => {
      if (options?.animate === false) {
        // 无动画：立即卸载
        root.unmount();
        div.remove();
      } else {
        // 有动画：先关 visible，再等待动画完成
        setVisible(false);
        setTimeout(() => {
          root.unmount();
          div.remove();
        }, 300); // 300ms = antd-mobile 默认动画时长
      }
    };

    if (options?.animate === false) {
      // 🔹 无动画版本，直接 div 渲染
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#fff',
            zIndex: 1000,
            ...options?.bodyStyle
          }}>
          {content}
        </div>
      );
    }

    // 🔹 有动画版本，走 CenterPopup
    return (
      <CenterPopup
        visible={visible}
        onMaskClick={destroyFn}
        {...options}
        bodyStyle={{
          width: '100vw',
          height: '100vh',
          borderRadius: 0,
          margin: 0,
          ...options?.bodyStyle
        }}>
        {content}
      </CenterPopup>
    );
  };

  root.render(<PopupWrapper />);

  return { destroy: () => destroyFn?.() };
}
