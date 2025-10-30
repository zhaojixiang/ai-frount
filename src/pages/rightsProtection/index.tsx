import { Button } from 'antd-mobile';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import FixBottom from '@/components/FixBottom';
import LoginBar from '@/components/LoginBar';
import StateHandler, { LoadStatus } from '@/components/StateHandler';
import { getApolloBackground, getOrderProtection } from '@/services/api/rightsProtection';

import ErrorPage from './components/errorPage';
import Skeleton from './components/Skeleton';
import styles from './index.module.less';

const RightsProtection = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // 异常状态页面展示
  const [errorPageStatus, setErrorPageStatus] = useState({
    visible: false,
    text: '',
    type: 'error'
  });

  // 页面加载状态
  const [pageStatus, setPageStatus] = useState({
    status: LoadStatus.Loading,
    loadingElement: <Skeleton />
  });
  // 是否已阅读并同意规则

  // 订单是否有地址相关信息

  const [bg, setBg] = useState('');

  const gotoDetailPage = () => {
    navigate(`/rightsProtection/detail/${orderId}`);
  };

  // 初始加载
  const initPage = async (oId: string) => {
    try {
      const OrderProtectionRes = await getOrderProtection({ orderId: oId });

      const { resultCode, data, errorMsg } = OrderProtectionRes || {};
      if (resultCode === 200 && data) {
        const apolloRes = await getApolloBackground({ key: 'price.protection.link.config' });

        const { resultCode: apolloCode, data: apolloData } = apolloRes;
        if (apolloCode === 200 && apolloData) {
          const apolloParseData = JSON.parse(apolloData);
          setBg(apolloParseData.jojo.coverImageUrl);
          setPageStatus({
            status: LoadStatus.Success,
            loadingElement: <Skeleton />
          });
        }
      } else {
        switch (resultCode) {
          case 15301:
            gotoDetailPage();
            break;
          default:
            setErrorPageStatus({
              visible: true,
              text: errorMsg || '出错了，请重试',
              type: 'error'
            });
            setPageStatus({
              status: LoadStatus.Success,
              loadingElement: <Skeleton />
            });
            break;
        }
      }
    } catch (error) {
      setErrorPageStatus({
        visible: true,
        text: error?.errorMsg || error?.message || '出错了，请重试',
        type: 'error'
      });
      setPageStatus({
        status: LoadStatus.Success,
        loadingElement: <Skeleton />
      });
    }
  };

  useEffect(() => {
    if (!orderId) {
      setErrorPageStatus({
        visible: true,
        text: '订单号不能为空',
        type: 'error'
      });
      return;
    }

    initPage(orderId);
  }, [orderId]);

  if (errorPageStatus.visible) {
    return <ErrorPage {...errorPageStatus} />;
  }

  return (
    <StateHandler options={pageStatus}>
      <main className={styles.main}>
        <title>{'权益保障页面'}</title>
        <div className={styles['protection-container']}>
          <LoginBar isPopLogin={false} onLoginSuccess={() => window.location.reload()} />
          <img src={bg} alt='' className={styles['protection-img']} />
          <FixBottom>
            <div className={styles['btn-container']}>
              <Button
                className={styles.btn}
                shape='rounded'
                onClick={() => {
                  gotoDetailPage();
                }}>
                已阅读并同意上述规则
              </Button>
            </div>
          </FixBottom>
        </div>
      </main>
    </StateHandler>
  );
};

export default RightsProtection;
