import { CenterPopup } from 'antd-mobile';
import cx from 'classnames';
import qs from 'query-string';

import { FROUNT_URL_OLD } from '@/services/config';

import S from './index.module.less';

export default (props: { visible: boolean; info: any; onClose: () => void }) => {
  const { visible, info, onClose } = props;

  /**
   * 点击跳转
   */
  const handleClick = async () => {
    onClose();
    JOJO.showPage(
      `${FROUNT_URL_OLD}/order/detail?${qs.stringify({
        orderId: info?.orderId
      })}`,
      { to: 'externalWeb' }
    );
  };

  return (
    <CenterPopup visible={visible} onClose={onClose} bodyStyle={{ borderRadius: '20px' }}>
      <div className={S.cancelApply_wrap}>
        <div className='close' onClick={onClose} />
        <div className={S.desc}>该商品下已存在更优惠的订单，待支付金额{info?.payAmount || 0}元</div>
        <div className={S.btn_wrap}>
          <div onClick={handleClick}>
            <div className={cx(S.btn, S.confirm)}>去查看</div>
          </div>
        </div>
      </div>
    </CenterPopup>
  );
};
