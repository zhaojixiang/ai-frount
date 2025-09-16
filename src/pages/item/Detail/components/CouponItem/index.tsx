import dayjs from 'dayjs';
import React, { useState } from 'react';

import { pickCoupon } from '@/services/api/coupon';

import S from './index.module.less';

export default function CouponItem(props: { coupon: any; afterReceive: () => void }) {
  const { coupon, afterReceive } = props;

  const [isPicked, setIsPicked] = useState(false);

  const {
    id,
    name,
    startTime,
    expireTime,
    ruleType,
    threshold,
    amount,
    activityCode,
    saleIp,
    pickState
  } = coupon;

  const onClickReceive = async () => {
    if (isPicked || pickState !== 'NORMAL') return; // 避免重复领取
    // sensClickInitiative({
    //   $element_name: '商品详情页_优惠券点击',
    //   $element_content: name
    // });
    JOJO.loading.show({ content: '领取中...' });
    const res: any = await pickCoupon({
      couponIds: [id],
      channel: '',
      activityCode
    });
    JOJO.loading.close();
    if (res.resultCode === 200) {
      setIsPicked(true);
      afterReceive();
      JOJO.toast.show({
        content: '领取成功'
      });
    }
  };

  const parsedThreshold = typeof threshold === 'number' ? (threshold / 100).toFixed(0) : '';
  const parsedAmount = typeof amount === 'number' ? (amount / 100).toFixed(0) : '';

  return (
    <div className={S.couponRecommnd_wrap}>
      <div className={S.coupon}>
        <div className={S.couponLeft}>
          {ruleType === 3 && <span className={S.couponType}>每季优惠</span>}
          <div className={S.price}>
            <span className={S.unit}>￥</span>
            {parsedAmount}
          </div>
          {(ruleType === 1 || ruleType === 3) && (
            <div className={S.threshold}>
              满{parsedThreshold}
              可用
            </div>
          )}
        </div>
        <div className={S.couponCenter}>
          <div className={S.title}>
            {saleIp || ''}
            {name}
          </div>
          <div className={S.time}>
            {dayjs(startTime).format('YYYY.MM.DD')} - {dayjs(expireTime).format('YYYY.MM.DD')}
          </div>
        </div>
        <div className={S.couponRight}>
          {(pickState === 'CLAIMED' || isPicked) && <div className={S.receivedImg} />}
          {pickState === 'NORMAL' && !isPicked && (
            <div className={S.btn} onClick={onClickReceive}>
              立即领取
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
