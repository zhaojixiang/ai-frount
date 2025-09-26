import React from 'react';

import CouponItem from '../CouponItem';
import S from './index.module.less';

export default function CouponWrapper(props: { coupon: any; afterReceive: () => void }) {
  const { coupon, afterReceive } = props;

  const renderBtn = () => {
    return (
      <div className={S.couponRecommnd_wrap}>
        <CouponItem coupon={coupon} afterReceive={afterReceive} />
      </div>
    );
  };

  return renderBtn();
}
