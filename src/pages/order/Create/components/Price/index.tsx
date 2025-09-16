import cx from 'classnames';
import React from 'react';

import S from './index.module.less';

interface IProps {
  detail: any;
  query: {
    subscriptionType?: string;
  };
  payWay?: number;
  voucher?: {
    showVoucher?: boolean;
    disabledVoucher?: boolean;
    hasVoucherIdsField?: boolean;
    recommendVoucherData?: any;
  };
  onHandleGoVoucher: () => void;
  onHandleGoCoupon: () => void;
}
// const { LeftBoldOutline } = JojoIcon;
export default function Price(props: IProps) {
  const { detail, voucher, payWay, query, onHandleGoVoucher, onHandleGoCoupon } = props;
  const { showVoucher, disabledVoucher, hasVoucherIdsField, recommendVoucherData } = voucher || {};
  const { subscriptionType } = query || {};

  const { currencyType } = detail || {};

  /**
   * 渲染优惠券
   */
  const renderCoupon = () => {
    if (detail?.couponInfo?.couponDiscountsAmount > 0) {
      return (
        <span className={S.price}>
          - {renderPriceLabelV2()}
          {detail.couponInfo?.couponDiscountsAmount}
        </span>
      );
    }
    if (detail?.haveCoupon) {
      return <span className={S.selectCoupon}>请选择可用优惠券</span>;
    }
    return <span className={S.noCoupon}>无可用优惠券</span>;
  };

  /**
   * 代金券模块
   */
  const renderVoucher = () => {
    if (disabledVoucher) {
      return <span className={S.noCoupon}>无可用代金券</span>;
    }
    if (detail.voucherAmount > 0) {
      return (
        <span className={S.price}>
          - {renderPriceLabelV2()}
          {detail.voucherAmount}
        </span>
      );
    }
    // 取消代金券选择场景： 非推荐， 且无数据
    if (
      hasVoucherIdsField &&
      detail.voucherAmount <= 0 &&
      recommendVoucherData?.optimalChoices?.length
    ) {
      return <span className={S.selectCoupon}>请选择可用代金券</span>;
    }

    return <span className={S.noCoupon}>无可用代金券</span>;
  };

  /**
   * 渲染商品金额
   */
  const renderProductPrice = () => {
    if (detail?.activitySku) {
      return detail?.activitySku || 0;
    }

    if (!subscriptionType) {
      return detail.promotionPrice > 0 || detail.promotionPrice === 0
        ? detail.promotionPrice
        : detail.price;
    }

    return detail?.price || 0;
  };
  /**
   * 渲染价格前缀
   * @returns 价格前缀
   */
  const renderPriceLabel = () => {
    if (currencyType === 'USD') {
      return 'USD $';
    } else {
      return detail?.payMode === 'POINT' ? <span className={S.bean} /> : '￥';
    }
  };
  /**
   * 渲染价格前缀
   * @returns 价格前缀
   */
  const renderPriceLabelV2 = () => {
    if (currencyType === 'USD') {
      return '$';
    } else {
      return '￥';
    }
  };
  return (
    <div className={S.priceWrap}>
      <div className={S.total_price}>
        <span className={S.label}>商品价格</span>
        <span className={S.price}>
          {renderPriceLabelV2()}
          {renderProductPrice()}
        </span>
      </div>

      <div className={S.itemBoxWrap}>
        {/* 立减 */}
        {detail.promDiscountsAmount > 0 && (
          <div className={cx(S.itemBox)}>
            <div className={S.label}>
              <div className={cx(S.labelIcon, S.discountIcon)} />
              优惠金额
            </div>
            <span className={S.priceBox}>
              <span className={S.price}>
                {' '}
                -{renderPriceLabelV2()}
                {detail?.promDiscountsAmount || '0.00'}
              </span>
            </span>
          </div>
        )}

        {/* 优惠券 */}
        {!detail?.hasDisableCoupon && (
          <div className={cx(S.itemBox, S.coupon)} onClick={onHandleGoCoupon}>
            <div className={S.label}>
              <div className={cx(S.labelIcon, S.couponIcon)} />
              {detail?.couponName ? detail?.couponName : '优惠券'}
            </div>
            <span className={S.priceBox}>
              {renderCoupon()}
              {!detail?.couponInfo?.autoPick && <div className={S.rightIcon} />}
            </span>
          </div>
        )}

        {/* 代金券 */}
        {showVoucher && !detail?.hasDisableVoucher ? (
          <div className={cx(S.itemBox)} onClick={onHandleGoVoucher}>
            <div className={S.label}>
              <div className={cx(S.labelIcon, S.voucherIcon)} />
              {detail?.voucherName ? detail?.voucherName : '代金券'}
            </div>
            <span className={S.priceBox}>
              {renderVoucher()}
              <div className={S.rightIcon} />
            </span>
          </div>
        ) : null}

        {/* 总计 */}
        {detail?.totalDiscountAmount > 0 ? (
          <div className={S.res_price}>
            已优惠
            <span className={S.discount}>
              {renderPriceLabelV2()}
              {detail?.totalDiscountAmount}
            </span>
            {![999]?.includes(Number(payWay)) ? '合计' : '签约价'}
            <span className={S.yuan}>{renderPriceLabel()}</span>
            <span className={S.total}>{detail?.totalCast}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
