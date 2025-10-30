import { Toast } from 'antd-mobile';
import cx from 'classnames';
import { cloneDeep } from 'lodash-es';
import { useEffect, useState } from 'react';

import ClassIcon from '@/assets/images/jojo/rightsProtection/class.png';
import Empty from '@/assets/images/jojo/rightsProtection/empty.png';
import GiftIcon from '@/assets/images/jojo/rightsProtection/gift.png';
import SelectedIcon from '@/assets/images/jojo/rightsProtection/selected.png';
import UnselectIcon from '@/assets/images/jojo/rightsProtection/unselect.png';

import type { GiftPool, GiftSku } from '../../detail';
import styles from './index.module.less';

const ChoiceGift = (props: any) => {
  const {
    giftPoolsType,
    normalList = [],
    choiceList = [],
    onUserHandleClick,
    choicesChoiceData
  } = props;

  // 普通赠品奖池
  const [normalPools, setNormalPools] = useState<any>({
    normalClassList: [],
    normalGiftList: []
  });
  // M选N赠品奖池
  const [choicePools, setChoicePools] = useState<any>([]);

  const onHanldeClick = (poolId: number, skuId: number, needAddress: boolean) => {
    const newlist = cloneDeep(choicesChoiceData);
    const isEditeItem = newlist?.find((item: GiftPool) => item.poolId === poolId) ?? {};
    if (!Array.isArray(isEditeItem?.skuIds) || isEditeItem.length === 0) {
      Toast.show({
        content: '出错了，请重试',
        duration: 2000
      });
      return;
    }

    const skuIndex = isEditeItem.skuIds.indexOf(skuId);

    if (skuIndex !== -1) {
      // 如果 skuId 已存在，移除它
      isEditeItem.skuIds.splice(skuIndex, 1);
    } else {
      // 如果 skuId 不存在，检查是否超过 giftOptionalNum 限制
      if (isEditeItem.skuIds.length < isEditeItem.giftOptionalNum) {
        isEditeItem.skuIds.push(skuId);
      } else {
        Toast.show({
          content: `最多只能选择 ${isEditeItem.giftOptionalNum} 个赠品`,
          duration: 2000
        });
        return;
      }
    }
    isEditeItem.needAddress = needAddress;
    onUserHandleClick({
      normalData: [],
      choicesData: newlist
    });
  };

  useEffect(() => {
    const normalChoiceData: any = [];
    const defaultChoiceData: any = [];

    if (Array.isArray(normalList) && normalList.length > 0) {
      // 遍历所有赠品池
      normalList?.forEach((poolItem) => {
        const isneedAddress =
          poolItem?.giftSkus?.some((skusItem: GiftSku) => skusItem?.skuType === 'ENTITY') || false;
        normalChoiceData.push({
          poolId: poolItem?.poolId,
          skuIds: poolItem?.giftSkus
            ?.filter((skusItem: GiftSku) => skusItem?.giftMaxNum - skusItem?.giftUsedNum > 0)
            ?.map((skusItem: GiftSku) => skusItem?.skuId)
            ?.filter((skuId: GiftSku) => skuId !== undefined),
          needAddress: isneedAddress
        });
      });

      // 遍历所有奖品池与奖品SKU
      const flatGiftSkus = normalList.flatMap((pool) => pool.giftSkus);
      // 获取赠课奖池list
      const normalClassList = flatGiftSkus.filter((sku) => sku.resourcePlatform === 1);
      // 获取赠品奖池list
      const normalGiftList = flatGiftSkus.filter((sku) => sku.resourcePlatform !== 1);

      setNormalPools({
        normalClassList,
        normalGiftList
      });
    }
    if (Array.isArray(choiceList) && choiceList.length > 0) {
      choiceList?.forEach((poolItem) => {
        defaultChoiceData.push({
          poolId: poolItem?.poolId,
          skuIds: [],
          giftOptionalNum: poolItem?.giftOptionalNum,
          needAddress: false
        });
      });
      setChoicePools(choiceList);
    }

    onUserHandleClick({
      normalData: normalChoiceData,
      choicesData: defaultChoiceData
    });
  }, [normalList, choiceList, onUserHandleClick]);

  const { normalClassList, normalGiftList } = normalPools;

  return (
    <div className={styles['choice-gift-container']}>
      {/* 普通奖池用户选择 */}
      {giftPoolsType !== 'CHOICES_GIFT' ? (
        <>
          <div className={styles['choice-class']} key='normal-choice-class'>
            {normalClassList.length > 0 && (
              <div className={styles['choice-class-header']} key='normal-choice-class-header'>
                <img src={ClassIcon} alt='' className={styles['choice-class-icon']} />
                <div className={styles['choice-class-title']}>赠课</div>
              </div>
            )}
            <div className={styles['choice-list']} key='normal-choice-class-list'>
              {normalClassList?.map((item: GiftSku) => {
                let isEmpty = item?.giftMaxNum - item?.giftUsedNum <= 0;
                if (item.giftMaxNum === null) {
                  isEmpty = false;
                }

                return (
                  <div className={styles['choice-item']} key={item?.skuId}>
                    <div className={styles['choice-item-img-container']}>
                      <img src={item?.skuImageUrl} alt='' className={styles['choice-item-img']} />
                      {isEmpty && <img src={Empty} alt='' className={styles['empty-icon']} />}
                    </div>
                    <div className={styles['choice-item-name']}>{item?.skuName}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles['choice-gift']} key='normal-choice-gift'>
            {normalGiftList.length > 0 && (
              <div className={styles['choice-gift-header']} key='normal-choice-gift-header'>
                <img src={GiftIcon} alt='' className={styles['choice-gift-icon']} />
                <div className={styles['choice-gift-title']}>赠品</div>
              </div>
            )}
            <div className={styles['choice-list']} key='normal-choice-gift-list'>
              {normalGiftList?.map((item: GiftSku) => {
                let isEmpty = item?.giftMaxNum - item?.giftUsedNum <= 0;
                if (item.giftMaxNum === null) {
                  isEmpty = false;
                }
                return (
                  <div className={styles['choice-item']} key={item?.skuId}>
                    <div className={styles['choice-item-img-container']}>
                      <img src={item?.skuImageUrl} alt='' className={styles['choice-item-img']} />
                      {isEmpty && <img src={Empty} alt='' className={styles['empty-icon']} />}
                    </div>
                    <div className={styles['choice-item-name']}>{item?.skuName}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
      {/* M选N奖池用户选择 */}
      {giftPoolsType !== 'NORMAL_GIFT' ? (
        <>
          {choicePools?.map((poolItem: any) => {
            const { giftSkus = [] } = poolItem;
            const editItem = choicesChoiceData.find((item: any) => item.poolId === poolItem.poolId);
            const selectedSkuIds = editItem?.skuIds || [];
            return (
              <>
                <div
                  className={cx(
                    styles['choice-class'],
                    giftPoolsType !== 'NORMAL_GIFT' && styles['choice-class-mix']
                  )}
                  key={poolItem.poolId}>
                  {giftSkus?.length > 0 && (
                    <div className={styles['choice-class-header']} key='mn-choice-class-header'>
                      <img src={ClassIcon} alt='' className={styles['choice-class-icon']} />
                      <div className={styles['choice-class-title']}>{poolItem?.poolName}</div>
                      <div
                        className={
                          styles['choice-class-tip']
                        }>{`可选择${poolItem?.giftOptionalNum}件`}</div>
                    </div>
                  )}

                  <div className={styles['choice-list']} key={'mn-choice-class-list'}>
                    {giftSkus?.map((item: GiftSku) => {
                      let isEmpty = item?.giftMaxNum - item?.giftUsedNum <= 0;
                      if (item.giftMaxNum === null) {
                        isEmpty = false;
                      }
                      const Selected = selectedSkuIds.includes(item?.skuId);
                      return (
                        <div
                          className={cx(styles['choice-item'], Selected && styles['selected'])}
                          key={item?.skuId}
                          onClick={() => {
                            if (isEmpty) {
                              return;
                            }
                            onHanldeClick(poolItem.poolId, item.skuId, item.skuType === 'ENTITY');
                          }}>
                          <div className={styles['choice-item-img-container']}>
                            <img
                              src={item?.skuImageUrl}
                              alt=''
                              className={styles['choice-item-img']}
                            />
                            {!isEmpty && (
                              <img
                                src={Selected ? SelectedIcon : UnselectIcon}
                                className={styles['select-icon']}
                              />
                            )}
                            {isEmpty && <img src={Empty} alt='' className={styles['empty-icon']} />}
                          </div>
                          <div className={styles['choice-item-name']}>{item?.skuName}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* <div className={styles['choice-gift']}>
                  {choiceGiftList.length > 0 && (
                    <div className={styles['choice-gift-header']}>
                      <img src={GiftIcon} alt='' className={styles['choice-gift-icon']} />
                      <div className={styles['choice-gift-title']}>
                        {choicePools.length > 1 ? poolItem?.poolName : '赠品'}
                      </div>
                      {choiceClassList.length === 0 && (
                        <div
                          className={
                            styles['choice-gift-tip']
                          }>{`可选择${poolItem?.giftOptionalNum}件`}</div>
                      )}
                    </div>
                  )}

                  <div className={styles['choice-list']}>
                    {choiceGiftList?.map((item) => {
                      const isEmpty = item?.giftMaxNum - item?.giftUsedNum <= 0;
                      const Selected = selectedSkuIds.includes(item?.skuId);
                      return (
                        <div
                          className={cx(styles['choice-item'], Selected && styles['selected'])}
                          key={item?.skuId}
                          onClick={() => {
                            onHanldeClick(poolItem.poolId, item.skuId, item.skuType === 'ENTITY');
                          }}>
                          <div className={styles['choice-item-img-container']}>
                            <img
                              src={item?.skuImageUrl}
                              alt=''
                              className={styles['choice-item-img']}
                            />
                            {!isEmpty && (
                              <img
                                src={Selected ? SelectedIcon : UnselectIcon}
                                className={styles['select-icon']}
                              />
                            )}
                            {isEmpty && <img src={Empty} alt='' className={styles['empty-icon']} />}
                          </div>
                          <div className={styles['choice-item-name']}>{item?.skuName}</div>
                        </div>
                      );
                    })}
                  </div>
                </div> */}
              </>
            );
          })}
        </>
      ) : null}
    </div>
  );
};
export default ChoiceGift;
