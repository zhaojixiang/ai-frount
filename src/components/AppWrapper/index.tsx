import React, { useEffect, useState } from 'react';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState(1);
  const isPC = () => {
    // 1. 用户代理(UA)检测
    const ua = navigator.userAgent.toLowerCase();
    const mobileAgents = [
      'android',
      'iphone',
      'ipod',
      'ipad',
      'windows phone',
      'blackberry',
      'webos',
      'iemobile',
      'opera mini',
      'mobile'
    ];
    const isMobileUA = mobileAgents.some((agent) => ua.includes(agent));

    // 2. 屏幕尺寸 & 触摸支持检测
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // 3. 综合判断（非移动UA + 无触摸）
    return !isMobileUA && !hasTouchScreen;
  };

  useEffect(() => {
    const baseWidth = 375;
    const calcScale = () => {
      // console.log(11112, window.innerWidth);
      // const s = window.innerWidth / baseWidth;
      if (window.innerWidth > baseWidth) {
        // 这里需要计算一个缩小倍数，缩小到768px，例如 window.innerWidth 是 baseWidth 的两倍， 那么缩小倍数就是 0.5
        const s = window.innerWidth / baseWidth;
        setScale(1 / s);
        return;
      }
      const s = window.innerWidth / baseWidth;
      setScale(s > 1 ? 1 : s); // 不放大，只缩小
    };
    calcScale();
    window.addEventListener('resize', calcScale);
    return () => window.removeEventListener('resize', calcScale);
  }, []);

  return (
    <div
      className='simulator-content'
      style={
        isPC()
          ? {
              transform: `scale(${scale})`,
              transformOrigin: 'top center'
              // height: '200%'
            }
          : {}
      }>
      {children}
    </div>
  );
}
