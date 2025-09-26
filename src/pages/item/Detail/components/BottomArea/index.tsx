import { Button } from 'antd-mobile';
import cx from 'classnames';
import { isEmpty } from 'lodash-es';

import FixBottom from '@/components/FixBottom';

import S from './index.module.less';

interface Props {
  onNotLoginIntercept: (e: any) => void;
  onHandleBuyBtn: (e: any) => void;
  supportURL: string;
  pageData: any;
  isLogin: boolean;
}

const BottomArea: React.FC<Props> = (props) => {
  const { onNotLoginIntercept, onHandleBuyBtn, supportURL, pageData, isLogin } = props;
  const { learningPay, skuList, coupon } = pageData || {};
  /*
   * 渲染购买按钮
   */
  const renderBtn = () => {
    const { stock, productState } = pageData || {};

    // 已下架
    if (productState === 4) {
      return <span className={cx(S.btn, S.disabled)}>已下架</span>;
    }

    // 已售罄
    if (typeof stock === 'number' && !stock) {
      return <span className={cx(S.btn, S.disabled)}>已售罄</span>;
    }

    // 按钮文案 默认【立即购买】
    let btnText = '立即购买';

    if (!isLogin) {
      btnText = '登录查看优惠';
    } else if (learningPay) {
      btnText = '0元签约';
    } else if (skuList?.length > 1) {
      // 多个sku时
      btnText = '选择商品';
    } else {
      // 一个sku时
      // 有未领取的 推荐 自动领优惠券
      if (!isEmpty(coupon) && coupon?.pickState !== 6 && coupon?.autoPick) {
        btnText = '领券购买';
      }
    }
    return (
      <Button
        className={S.btn}
        shape='rounded'
        onClick={async (e) => {
          onHandleBuyBtn(e);
        }}>
        {btnText}
      </Button>
    );
  };
  return (
    <FixBottom className={S.bottomZone}>
      <div className={S.purchaseZone} onClickCapture={(e) => onNotLoginIntercept(e)}>
        {supportURL ? (
          <div
            className={S.supportWrap}
            onClick={() => {
              //   sensClick(e);
              JOJO.showPage(supportURL, { to: 'externalWeb' });
            }}>
            <div className={S.supportImg} />
            <div className={S.supportDesc}>客服</div>
          </div>
        ) : null}
        <div className={S.btnWrapper}>{renderBtn()}</div>
      </div>
    </FixBottom>
  );
};

export default BottomArea;
