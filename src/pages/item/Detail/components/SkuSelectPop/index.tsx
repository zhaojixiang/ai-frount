import { Button, Popup } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import cx from 'classnames';
import { cloneDeep, isEmpty } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';

import Check from '@/components/Check';
import FixBottom from '@/components/FixBottom';
import Image from '@/components/Image';
import { divide, subtract } from '@/lib/utils/mathUtils';

import type { SkuSaleResp } from '../../type';
// import { sensClickInitiative } from '@/utils/sensors';
import { calculatePrice, validateSkuCanBuy } from '../../utils';
import PurchaseWay from '../PurchaseWay';
import S from './index.module.less';

interface IProps {
  visible: boolean;
  skuDetail: any;
  couponInfo: any;
  pageData: any;
  onClose: () => void;
  onSkuChange: (sku: any) => void;
  onOk: (params: any) => void;
}

export default function SkuSelectPop(props: IProps) {
  const { visible, couponInfo, skuDetail = {}, pageData = {}, onClose, onOk, onSkuChange } = props;
  const { skuList, imageUrls, learningPay, productTitle, giftPools, currencyType } = pageData || {};
  const [curSubscribeType, setCurSubScribeType] = useState<number | string>('');
  const [buyNum, setBuyNum] = useState(1);
  const [checkList, setCheckList] = useState<any>({});
  const [isEnough, setIsEnough] = useState<any>(false);

  const curPriceRef = useRef<any>(0); // 存储当前价格，用于下单时校验是否有更优惠的价格

  useEffect(() => {
    if (visible) {
      // 仅支持订阅 且 未选择订阅模式 时 默认选中订阅模式第一项
      if (!curSubscribeType && skuDetail?.subscriptionList && skuDetail.onlyRenewPay) {
        setCurSubScribeType(skuDetail?.subscriptionList[0]?.subscriptionType);
      }
    }
  }, [visible]);

  useEffect(() => {
    let isVerify = true;
    if (giftPools?.length) {
      giftPools?.forEach((item: any) => {
        if (checkList?.[item.poolId]?.length !== item?.giftOptionalNum) {
          isVerify = false;
        }
      });
    }
    setIsEnough(isVerify);
  }, [checkList, giftPools]);

  /**
   * 确认选择
   */
  const handleOk = () => {
    let isVerify = true;
    giftPools?.forEach((item: any) => {
      if (checkList?.[item.poolId]?.length !== item?.giftOptionalNum) {
        isVerify = false;
      }
    });

    if (!isVerify) {
      JOJO.toast.show({
        content: '还没选够赠品哦',
        icon: 'fail'
      });
      return;
    }

    const giftSkus = Object.entries(checkList).map(([poolId, skuIds]) => ({
      poolId,
      skuIds
    }));

    const params = {
      buyNum,
      curPrice: curPriceRef.current,
      curSubscribeType,
      giftPools: encodeURIComponent(JSON.stringify(giftSkus) || '[]')
    };
    onOk(params);
  };

  /**
   * 赠品
   */
  const handleGiftItem = (item: any, it: any) => {
    // 售完了
    if (it?.soldOut) {
      return;
    }
    // 多选时：已经选够了，继续选择
    if (
      item?.giftOptionalNum > 1 &&
      (checkList?.[item.poolId]?.length || 0) === item?.giftOptionalNum &&
      !checkList?.[item.poolId]?.includes(it.skuId)
    ) {
      return;
    }
    const selectList = cloneDeep(checkList);
    const parentId = item?.poolId;
    const childId = it?.skuId;

    // sensClickInitiative({
    //   $element_name: '促销商品详情页_赠品选择',
    //   $element_content: it?.skuName,
    //   sku_id: childId || ''
    // });

    // 单选
    if (item?.giftOptionalNum === 1) {
      setCheckList({
        ...(checkList || {}),
        [parentId]: [childId]
      });
    } else {
      // 多选
      if (selectList?.[parentId]?.includes(childId)) {
        const innerList = selectList?.[parentId]?.filter((i: any) => i !== childId);
        setCheckList({
          ...(checkList || {}),
          [parentId]: innerList
        });
      } else {
        if (!selectList?.[parentId]) {
          selectList[parentId] = [childId];
        } else {
          selectList?.[parentId].push(childId);
        }
        setCheckList({
          ...(checkList || {}),
          [parentId]: selectList?.[parentId]
        });
      }
    }
  };

  /**
   * 渲染购买方式图标
   */
  const renderPriceLabel = useCallback(
    (price: number) => {
      if (currencyType === 'USD') {
        return `USD $${price}`;
      } else {
        return `￥${price}`;
      }
    },
    [currencyType]
  );

  /**
   * 渲染购买数量
   */
  // const renderMaxNumber = useCallback(() => {
  //   if (skuDetail?.stock) return 1;
  //   return 0;
  // }, [skuDetail]);

  /**
   * 计算当前价格
   * @returns
   */
  const countCurPrice = (item: any) => {
    const { subscriptionList, hasFirstDiscounts, price } = item || {};
    if (subscriptionList?.length) {
      // 订阅
      const sku = subscriptionList?.filter(
        (el: any) => el.subscriptionType === curSubscribeType
      )?.[0];
      const { cost, firstCost } = sku;
      // 原价
      const originPrice = hasFirstDiscounts ? firstCost : cost;
      // 当前价
      let resPrice: any = originPrice;

      // 订阅命中优惠券
      if (originPrice && !isEmpty(couponInfo)) {
        if (divide(couponInfo?.threshold || 0, 100) <= originPrice) {
          resPrice = calculatePrice(Number(originPrice), divide(couponInfo?.amount || 0, 100));
        }
      }

      // 订阅命中立减
      const { discountedPrice } = sku;
      if (discountedPrice < originPrice) {
        // 立减金
        const discount = subtract(originPrice, discountedPrice);
        resPrice = subtract(resPrice, discount);
      }

      return resPrice < 0 ? 0 : resPrice;
    } else {
      // 普通购买
      const { promotionPrice } = item || {};

      // 原价
      const originPrice: any = price;
      // 当前价
      let resPrice: any = originPrice;

      // 命中优惠券
      if (originPrice && !isEmpty(couponInfo)) {
        if (divide(couponInfo?.threshold || 0, 100) <= originPrice) {
          resPrice = calculatePrice(Number(originPrice), divide(couponInfo?.amount || 0, 100));
        }
      }

      // 命中立减
      if ((promotionPrice || promotionPrice === 0) && promotionPrice !== originPrice) {
        // 立减金
        const discount = subtract(originPrice, promotionPrice);
        resPrice = subtract(resPrice, discount);
      }

      return resPrice < 0 ? 0 : resPrice;
    }
  };

  /**
   * 计算原价
   */
  const countOriginPrice = useCallback(() => {
    const { subscriptionList, hasFirstDiscounts, price } = skuDetail || {};
    let curPrice = price;
    if (curSubscribeType) {
      const sku = subscriptionList?.filter(
        (el: any) => el.subscriptionType === curSubscribeType
      )?.[0];
      const { cost, firstCost } = sku;
      curPrice = hasFirstDiscounts ? firstCost : cost;
    } else {
      curPrice = price;
    }
    return curPrice;
  }, [curSubscribeType, skuDetail]);

  /**
   * 抽屉中显示的价格
   */
  const renderSkuPrice = useCallback(() => {
    return (
      <div className={S.skuPriceWrap}>
        <div className={S.nowPrice}>{renderPriceLabel(countCurPrice(skuDetail))}</div>
        <div className={S.original}>原价{renderPriceLabel(countOriginPrice())}</div>
      </div>
    );
  }, [skuDetail, countOriginPrice, renderPriceLabel]);

  /**
   * 弹窗底部按钮
   */
  const renderBottomZoom = () => {
    if (!skuDetail?.id) {
      return (
        <div className={S.confirmZone}>
          <Button shape='rounded' className={cx(S.confirmText, S.disabled)}>
            请选择商品
          </Button>
        </div>
      );
    }
    if (!skuDetail?.stock) {
      return (
        <div className={S.confirmZone}>
          <Button shape='rounded' className={cx(S.confirmText, S.disabled)}>
            已售罄
          </Button>
        </div>
      );
    } else {
      return (
        <div className={S.confirmZone}>
          <Button
            shape='rounded'
            className={cx(S.confirmText, !isEnough && S.disabled)}
            onClick={async () => {
              handleOk();
            }}>
            {learningPay ? '0元签约' : '确定'}
          </Button>
        </div>
      );
    }
  };

  /**
   * 选择购买方式
   */
  const onPurchaseWayChoose = useCallback((way: string, type: string) => {
    // sensClickInitiative({
    //   $element_name: '促销订阅方式选择',
    //   $element_content: '订阅',
    //   sku_id: skuDetail?.id || ''
    // });
    if (way === 'subscribe') {
      setCurSubScribeType(type);
    } else if (way === 'subsectionMode') {
      setCurSubScribeType('');
    } else {
      setCurSubScribeType('');
    }
  }, []);

  return (
    <Popup
      bodyStyle={{
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        maxHeight: '77vh'
      }}
      visible={visible}
      closeOnMaskClick
      onClose={() => {
        onClose?.();
        if (!buyNum) {
          setBuyNum(1);
        }
      }}>
      <div className={S.actionContent}>
        <CloseOutline className={S.closeIcon} onClick={onClose} />
        <div className={S.skuDetailWrap}>
          <div className={S.skuDetail_Left}>
            <Image className={S.skuImage} alt='' src={skuDetail.imageUrl || imageUrls?.[0]} />
            <div className={S.titleWrap}>
              <div className={S.productTitle}>{skuDetail?.skuName || productTitle}</div>
              {skuDetail?.gradeLevelGuide ? (
                <div className={S.productTag}>适用于{skuDetail?.gradeLevelGuide}</div>
              ) : null}
            </div>
          </div>

          {skuDetail.id && skuList?.length > 1 ? (
            <div className={S.skuPrice}>{renderSkuPrice()}</div>
          ) : null}
        </div>
        <div className={S.selectZone}>
          <div className={S.title}>请选择商品</div>
          <div className={S.itemWp}>
            {skuList?.map((item: SkuSaleResp) => {
              let disabled = false;
              // 订阅是否禁用
              disabled = (item.existActivated || item.isOnArgument) && item.onlyRenewPay;
              if (
                !disabled &&
                item?.subscriptionList &&
                item.preSubscriptionType &&
                item.onlyRenewPay
              ) {
                disabled = !item?.subscriptionList.some(
                  (el: any) => el.subscriptionType === item.preSubscriptionType
                );
              }

              const isActive = item.id === skuDetail.id;
              return (
                <div
                  className={cx(S.item, disabled && S.disabled)}
                  key={item.id}
                  onClick={() => {
                    const newItem = item;
                    const { canBuy, nextSubscribeType } = validateSkuCanBuy(newItem);
                    // sensClickInitiative({
                    //   $element_name: '促销商品详情页_SKU选择抽屉_选择商品',
                    //   $element_content: item.skuName,
                    //   sku_id: item.id
                    // });

                    if (canBuy || nextSubscribeType) {
                      setCurSubScribeType(nextSubscribeType);
                      onSkuChange(newItem);
                      const { stock } = item;
                      if (buyNum >= stock) {
                        setBuyNum(stock || 1);
                      }
                    }
                  }}>
                  {item.skuName}
                  {isActive ? <Check check={true} className={S.check} /> : null}
                </div>
              );
            })}
          </div>
          {/* 自选赠品 */}
          {giftPools?.length > 0 && (
            <div className={S.giftWp}>
              {/* <div className={S.title}>
                选择赠品
                {giftPools?.length === 1
                  ? `（可选
              ${giftPools?.[0]?.giftOptionalNum}个）`
                  : ''}
              </div> */}
              {giftPools?.map((item: any) => {
                return (
                  <div className={S.giftCategoryItem} key={item?.poolId}>
                    <div className={S.categoryTitle}>
                      <span className={S.categoryName}>{item?.poolName}</span>请选
                      {item?.giftOptionalNum}件
                    </div>

                    <div className={S.giftWrap}>
                      {item?.giftSkus?.map((it: any, idx: number) => {
                        return (
                          <div
                            className={cx(
                              S.giftItem,
                              checkList?.[item.poolId]?.includes(it.skuId) && S.active,
                              it.soldOut && S.disabled
                            )}
                            key={idx}
                            onClick={() => handleGiftItem(item, it)}>
                            <div
                              className={S.giftImg}
                              style={{ backgroundImage: `url(${it?.imageUrl})` }}
                            />
                            <div className={S.giftName}>{it?.skuName}</div>
                            {/* 可选逻辑： 未抢光 && （未选够 || 选够了但包含该赠品 || 只可选一个） */}
                            {!it.soldOut &&
                            ((checkList?.[item.poolId]?.length || 0) < item?.giftOptionalNum ||
                              ((checkList?.[item.poolId]?.length || 0) === item?.giftOptionalNum &&
                                checkList?.[item.poolId]?.includes(it.skuId)) ||
                              item?.giftOptionalNum === 1) ? (
                              <>
                                {item?.giftOptionalNum === 1 ? (
                                  <>
                                    {checkList?.[item.poolId]?.includes(it.skuId) ? (
                                      <div className={cx(S.icon, S.selectedIcon)} />
                                    ) : (
                                      <div className={cx(S.icon, S.unSelectedIcon)} />
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {checkList?.[item.poolId]?.includes(it.skuId) ? (
                                      <div className={cx(S.icon, S.mSelectedIcon)} />
                                    ) : (
                                      <div className={cx(S.icon, S.mUnSelectedIcon)} />
                                    )}
                                  </>
                                )}
                              </>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 选择购买方式 */}
          <PurchaseWay
            skuDetail={skuDetail}
            subscribeType={curSubscribeType}
            onChoose={onPurchaseWayChoose}
          />
        </div>

        <FixBottom className={S.bottomZone}>{renderBottomZoom()}</FixBottom>
      </div>
    </Popup>
  );
}
