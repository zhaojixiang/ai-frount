import { Popup } from 'antd-mobile';
import cx from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import FixBottom from '@/components/FixBottom';

import S from './index.module.less';

type IProps = {
  visible: boolean;
  onClose: () => void;
  onOk: () => void;
};
export default (props: IProps) => {
  const { visible, onClose, onOk } = props;
  const divRef = useRef<HTMLDivElement>(null);

  const [time, setTime] = useState(3);
  const timer = useRef<any>(null);

  useEffect(() => {
    if (!visible) {
      if (divRef.current) {
        divRef.current.scrollTop = 0; // 重置滚动位置
      }
      setTime(3);
    } else {
      timer.current = setInterval(() => {
        setTime((prevTime) => prevTime - 1); // 使用函数式更新
      }, 1000);
    }
    return () => {
      clearInterval(timer.current);
    };
  }, [visible]);

  /**
   * 提交
   */
  const handleSubmit = () => {
    onOk?.();
  };
  /**
   * 关闭
   */
  const handleClose = () => {
    onClose?.();
  };

  /**
   * 滚动到底部
   */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    // 判断是否滚动到底部（这里加了5px的容差）
    if (scrollHeight - (scrollTop + clientHeight) < 5) {
      setTime(0);
    }
  };
  return (
    <Popup
      visible={visible}
      onMaskClick={handleClose}
      bodyStyle={{
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        minHeight: '40vh'
      }}
      className={S.select_product_wrap}>
      <div className='close' onClick={handleClose} />
      <div className={S.title}>叫叫产品先学后付协议</div>
      <div className={S.content} ref={divRef} onScroll={handleScroll}>
        <div className={S.normalText}>
          欢迎您使用由成都书声科技有限公司及指定的关联公司（以下称“书声科技”或“我们”）提供的平台（包括叫叫的网站、APP、微信公众号/服务号、微信小程序等，以下称“叫叫平台”）的产品和服务。
          <span className={S.mainText}>
            请您（以下也称“用户”）于使用叫叫平台的产品和服务前认真阅读并充分理解本协议的全部内容，您对我们产品的使用行为，或您点击【同意签约】本协议的按钮，即视为您已经全文阅读并充分理解和自愿接受本协议之全部内容，本协议即在您和我们之间正式订立并即时生效，形成对双方均具有拘束力的法律文件。
          </span>
        </div>
        <div className={S.subTitle}>一、服务协议的确认和接纳</div>
        <div className={S.normalText}>
          1．本协议是用户与我们之间关于使用叫叫平台服务的协议，为《用户服务协议》的补充协议。如本协议与上述协议存在冲突的，以本协议约定为准。
        </div>
        <div className={S.normalText}>
          2．您确认，您具备与您在叫叫平台开展行为（包括但不限于订立协议、购买平台产品或服务等）相适应的民事行为能力。
          <span className={S.mainText}>
            若您未满十八周岁或存在其他不具备与您行为相适应的民事行为能力的情形，则应在您的法定监护人的监护下、或同意后再使用叫叫平台服务。未成年人行使和履行本协议项下的权利和义务视为已获得法定监护人的认可，本协议对您及您的法定监护人产生法律约束力。
          </span>
        </div>
        <div className={S.normalText}>
          3．请您理解，我们有权根据法律法规、业务发展情况调整(包括取消、新增、减少等)付费的类型、额度和产品权益，我们将以合理方式公布和/或向您发送通知，我们建议请您仔细阅读。我们将尽力确保上述调整不会损害会员已有利益，如您对调整有异议，请您联系我们的客服。当您继续使用产品的，即表明您同意接受相应调整。如您不同意前述调整内容的，请您立即停止使用服务。
        </div>
        <div className={S.subTitle}>二、关于先学后付服务</div>
        <div className={S.normalText}>
          1．您签约的服务为叫叫全年系统包先学后付服务。您可选择在首月试学（以下简称“试学”）过程中，或在试学结束满意后付费购买产品。
        </div>
        <div className={S.normalText}>
          2．成功签约后，您将享受除实物外的全部权益，实物赠品将在付费购买产品后发放。先学后付产品不支持调整解锁计划。
        </div>
        <div className={S.normalText}>
          3．试学结束后 7 天内，若您未付费，您的订单将被关闭，对应的产品服务和权益亦将被移除。
        </div>
      </div>
      <FixBottom className={S.btn_wrap}>
        {time > 0 ? (
          <div className={S.btn}>上划查看全部协议 ({time})</div>
        ) : (
          <div className={cx(S.btn, S.confirm)} onClick={handleSubmit}>
            同意签约
          </div>
        )}
      </FixBottom>
    </Popup>
  );
};
