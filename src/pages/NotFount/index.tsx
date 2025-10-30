import Error from '@/assets/images/jojo/rightsProtection/error.png';

import styles from './index.module.less';

const ErrorPage = () => {
  return (
    <div className={styles['error-page']}>
      <div className={styles['error-content']}>
        <img src={Error} alt='' className={styles['error-img']} />
        <div className={styles['error-text']}>{'页面未找到'}</div>
      </div>
    </div>
  );
};

export default ErrorPage;
