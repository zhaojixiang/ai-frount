import { Button, CenterPopup } from 'antd-mobile';
import cx from 'classnames';
import QRCode from 'qrcode';
import { useEffect, useRef, useState } from 'react';

import refreshIcon from '@/assets/images/refresh.png';
import { billCheckOutByToken } from '@/services/api/orderPay';

import S from './index.module.less';

interface IProps {
  visible: boolean;
  onClose: () => void;
  info: { token: string };
}

function AliScanPayPop({ visible, onClose, info }: IProps) {
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [detail, setDetail] = useState<{ content: string; amount: string } | null>(null);
  const { token } = info || {};

  const containerRef = useRef(null);

  useEffect(() => {
    if (visible) {
      init();
    }
  }, [visible]);

  /**
   * 初始化
   */
  const init = async () => {
    setRefreshLoading(true);
    try {
      const res = await billCheckOutByToken({ token });
      const { data } = res || {};
      if (res?.resultCode === 200) {
        if (data.hasPaid) {
          return;
        }
        // 有content url才能生成二维码
        if (data.data.content) {
          const aliPayUrl = data.data.content;
          QRCode.toDataURL(aliPayUrl, { margin: 0 })
            .then((url) => {
              setDetail({ ...data.data, content: url });
            })
            .catch((err) => {
              console.error(err);
            });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshLoading(false);
    }
  };

  return (
    <CenterPopup
      visible={visible}
      closeOnMaskClick
      onClose={onClose}
      bodyStyle={{
        width: '100vw',
        height: '100vh',
        borderRadius: 0,
        margin: 0
      }}>
      <main className={S.qrCodeContainer}>
        <section className={S.content}>
          <div ref={containerRef} className={cx(S.contentDetail, S.paddingContentDetail)}>
            <div className={cx(S.detailTitle)}>
              <div className={S.titleIcon} />
              <span>支付宝扫码付款</span>
            </div>
            <div className={S.detailPrice}>¥{detail?.amount || '0.00'}</div>
            <div className={S.qrcode}>
              <img src={detail?.content} alt='' />
              {refreshLoading && (
                <div className={S.loadingMask}>
                  <img src={refreshIcon} className={S.refreshIcon} />
                </div>
              )}
            </div>
          </div>
          <Button className={cx(S.btn, S.cancelBtn)} onClick={onClose}>
            取消
          </Button>
        </section>
      </main>
    </CenterPopup>
  );
}

export default AliScanPayPop;
