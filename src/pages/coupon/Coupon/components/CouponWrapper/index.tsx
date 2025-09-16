import { Toast } from 'antd-mobile';
import React, { useRef } from 'react';

import noStockImg from '@/assets/images/no-coupon.png';
import { pickCoupon } from '@/services/api';

import CouponItem from '../CouponItem';
import S from './index.module.less';

// NORMAL-正常,END-不在活动期内,STOCK_OVER-已抢光,NOT_ACTIVITY_USER-非活动对象,CLAIMED-已领取
const couponBtnMap: any = {
  NORMAL: '一键领取',
  END: '不在活动期内',
  STOCK_OVER: '已抢光',
  NOT_ACTIVITY_USER: '您非活动适用对象',
  NO_RECEIVABLE_COUPON: '一键领取'
};

interface IProps {
  activityDetail: any;
  onRefresh?: () => void;
}

const Index: React.FC<IProps> = (props) => {
  const { activityDetail, onRefresh } = props;
  const { coupons, id, activityCode, pickState } = activityDetail;

  const isThrottled = useRef(false);

  /**
   * 领取优惠券
   * @param params 领取优惠券参数
   * @returns
   */
  const receiveCoupon = async (params: any) => {
    if (isThrottled.current) return;
    isThrottled.current = true;
    try {
      const res = await pickCoupon({
        ...params
      });
      if (res.resultCode === 200) {
        Toast.show({
          content: '领取成功',
          duration: 2000
        });
      } else {
        Toast.show({
          content: res.resultMsg,
          duration: 2000
        });
      }
      onRefresh?.();
    } finally {
      setTimeout(() => {
        isThrottled.current = false;
      }, 3000);
    }
  };

  /**
   * 点击领取（单个）
   * @param coupon
   * @returns
   */
  const onClickApply = async (coupon: any) => {
    await receiveCoupon({
      couponIds: [coupon.id],
      channel: '',
      activityCode
    });
  };

  /**
   * 点击领取 (批量)
   */
  const onClickApplyBatch = async () => {
    await receiveCoupon({
      couponIds: coupons?.map((item: any) => item.id) || [],
      activityId: id,
      channel: '',
      activityCode
    });
  };

  /**
   * 渲染优惠券列表
   * @returns React.ReactNode
   */
  const renderCouponItems = () => {
    return coupons?.map((item: any) => {
      const info = { ...item, pickState };
      return (
        <li key={item.id}>
          <CouponItem
            type='small'
            onClickApply={pickState === 'NORMAL' ? onClickApply : undefined}
            couponInfo={info}
            saleIp={activityDetail?.saleIp || ''}
            waterMark={() => {
              if (typeof item.haveStock === 'boolean' && !item.haveStock && !item.hasPick) {
                return <img className={S.statusImg} src={noStockImg} alt='' />;
              } else {
                return null;
              }
            }}
          />
        </li>
      );
    });
  };

  return (
    <section className={S.couponWrapper}>
      <ul>{renderCouponItems()}</ul>
      {pickState === 'NORMAL' ? (
        <div className={S.primaryGradientBtn} onClick={onClickApplyBatch}>
          {couponBtnMap[pickState]}
        </div>
      ) : (
        pickState !== 'CLAIMED' && <div className={S.grayBtn}>{couponBtnMap[pickState]}</div>
      )}
    </section>
  );
};

export default Index;
