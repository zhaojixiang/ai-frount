import { useEffect } from 'react';

import Error from '@/assets/images/jojo/rightsProtection/error.png';
import OverTime from '@/assets/images/jojo/rightsProtection/overtime.png';
import LoginBar from '@/components/LoginBar';
import { sensPageView } from '@/pages/rightsProtection/sensors';

import styles from './index.module.less';

const ErrorPage = (props: { visible: boolean; type: string; text: string }) => {
  const { type, text, visible } = props;
  useEffect(() => {
    if (visible) {
      sensPageView({
        $title: '异常页'
      });
    }
  }, [visible]);
  return (
    <div className={styles['error-page']}>
      <LoginBar isPopLogin={false} onLoginSuccess={() => window.location.reload()} />
      <div className={styles['error-content']}>
        <img src={type !== 'error' ? OverTime : Error} alt='' className={styles['error-img']} />
        <div className={styles['error-text']}>{text}</div>
      </div>
    </div>
  );
};

export default ErrorPage;
