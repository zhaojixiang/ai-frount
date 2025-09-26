import { CenterPopup } from 'antd-mobile';
import cx from 'classnames';
import { useEffect, useMemo, useState } from 'react';

import S from './index.module.less';

let timer: any = null;
const SubjectTypes: any = [101, 102, 103, 104, 105, 107];
const SubjectMaps: any = {
  101: '阅读',
  102: '思维',
  103: '小作家',
  104: '美育',
  105: '英语',
  107: '文学应用'
};

export default (props: {
  visible: boolean;
  projectId: any;
  pointNotEnoughJump: any;
  onClose: () => void;
}) => {
  const { visible, onClose, projectId, pointNotEnoughJump } = props;
  const [time, setTime] = useState(5);

  const msg = useMemo(() => {
    if (SubjectTypes.includes(projectId)) {
      return `商品已下架，即将为您跳转${SubjectMaps[projectId]}通选商品～`;
    }
    return '商品已下架，请联系指导师购买～';
  }, [projectId]);

  useEffect(() => {
    if (visible) {
      if (SubjectTypes.includes(projectId)) {
        timer = setInterval(() => {
          setTime((t) => t - 1);
        }, 1000);
      }
    } else {
      clearInterval(timer);
      setTime(5);
    }
    return () => {
      clearInterval(timer);
    };
  }, [visible, time, projectId]);

  useEffect(() => {
    if (time <= 0) {
      setTime(0);
      clearInterval(timer);
      onClose();
      window.location.replace(pointNotEnoughJump);
    }
  }, [time]);

  /**
   * 点击跳转
   */
  const handleClick = async () => {
    if (pointNotEnoughJump) {
      onClose();
      window.location.replace(pointNotEnoughJump);
    }
  };

  return (
    <CenterPopup
      visible={visible}
      style={{ '--z-index': '1036' }}
      bodyStyle={{ borderRadius: '20px' }}>
      <div className={S.cancelApply_wrap}>
        <div className={S.desc}>{msg}</div>
        <div className={S.btn_wrap}>
          {pointNotEnoughJump && SubjectTypes.includes(projectId) ? (
            <div onClick={handleClick}>
              <div className={cx(S.btn, S.confirm)}>立即跳转（{time}）</div>
            </div>
          ) : (
            <div className={cx(S.btn, S.confirm)} onClick={onClose}>
              我知道了
            </div>
          )}
        </div>
      </div>
    </CenterPopup>
  );
};
