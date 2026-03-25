import { Empty } from 'antd';

import styles from './index.module.less';

const ErrorPage = () => {
  return (
    <div className={styles['error-page']}>
      <div className={styles['error-content']}>
        <Empty description='页面未找到' />
      </div>
    </div>
  );
};

export default ErrorPage;
