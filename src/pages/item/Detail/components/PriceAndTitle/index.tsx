import cx from 'classnames';
import { isEmpty } from 'lodash-es';
import { useCallback, useMemo, useRef, useState } from 'react';

// import WxShare from '@/lib/share/wxShare';
import { divide, subtract } from '@/lib/utils/mathUtils';

import S from './index.module.less';

// TODO: 用户折扣
export default function PriceAndTitle(props: any) {
  const { pageData, coupon, isLogin, onHandleShare } = props;
  const { tieredPriceFlag, currencyType, skuList, learningPay } = pageData || {};
  // 用户折扣
  const [userDiscount, setUserDiscount] = useState<any>({
    coupon: 0,
    discount: 0
  });
  const userDiscountRef = useRef<any>({
    coupon: 0,
    discount: 0
  });
  // 当前价格(记录当前价格，用于价格比对)
  const curPriceRef = useRef<any>(0);

  /**
   * 计算券后价
   * @param price 原价
   * @param discount 优惠金额
   * @returns 券后价
   */
  const calculateAdjustedPrice = (price: number, discount: number): string => {
    const adjustedPrice = subtract(price, discount || 0);
    return adjustedPrice.toString().replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1');
  };
  /**
   * 计算原价
   */
  const countOriginPrice = (item: any) => {
    const { subscriptionList, price } = item || {};
    if (subscriptionList?.length) {
      // 订阅原价
      const sku = subscriptionList[0];
      const { cost } = sku;
      return cost;
    } else {
      // 普通购买原价
      return price;
    }
  };
  /**
   * 渲染价格前缀
   * @returns 价格前缀
   */
  const renderPriceLabel = () => {
    if (currencyType === 'USD') {
      return 'USD $';
    } else {
      return '￥';
    }
  };

  /**
   * 是否显示订阅标签 （季订）
   */
  const showSubScribeTag = useMemo(() => {
    return skuList?.some((item: any) => {
      if (item?.subscriptionList?.length) {
        return item?.subscriptionList?.some((el: any) => {
          return el?.subscriptionType === 2;
        });
      } else {
        return false;
      }
    });
  }, [skuList]);

  /**
   * 计算当前价格
   * @returns
   */
  const countCurPrice = useCallback(
    (item: any) => {
      let alreadyOverlayCoupon = false;
      if (userDiscountRef.current?.coupon > 0 && userDiscountRef.current?.discount > 0) {
        alreadyOverlayCoupon = true;
      }

      const { subscriptionList, hasFirstDiscounts, price } = item || {};
      if (subscriptionList?.length) {
        // 订阅
        const sku = subscriptionList[0];
        const { cost, firstCost } = sku;
        // 原价
        const originPrice = hasFirstDiscounts ? firstCost : cost;
        // 当前价
        let resPrice: any = originPrice;

        // 订阅命中优惠券
        if (originPrice && !isEmpty(coupon)) {
          if (divide(coupon?.threshold || 0, 100) <= originPrice) {
            const couponDiscount = divide(coupon?.amount || 0, 100);
            resPrice = calculateAdjustedPrice(Number(originPrice), Number(couponDiscount));

            if (!alreadyOverlayCoupon) {
              userDiscountRef.current = {
                ...userDiscountRef.current,
                coupon: couponDiscount
              };
            }
          }
        }

        // 订阅命中立减
        const { discountedPrice } = sku;
        if (discountedPrice < originPrice) {
          // 立减金
          const discount = subtract(originPrice, discountedPrice);
          resPrice = subtract(resPrice, discount);
          if (!alreadyOverlayCoupon) {
            userDiscountRef.current = {
              ...userDiscountRef.current,
              discount
            };
          }
        }
        setUserDiscount(userDiscountRef.current);
        return resPrice < 0 ? 0 : resPrice;
      } else {
        // 普通购买
        const { promotionPrice } = item || {};

        // 原价：
        const originPrice: any = price;
        // 当前价
        let resPrice: any = originPrice;

        // 命中优惠券
        if (originPrice && !isEmpty(coupon)) {
          if (divide(coupon?.threshold || 0, 100) <= originPrice) {
            const couponDiscount = divide(coupon?.amount || 0, 100);
            resPrice = calculateAdjustedPrice(Number(originPrice), Number(couponDiscount));

            if (!alreadyOverlayCoupon) {
              userDiscountRef.current = {
                ...userDiscountRef.current,
                coupon: couponDiscount
              };
            }
          }
        }

        // 命中立减
        if ((promotionPrice || promotionPrice === 0) && promotionPrice !== originPrice) {
          // 立减金
          const discount = subtract(originPrice, promotionPrice);
          resPrice = subtract(resPrice, discount);
          if (!alreadyOverlayCoupon) {
            userDiscountRef.current = {
              ...userDiscountRef.current,
              discount
            };
          }
        }
        setUserDiscount(userDiscountRef.current);
        return resPrice < 0 ? 0 : resPrice;
      }
    },
    [coupon]
  );
  /**
   * 计算优惠后价格区间（优惠叠加：优惠券 + 立减）
   */
  const renderPriceArea = useCallback(() => {
    // 原价列表
    let resOriginPriceList: any[] = (skuList || [])
      ?.map((item: any) => {
        return Number(countOriginPrice(item) || 0);
      })
      ?.sort((a: any, b: any) => +a - +b);
    resOriginPriceList = [...new Set(resOriginPriceList)];
    // 优惠后价格列表
    let resPriceList: any[] = (skuList || [])
      ?.map((item: any) => {
        return Number(countCurPrice(item) || 0);
      })
      ?.sort((a: any, b: any) => +a - +b);
    resPriceList = [...new Set(resPriceList)];

    if (resPriceList?.length > 1) {
      return `${resPriceList[0]}~${resPriceList[(resPriceList?.length || 0) - 1]}`;
    } else {
      return (
        <span>
          {resPriceList[0]}
          {resPriceList?.length === resOriginPriceList?.length &&
          resPriceList[0] !== resOriginPriceList[0] ? (
            <span className={S.original}>
              <span className={S.line} />
              原价{renderPriceLabel()}
              {resOriginPriceList[0]}
            </span>
          ) : null}
        </span>
      );
    }
  }, [skuList, countCurPrice]);
  /**
   * 价格渲染
   */
  const renderPrice = useMemo(() => {
    // 满足阶梯定价，用户未登录时，显示问号
    if (!isLogin && tieredPriceFlag) {
      return '？？？';
    }

    if (skuList?.length > 1) {
      // 多sku时只渲染优惠后的范围
      return renderPriceArea();
    } else {
      // 单sku时渲染  当前价格 | 原价
      curPriceRef.current = countCurPrice(skuList?.[0]);
      return (
        <span>
          {countCurPrice(skuList?.[0])}
          {countOriginPrice(skuList?.[0]) !== countCurPrice(skuList?.[0]) ? (
            <span className={S.original}>
              <span className={S.line} />
              原价{renderPriceLabel()}
              {countOriginPrice(skuList?.[0])}
            </span>
          ) : null}
        </span>
      );
    }
  }, [pageData, skuList, renderPriceArea]);

  return (
    <div className={S.priceContainer}>
      {/* 价格显示 */}
      <div className={S.priceZone}>
        <div>
          <div className={S.priceShow}>
            <div>
              <div className={S.price}>
                <div className={S.priceTextWrap}>
                  <span className={S.originPrice}>
                    <span className={S.priceSymbol}>{renderPriceLabel()}</span>
                    {renderPrice}
                  </span>
                </div>
              </div>
            </div>
            {currencyType === 'USD' && (
              <div>
                <div className={S.priceDesc}>
                  <span className={S.icon} />
                  实际价格可能因国家/地区税率差异略有浮动,请以支付页面为准
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 标题部分 */}
      <div className={cx(S.titleZone)}>
        {Number(userDiscount?.coupon || 0) > 0 && Number(userDiscount?.discount || 0) > 0 ? (
          <div className={S.tags}>
            <div className={S.tagItem}>
              <span className={S.couponIcon} />
              {coupon?.promotionTips?.[0]?.tip}{' '}
              {skuList?.length > 1 ? '' : `¥${userDiscount?.coupon}`}
            </div>
            <div className={S.line} />
            <div className={S.tagItem}>
              <span className={S.discountIcon} />
              {skuList?.[0]?.promotionTips?.[0]?.tip}{' '}
              {skuList?.length > 1 ? '' : `¥${userDiscount?.discount}`}
            </div>
          </div>
        ) : null}
        <div className={S.titleTextWp}>
          {learningPay ? <div className={S.payAfterTag}>先学后付</div> : null}

          {showSubScribeTag ? <div className={S.subscribe_tag}>季付</div> : null}

          <div className={S.titleText}>{pageData?.productTitle}</div>
          {currencyType !== 'USD' && (
            <div className={S.share} onClick={onHandleShare}>
              <div className={S.shareIcon}>分享</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
