import Check from '@/components/Check';

import S from './index.module.less';

interface IProps {
  subscriptionType: string;
  onHandleGoProtocol: (type: 'userService' | 'purchase' | 'autoRenew') => void;
  onProtocolChange: (val: boolean) => void;
  isAcceptProtocol: boolean;
}

export default (props: IProps) => {
  const { onHandleGoProtocol, onProtocolChange, subscriptionType, isAcceptProtocol } = props;

  return (
    <div className={S.protocolZone}>
      <span className={S.agree} onClick={() => onProtocolChange?.(!isAcceptProtocol)}>
        <Check checkActiveClass={S.check} noCheckClass={S.noCheck} check={isAcceptProtocol} />
        <span className={S.agree_text}>已阅读并同意</span>
      </span>
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
  );
};
