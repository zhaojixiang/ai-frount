import { Button, CenterPopup } from 'antd-mobile';

import socializePng from '@/assets/images/socialize.png';
import socializeFriendsPng from '@/assets/images/socialize-friends.png';

import S from './index.module.less';

interface Props {
  visible: boolean;
  onClose: () => void;
  onOK: () => void;
}

const ShareModal = ({ visible, onClose, onOK }: Props) => {
  return (
    <CenterPopup
      visible={visible}
      onClose={onClose}
      closeOnMaskClick
      bodyStyle={{ borderRadius: '20px' }}>
      <div className={S.modalWrapper}>
        <div className='close' onClick={onClose} />
        <div className={S.modalContent}>
          {!JOJO.Os.app ? (
            <div className={S.modalItemGroup}>
              <div className={S.flexItemLeft}>
                <img src={socializeFriendsPng} alt='' />
              </div>
              <div className={S.flexItemRight}>
                <h3>分享给好友</h3>
                <p>
                  点击右上角的
                  <span>...</span>
                  按钮分享。
                </p>
              </div>
            </div>
          ) : null}

          <div className={S.modalItemGroup}>
            <div className={S.flexItemLeft}>
              <img src={socializePng} alt='' />
            </div>
            <div className={S.flexItemRight}>
              <h3>生成海报</h3>
              <p>点击生成海报按钮，进行海报图片保存。</p>
            </div>
          </div>
          <div>
            <Button className={S.btnWarn} onClick={onOK}>
              生成海报
            </Button>
          </div>
        </div>
      </div>
    </CenterPopup>
  );
};

export default ShareModal;
