import cx from 'classnames';
import React, { useState } from 'react';
import { useEffect } from 'react';

import S from './index.module.less';

interface IProps {
  detail: any;
}

export default (props: IProps) => {
  const { detail } = props;

  const { giftSkus, familyCardFlag } = detail || {};

  const [giftGift, setGiftGift] = useState<any>([]);
  const [giftEntity, setGiftEntity] = useState<any>([]);
  // 赠课
  const giftCourse = giftSkus?.filter((item: any) => item?.giftSkuType === 'COURSE');
  // 赠品
  const getGiftGift = async () => {
    let currentGiftGift = [];
    if (await JOJO.Utils.isIosApp()) {
      currentGiftGift = giftSkus?.filter((item: any) => {
        if (detail?.payMode === 'POINT') {
          return (
            item?.giftSkuType === 'COMMON' && String(item?.id) !== String(detail?.skuSaleResp?.id)
          );
        }
        return item?.giftSkuType === 'COMMON';
      });
    } else {
      currentGiftGift = giftSkus?.filter((item: any) => {
        return (
          (item?.giftSkuType === 'COMMON' || item?.giftSkuType === 'ENTITY') &&
          !item?.skuShowName.includes('（随材）') &&
          String(item?.id) !== String(detail?.skuSaleResp?.id)
        );
      });
    }
    setGiftGift(currentGiftGift);
  };
  // 实物
  const getGiftEntity = async () => {
    let currentGiftEntity = [];
    if (await JOJO.Utils.isIosApp()) {
      currentGiftEntity = giftSkus?.filter((item: any) => {
        if (detail?.payMode === 'POINT') {
          return (
            item?.giftSkuType === 'ENTITY' && String(item?.id) !== String(detail?.skuSaleResp?.id)
          );
        }
        return item?.giftSkuType === 'ENTITY';
      });
    }
    setGiftEntity(currentGiftEntity);
  };

  useEffect(() => {
    getGiftEntity();
    getGiftGift();
  }, [giftSkus]);

  return (
    <div className={S.skuDetailZone}>
      <div className={S.skuDetail}>
        <div className={S.skuImageWp}>
          <div
            className={S.skuImage}
            style={{
              backgroundImage: `url(${
                detail && detail.skuSaleResp ? detail.skuSaleResp.imageUrl : ''
              })`
            }}
          />
        </div>
        <div className={S.rightBox}>
          <div className={S.skuTitle}>
            {detail?.skuSaleResp?.skuShowName === 'true' || detail?.skuSaleResp?.showName === 'true'
              ? detail?.skuSaleResp?.skuName
              : detail.productTitle}
          </div>
          {detail?.gradeLevelGuide ? (
            <div className={S.grate}>适用于{detail?.gradeLevelGuide}</div>
          ) : null}
        </div>
      </div>
      {giftCourse?.length > 0 || giftGift?.length > 0 || giftEntity?.length > 0 ? (
        <div className={S.giftSkuWrap}>
          {giftCourse?.length > 0 && (
            <div className={S.giftItem}>
              <div className={S.title}>
                <div className={cx(S.labelIcon, S.courseIcon)} />
                赠课
              </div>
              <div className={S.giftContent}>
                {giftCourse?.map((item: any) => item?.skuShowName)?.join('、')}
              </div>
            </div>
          )}
          {giftGift?.length > 0 && (
            <div className={S.giftItem}>
              <div className={S.title}>
                <div className={cx(S.labelIcon, S.giftIcon)} />
                赠品
              </div>
              <div className={S.giftContent}>
                {giftGift?.map((item: any) => item?.skuShowName)?.join('、')}
              </div>
            </div>
          )}
          {giftEntity?.length > 0 && (
            <div className={S.giftItem}>
              <div className={S.title}>
                <div className={cx(S.labelIcon, S.entityIcon)} />
                实物
              </div>
              <div className={S.giftContent}>
                {giftEntity?.map((item: any) => item?.skuShowName)?.join('、')}
              </div>
            </div>
          )}
        </div>
      ) : null}
      {familyCardFlag ? (
        <div className={S.tagItem}>
          <div className={S.title}>
            <div className={cx(S.labelIcon, S.friendIcon)} />
            好友卡
          </div>
          <div className={S.tagContent}>限时送好友一个月课程</div>
        </div>
      ) : null}
    </div>
  );
};
