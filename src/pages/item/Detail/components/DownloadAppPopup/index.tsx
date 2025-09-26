import { CenterPopup } from 'antd-mobile';
import cx from 'classnames';

import S from './index.module.less';

export default (props: { visible: boolean; onClose: () => void }) => {
  const { visible, onClose } = props;

  /**
   * 点击前往叫叫APP
   */
  const handleConfirm = () => {
    JOJO.showPage(
      'https://jojoread.tinman.cn/account/appDownload/?packageName=com.shusheng.JoJoRead&channel=Tinman',
      { to: 'externalWeb' }
    );
    onClose?.();
  };
  return (
    <CenterPopup
      visible={visible}
      onClose={onClose}
      closeOnMaskClick
      bodyStyle={{ borderRadius: '20px' }}>
      <div className={S.cancelApply_wrap}>
        <div className={S.title}>暂时无法购买</div>
        <div className={S.desc}>请前往叫叫APP购买</div>
        <div className={S.btn_wrap}>
          <div className={cx(S.btn, S.cancel)} onClick={onClose}>
            取消
          </div>
          <div onClick={handleConfirm}>
            <div className={cx(S.btn, S.confirm)}>前往叫叫APP</div>
          </div>
        </div>
      </div>
    </CenterPopup>
  );
};
