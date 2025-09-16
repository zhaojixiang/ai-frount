import { Button } from 'antd-mobile';
import cx from 'classnames';
import { useRef } from 'react';

import S from './index.module.less';

interface IProps {
  onClose: () => void;
  info: any;
}

function AliScanPayPop({ onClose, info }: IProps) {
  const containerRef = useRef(null);

  return (
    <main className={S.qrCodeContainer}>
      <section className={S.content}>
        <div ref={containerRef} className={cx(S.contentDetail, S.paddingContentDetail)}>
          <div className={cx(S.detailTitle)}>
            <div className={S.titleIcon} />
            <span>支付宝扫码付款</span>
          </div>
          <div className={S.detailPrice}>¥{info?.amount || '0.00'}</div>
          <div className={S.qrcode}>
            <img src={info?.content} alt='' />
          </div>
        </div>
        <Button className={cx(S.btn, S.cancelBtn)} onClick={onClose}>
          取消
        </Button>
      </section>
    </main>
  );
}

export default AliScanPayPop;
