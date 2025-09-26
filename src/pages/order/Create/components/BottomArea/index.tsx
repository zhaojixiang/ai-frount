import cx from 'classnames';

import FixBottom from '@/components/FixBottom';

import Agreement from '../Agreement';
import S from './index.module.less';

interface IProps {
  subscriptionType: string;
  isAcceptProtocol: boolean;
  setIsAcceptProtocol: (val: boolean) => void;
  toProtocol: (type: string) => void;
  detail: any;
  curPayWay: number;
  renderPriceLabel: () => string;
  onConfirm: () => void;
}

export default function BottomArea(props: IProps) {
  const {
    subscriptionType,
    isAcceptProtocol,
    setIsAcceptProtocol,
    toProtocol,
    detail,
    curPayWay,
    renderPriceLabel,
    onConfirm
  } = props;

  /**
   * 渲染按钮
   */
  const renderBtn = () => {
    // 已下架
    if (detail.productState === 4) {
      return (
        <div className={cx(S.confirm, S.disabled)}>
          <div>已下架</div>
        </div>
      );
    }
    // 已售罄
    if (!detail.skuSaleResp || !detail.skuSaleResp.stock) {
      return (
        <div className={cx(S.confirm, S.disabled)}>
          <div>已售罄</div>
        </div>
      );
    }

    // 按钮文案
    let btnText = '';
    if (Number(curPayWay) === 116) {
      btnText = '立即签约';
    } else if (Number(curPayWay) === 999) {
      btnText = '0元签约';
    } else {
      btnText = '立即支付';
    }

    // 价格 (先学后付不显示价格)
    let price: any = '';
    if (![116, 999]?.includes(Number(curPayWay))) {
      price = (
        <>
          {renderPriceLabel()}
          {detail?.totalCast}
        </>
      );
    }

    return (
      <div
        className={S.confirm}
        onClick={() => {
          onConfirm();
        }}>
        {[999].includes(Number(curPayWay)) ? <div className={S.btnTips} /> : null}
        <div>
          {btnText}
          {price}
        </div>
      </div>
    );
  };
  return (
    <div className={S.bottomArea}>
      <FixBottom>
        {/* 用户协议 */}
        <div className={S.agreement}>
          <Agreement
            subscriptionType={subscriptionType}
            isAcceptProtocol={isAcceptProtocol}
            onProtocolChange={(val) => setIsAcceptProtocol(val)}
            onHandleGoProtocol={toProtocol}
          />
        </div>
        <div className={S.handleZone}>{renderBtn()}</div>
      </FixBottom>
    </div>
  );
}
