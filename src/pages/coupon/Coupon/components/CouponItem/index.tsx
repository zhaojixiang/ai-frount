import { DownOutline, UpOutline } from 'antd-mobile-icons';
import cx from 'classnames';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import S from './index.module.less';

const classNameMap: any = {
  NORMAL: S.lootAllImg,
  CLAIMED: S.receivedImg
};

/**
 * 商品详情页优惠券弹框中单个优惠券组件
 * @param props
 * @constructor
 */
const Index: React.FC<any> = (props) => {
  const { type, onClickApply, onSelect, waterMark, couponInfo, unAvailable, saleIp, linkCodeCopy } =
    props;
  const {
    desc,
    name,
    startTime,
    expireTime,
    amount,
    threshold,
    hasPick,
    canPick,
    unavailableReason,
    ruleType,
    pickState
  } = couponInfo;
  const [showDetail, setShowDetail] = useState(false);

  /**
   * 点击领取
   */
  const onClickReceive = () => {
    onClickApply?.(couponInfo);
  };

  let itemCss = S.modalCouponItemWrapper;
  let itemMainCss = S.modalCouponItem;
  if (type === 'small') {
    itemCss = cx([S.modalCouponItemWrapper, S.smallCouponWrapper]);
  }

  if (type === 'gray') {
    itemMainCss = cx([S.modalCouponItem, S.gray]);
  }

  const sDate = dayjs(startTime).format('YYYY.MM.DD');
  const eDate = dayjs(expireTime).format('YYYY.MM.DD');
  const parsedThreshold = typeof threshold === 'number' ? (threshold / 100).toFixed(0) : '';
  const parsedAmount: any = typeof amount === 'number' ? (amount / 100).toFixed(0) : '';

  const renderBtn = () => {
    if (linkCodeCopy) {
      if (linkCodeCopy?.startsWith?.('NL')) {
        return pickState === 'NORMAL' && canPick ? (
          <div className={S.primarySmall} onClick={onClickReceive}>
            立即领取
          </div>
        ) : (
          hasPick && <div className={classNameMap[pickState]} />
        );
      } else {
        return canPick ? (
          <div className={S.primarySmall} onClick={onClickReceive}>
            {hasPick ? '再次领取' : '立即领取'}
          </div>
        ) : (
          hasPick && <div className={S.receivedImg} />
        );
      }
    } else {
      return pickState === 'NORMAL' && canPick ? (
        <div className={S.primarySmall} onClick={onClickReceive}>
          立即领取
        </div>
      ) : (
        hasPick && <div className={classNameMap[pickState]} />
      );
    }
  };
  return (
    <div className={itemCss}>
      <div className={itemMainCss} onClick={() => onSelect && onSelect(couponInfo)}>
        <div className={S.modalCouponLeft}>
          {ruleType === 3 && <div className={S.couponType}>每季优惠</div>}
          <div className={S.price}>
            <span className={S.unit}>¥</span>
            {parsedAmount}
          </div>
          <div className={S.threshold}>满{parsedThreshold}可用</div>
        </div>
        <div className={S.modalCouponRight}>
          <div className={S.modalCouponDesc}>
            <div>
              {/* 仅促销返回saleIp */}
              {saleIp || ''}
              {name}
            </div>
            <div className={desc ? undefined : S.pd28}>
              <span>
                {sDate} - {eDate}
              </span>
              {renderBtn()}

              {waterMark && waterMark()}
              {type === 'can-selected' ? <span className={S.canSelected} /> : ''}
              {type === 'selected' ? <span className={S.selected} /> : ''}
            </div>
            {desc && (
              <div className={S.detailText} onClick={() => setShowDetail((val) => !val)}>
                <span>详细信息</span>
                {showDetail ? <UpOutline className={S.icon} /> : <DownOutline className={S.icon} />}
              </div>
            )}
          </div>
        </div>
      </div>
      {desc && showDetail && <div className={S.detail}>{desc}</div>}
      {unAvailable && <div className={S.detail}>{unAvailable(unavailableReason)}</div>}
    </div>
  );
};

export default Index;
