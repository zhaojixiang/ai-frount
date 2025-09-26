import { CenterPopup } from 'antd-mobile';
import cx from 'classnames';
import qs from 'query-string';

import { FROUNT_URL_OLD } from '@/services/config';

import S from './index.module.less';

interface Props {
  visible: boolean;
  info: any;
  onClose: () => void;
}

export default (props: Props) => {
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
        <div className={S.title}>已有签约订单</div>
        <div className={S.desc}>您已签约先学后付订单，请前往订单详情，查看详细内容。</div>
        <div className={S.btn_wrap}>
          <div onClick={handleClick}>
            <div className={cx(S.btn, S.confirm)}>前往订单详情查看</div>
          </div>
        </div>
      </div>
    </CenterPopup>
  );
};
