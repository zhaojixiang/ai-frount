import { Button, CenterPopup } from 'antd-mobile';
import cx from 'classnames';
import QRCode from 'qrcode';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import refreshIcon from '@/assets/image/refresh.png';
import { billCheckOutByToken } from '@/services/api/orderPay';

import S from './index.module.less';

interface IProps {
  visible: boolean;
  onClose: () => void;
  url: string;
  totalAmount: string;
  payWay: string;
  token: string;
}

function ScanPayPop({ visible, onClose, url }: IProps) {
  const [refreshLoading, setRefreshLoading] = useState(false);

  const containerRef = useRef(null);
  /**
   * 初始化二维码
   */
  //   const initQrcode = async (signUrl: string) => {
  //     try {
  //       // 验证输入是否为空
  //       if (!signUrl) {
  //         console.error('Empty URL provided for QR code generation');
  //         return;
  //       }

  //       // 尝试解码base64，如果失败则使用原始URL
  //       let newUrl = signUrl;
  //       try {
  //         newUrl = window.atob(signUrl);
  //       } catch (decodeError) {
  //         console.warn('Failed to decode base64, using original URL:', signUrl, decodeError);
  //         // 继续使用原始URL
  //       }

  //       // 确保URL是有效的字符串
  //       if (typeof newUrl !== 'string' || newUrl.length === 0) {
  //         console.error('Invalid URL for QR code generation:', newUrl);
  //         return;
  //       }
  //     } catch (error) {
  //       console.error('Failed to generate QR code:', error);
  //     }
  //   };

  //   useEffect(() => {
  //     initQrcode(url);
  //   }, []);

  return (
    <CenterPopup
      visible={visible}
      closeOnMaskClick
      onClose={onClose}
      bodyStyle={{ borderRadius: '20px' }}>
      <main className={S.qrCodeContainer}>
        <section className={S.content}>
          <div ref={containerRef} className={cx(S.contentDetail, S.paddingContentDetail)}>
            <p className={cx(S.detailTitle)}>
              <img src={'@/assets/image/aliPayIcon.png'} alt='' />

              <span>支付宝扫码付款</span>
            </p>
            <p className={S.detailPrice}>¥{detail.amount || '0.00'}</p>
            <p>
              <img src={detail.content} alt='' />
              {refreshLoading && (
                <div className={S.loadingMask}>
                  <img src={refreshIcon} className={S.refreshIcon} />
                </div>
              )}
            </p>
          </div>
          <Button className={cx(S.btn, S.cancelBtn)} onClick={onClose}>
            取消
          </Button>
        </section>
      </main>
    </CenterPopup>
  );
}

export default ScanPayPop;
