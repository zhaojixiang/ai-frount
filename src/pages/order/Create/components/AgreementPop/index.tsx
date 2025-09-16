import { CenterPopup } from 'antd-mobile';
import cx from 'classnames';
import React, { useEffect } from 'react';

// import { sensElementView } from '@/utils/sensors';
import S from './index.module.less';

interface IProps {
  visible: boolean;
  onClose: () => void;
  subscriptionType?: string;
  onHandleGoProtocol: (type: 'userService' | 'purchase' | 'autoRenew') => void;
  onHandleAgree: () => void;
}

export default (props: IProps) => {
  const { onHandleGoProtocol, onClose, visible, subscriptionType, onHandleAgree } = props;

  useEffect(() => {
    if (visible) {
      // sensElementView({
      //   $element_name: '确认订单收银台-用户协议弹窗'
      // });
    }
  }, [visible]);

  return (
    <CenterPopup
      visible={visible}
      closeOnMaskClick
      onClose={onClose}
      bodyStyle={{ borderRadius: '20px' }}>
      <div className={S.container_wrap}>
        <div className={S.protocolZone}>
          <div className={S.text}>请确认您已阅读并同意</div>
          <span onClick={() => onHandleGoProtocol('userService')} className={S.protocol}>
            《用户服务协议》
          </span>
          {subscriptionType ? (
            <span onClick={() => onHandleGoProtocol('autoRenew')} className={S.protocol}>
              《自动续费协议》
            </span>
          ) : null}
          {!JOJO.Os.matrix && (
            <span onClick={() => onHandleGoProtocol('purchase')} className={S.protocol}>
              《用户购买协议》
            </span>
          )}
        </div>
        <div className={S.btn_wrap}>
          <div className={cx(S.btn, S.cancel)} onClick={onClose}>
            返回
          </div>
          <div onClick={onHandleAgree}>
            <div className={cx(S.btn, S.confirm)}>同意并继续</div>
          </div>
        </div>
      </div>
    </CenterPopup>
  );
};
