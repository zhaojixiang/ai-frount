import classnames from 'classnames';
import React, { useEffect } from 'react';

// import { sensElementView } from '@/utils/sensors';
import styles from './index.module.less';

const PurchaseWay = (props: {
  skuDetail: any;
  subscribeType: string | number;
  onChoose: (type: string, way: string) => void;
}) => {
  const { skuDetail, subscribeType, onChoose } = props;

  const handleClick = (type: string) => {
    if (skuDetail.existActivated) {
      JOJO.toast.show({
        content: '您已激活该商品，不可选择订阅',
        icon: 'fail'
      });
      return;
    }
    if (skuDetail.isOnArgument) {
      JOJO.toast.show({
        content: '您已订阅该商品',
        icon: 'fail'
      });
      return;
    }
    if (skuDetail.preSubscriptionType && skuDetail.preSubscriptionType !== type) {
      JOJO.toast.show({
        content: '暂不支持该订阅模式',
        icon: 'fail'
      });
      return;
    }
    onChoose('subscribe', type);
  };

  /**
   * 渲染订阅说明
   * @returns {JSX.Element}
   */
  const renderSubscribeDescription = () => {
    if (!subscribeType || !skuDetail.subscriptionList) return '';
    const description = skuDetail.subscriptionList.filter(
      (el: any) => el.subscriptionType === subscribeType
    )[0].subscriptionInstruction;
    return <div className={styles.subscribeDescription}>{description}</div>;
  };

  const renderLabel = ({ type, index, disabled }: any) => {
    if (type === 'subscription') {
      if (disabled) return null;
      if (!index) {
        return <div className={styles.recommandText}>推荐</div>;
      }
    }

    return null;
  };

  /**
   * 订阅命中立减
   */
  const renderSkuPrice = (item: any) => {
    const { cost, discountedPrice } = item;
    if (discountedPrice < cost) {
      return discountedPrice;
    }
    return cost;
  };

  const { subscriptionList, preSubscriptionType, isOnArgument, existActivated } = skuDetail;

  useEffect(() => {
    if (subscriptionList?.length) {
      // sensElementView({
      //   $element_name: '促销订阅方式曝光',
      //   sku_id: skuDetail?.id || ''
      // });
    }
  }, [subscriptionList]);

  return subscriptionList?.length ? (
    <>
      <div className={styles.title}>选择购买方式</div>
      <div className={styles.subscribeWp}>
        {subscriptionList &&
          subscriptionList.map((item: any, index: number) => {
            const { averagePrice, subscriptionType } = item;
            const isActive = subscribeType === subscriptionType;
            // 禁用
            const disabled =
              (preSubscriptionType && preSubscriptionType !== subscriptionType) ||
              existActivated ||
              isOnArgument;
            return (
              <div
                className={classnames(
                  styles.item,
                  isActive ? styles.active : '',
                  disabled ? styles.disabled : ''
                )}
                key={item.id}
                onClick={() => handleClick(subscriptionType)}>
                <div className={styles.payWayTitle}>包季</div>
                <div className={styles.byStagePriceContainer}>
                  <span className={styles.byStagePriceLabel}>￥</span>
                  <span className={styles.byStagePrice}>{renderSkuPrice(item)}</span>
                </div>
                <div className={styles.detailContainer}>
                  {![1, 3].includes(subscriptionType) && averagePrice ? (
                    <span className={styles.monthPrice}>折合¥{averagePrice}/月</span>
                  ) : null}
                  {disabled ? (
                    <span className={styles.nextPrice}>
                      不可购买
                      <span className={styles.tipIcon} />
                    </span>
                  ) : null}
                </div>

                {renderLabel({
                  type: 'subscription',
                  index,
                  disabled
                })}
              </div>
            );
          })}
      </div>
      {renderSubscribeDescription()}
    </>
  ) : null;
};

export default PurchaseWay;
