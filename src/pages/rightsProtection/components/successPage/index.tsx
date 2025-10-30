import { useEffect } from 'react';

import ClassIcon from '@/assets/images/jojo/rightsProtection/class.png';
import GiftIcon from '@/assets/images/jojo/rightsProtection/gift.png';
import Success from '@/assets/images/jojo/rightsProtection/success.png';
import { sensPageView } from '@/pages/rightsProtection/sensors';

import styles from './index.module.less';

const SuccessPage = (props: any) => {
  const { productName, headImageUrl, visible, classList, giftList } = props;

  const isEmpty = classList.length === 0 && giftList.length === 0;
  useEffect(() => {
    if (visible) {
      sensPageView({ $title: '成功页' });
    }
  }, [visible]);

  return (
    <div className={styles['success-page']}>
      <div className={styles['success-page-header']}>
        <img src={Success} className={styles['success-page-header-img']} alt='' />
        <div className={styles['success-page-header-title']}>赠品升级成功</div>
      </div>
      <div className={styles['success-page-content']}>
        <div className={styles['success-page-content-warpper']}>
          <div className={styles['success-page-content-main']}>
            <img
              src={
                headImageUrl ||
                'https://jojostorage.oss-cn-hangzhou.aliyuncs.com/uc/userDefaultHeadImg.png'
              }
              alt=''
              className={styles['success-page-content-main-img']}
            />
            <div className={styles['success-page-content-main-info']}>
              <div className={styles['success-page-content-main-name']}>
                {productName ||
                  '阅读全年系统包-5阶阅读全年系统包-5阶阅读全年系统包-5阶阅读全年系统包-5阶'}
              </div>
            </div>
          </div>

          <div className={styles['order-gift']}>
            <div className={styles['gift-title']}>
              <div className={styles.line} />
              <div className={styles.text}>新赠品</div>
            </div>
            <div className={styles['gift-container']}>
              {isEmpty ? (
                <div className={styles['no-gift']}>暂无赠品</div>
              ) : (
                <>
                  {classList.length > 0 && (
                    <div className={styles['class-gift']}>
                      <div className={styles['class-icon']}>
                        <img src={ClassIcon} alt='' className={styles['class-img']} />
                        <div className={styles['class-text']}>赠课</div>
                      </div>

                      {classList.map((item: any) => {
                        return (
                          <div className={styles['gift-item']} key={item?.skuId}>
                            <img src={item?.skuImageUrl} alt='' className={styles['gift-img']} />
                            <div className={styles['gift-name']}>{item?.skuName}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {giftList.length > 0 && (
                    <div className={styles['product-gift']}>
                      <div className={styles['product-icon']}>
                        <img src={GiftIcon} alt='' className={styles['product-img']} />
                        <div className={styles['product-text']}>赠品</div>
                      </div>
                      {giftList.map((item: any) => {
                        return (
                          <div className={styles['gift-item']} key={item?.skuId}>
                            <img src={item?.skuImageUrl} alt='' className={styles['gift-img']} />
                            <div className={styles['gift-name']}>{item?.skuName}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
