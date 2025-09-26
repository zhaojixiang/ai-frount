import React, { useEffect, useState } from 'react';

import css from './index.module.less';

const ONE_SECONDS_MS = 1000;
const ONE_MINUTE_MS = 60 * ONE_SECONDS_MS;
const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;

let timer: any;
const Index: React.FC<any> = (props) => {
  const { endTime } = props;
  const [timeLeft, setTimeLeft] = useState<any>({
    deltaHours: 0,
    deltaMinutes: 0,
    deltaSeconds: 0
  });

  /**
   * 生成倒计时时间
   */
  const generateTime = () => {
    const dateTime = Date.now();
    const deltaTime = endTime - dateTime;

    const deltaHours = Math.floor(deltaTime / ONE_HOUR_MS);
    const deltaMinutes = Math.floor((deltaTime % ONE_HOUR_MS) / ONE_MINUTE_MS);
    const deltaSeconds = Math.floor(((deltaTime % ONE_HOUR_MS) % ONE_MINUTE_MS) / ONE_SECONDS_MS);

    return { deltaHours, deltaMinutes, deltaSeconds };
  };

  useEffect(() => {
    const func = () => {
      if (!endTime) return;

      const parsedTime = new Date(endTime).getTime();
      // 24小时
      if (parsedTime - Date.now() > 86400000) return;

      if (parsedTime - Date.now() < 0) {
        setTimeLeft({ deltaHours: 0, deltaMinutes: 0, deltaSeconds: 0 });
        return;
      }
      setInterval(() => setTimeLeft(generateTime()), 1000);
    };
    func();
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [endTime]);

  const parsedTime = new Date(endTime).getTime();
  if (parsedTime - Date.now() > 86400000) return null;

  const { deltaHours = 0, deltaMinutes = 0, deltaSeconds = 0 } = timeLeft;

  return (
    <div className={css.countDown}>
      <span>活动倒计时：</span>
      <span>
        {deltaHours >= 0 ? deltaHours : 0}:{deltaMinutes >= 0 ? deltaMinutes : 0}:
        {deltaSeconds >= 0 ? deltaSeconds : 0}
      </span>
    </div>
  );
};

export default Index;
