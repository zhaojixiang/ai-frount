import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ClassIcon from '@/assets/images/jojo/rightsProtection/class.png';
import GiftIcon from '@/assets/images/jojo/rightsProtection/gift.png';
import WarnIcon from '@/assets/images/jojo/rightsProtection/warn.png';
import LoginBar from '@/components/LoginBar';
import StateHandler, { LoadStatus } from '@/components/StateHandler';
import {
  getOrderProduct,
  getOrderProtection,
  getOrderRules
} from '@/services/api/rightsProtection';

import ErrorPage from './components/errorPage';
import SuccessPage from './components/successPage';
import styles from './index.module.less';

export const creatName = (skus: SkuItem[]) => {
  const result = skus
    .map((sku) => sku.skuName) // 取出每个 skuName
    .filter((name) => name && name.trim() !== '') // 过滤空值（安全起见）
    .join('、');
  return result;
};
interface SkuItem {
  /** SKU ID */
  skuId: number;

  /** SKU 名称（真实名称） */
  skuName: string;

  /** 是否为赠品 */
  gift: boolean;

  /** 商品类型（字符串或数字，视实际使用而定） */
  goodsType: string | number;

  /** 关联课程 ID（可选） */
  courseId?: number;

  /** 多版本状态：NONE | UNSELECTED | SELECTED */
  multiVersionStatus: 'NONE' | 'UNSELECTED' | 'SELECTED';

  /** 可选的基础 SKU 列表（可选） */
  optionalBaseSkus?: any[] | null;
}

const RightsProtection = () => {
  const { orderId } = useParams();

  // 异常状态页面展示
  const [errorPageStatus, setErrorPageStatus] = useState({
    visible: false,
    text: '',
    type: 'error'
  });
  // 已保价页面展示
  const [successPageStatus, setSuccessPageStatus] = useState({
    visible: false
  });
  // 页面加载状态
  const [pageStatus, setPageStatus] = useState({
    status: LoadStatus.Success
  });
  // 是否已阅读并同意规则
  const [hasMakeSure, setHaseMakeSure] = useState(false);
  // 订单保障规则
  const [promotionData, setPromotionData] = useState({
    giftPoolsType: '',
    PromotionList: []
  });
  // 订单相关信息
  const [productData, setProductData] = useState({
    productId: 0,
    productName: '',
    headImageUrl: '',
    createTime: 0,
    classList: [],
    giftList: []
  });

  const getCurrentPromotionList = (discounts: any) => {
    let giftPoolsType = 'NORMAL_GIFT';
    // 获取到命中规则的奖池List
    const hitPromotionList = discounts.filter((item: any) => item.hitPromotion === true);
    if (hitPromotionList.length === 1) {
      giftPoolsType = hitPromotionList[0].giftStrategy;
    } else if (hitPromotionList.length > 1) {
      let hasNormal = false;
      let hasChoices = false;
      hitPromotionList.forEach((item: any) => {
        if (item.giftStrategy === 'NORMAL_GIFT') {
          hasNormal = true;
        }
        if (item.giftStrategy === 'CHOICES_GIFT') {
          hasChoices = true;
        }
      });
      if (hasNormal && hasChoices) {
        giftPoolsType = 'MIX_GIFT';
      }
      if (hasNormal && !hasChoices) {
        giftPoolsType = 'NORMAL_GIFT';
      }
      if (!hasNormal && hasChoices) {
        giftPoolsType = 'CHOICES_GIFT';
      }
    } else {
      setErrorPageStatus({
        visible: true,
        text: '获取订单保障规则失败',
        type: 'error'
      });
    }

    return {
      giftPoolsType,
      PromotionList: hitPromotionList
    };
  };

  //获取订单商品信息并处理整合
  const getCurrentProductList = (productList: any) => {
    // 获取到订单内容
    const targetProduct =
      productList.find((product: any) => product?.skus.some((sku: any) => sku.gift !== true)) ?? [];
    const { productId, productName, headImageUrl, skus } = targetProduct;
    // 获取非主品list
    const skuList = skus?.filter((sku: any) => sku.gift === true);
    // 获取赠课list
    const classList = skuList?.filter((sku: any) => sku.resourcePlatform === 1);
    // 获取赠品list
    const giftList = skuList?.filter((sku: any) => sku.resourcePlatform !== 1);
    return {
      productId,
      productName,
      headImageUrl,
      classList,
      giftList
    };
  };

  // 生成name字符串

  const initPage = async (oId: string) => {
    try {
      const OrderProtectionRes = await getOrderProtection({ orderId: oId });
      const { resultCode, data } = OrderProtectionRes || {};
      if (resultCode === 200 && data) {
        const {
          status,
          createTime,
          priceProtectPromotion = {} // 价保的促销信息
        } = data;
        const { promotionId, promotionVersion, matchCondition } = priceProtectPromotion;
        const { matchSkuList = [], productId, matchedRuleTime } = matchCondition || {};
        const [ruleRes, productRes] = await Promise.all([
          getOrderRules({
            promotionId,
            promotionVersion,
            skuList: JSON.stringify(matchSkuList),
            productId,
            matchedRuleTime
          }),
          getOrderProduct({ orderId: oId })
        ]);

        const { resultCode: ruleCode, data: ruleData } = ruleRes || {};
        if (ruleCode === 200 && ruleData) {
          const { skuDiscounts } = ruleData;
          const proData = getCurrentPromotionList(skuDiscounts);
          setPromotionData(proData);
        } else {
          setErrorPageStatus({
            visible: true,
            text: '获取订单保障规则失败',
            type: 'error'
          });
          setPageStatus({
            status: LoadStatus.Success
          });
          return;
        }
        const { resultCode: productCode, data: productdata } = productRes || {};
        if (productCode === 200 && productdata) {
          const { products } = productdata;
          const productItem = getCurrentProductList(products);
          setProductData({ productItem, ...createTime });
        } else {
          setErrorPageStatus({
            visible: true,
            text: '获取订单信息出错',
            type: 'error'
          });
          setPageStatus({
            status: LoadStatus.Success
          });
          return;
        }
        setPageStatus({
          status: LoadStatus.Success
        });

        if (status === 'FINISHED') {
          setSuccessPageStatus({
            visible: true
          });
          setPageStatus({
            status: LoadStatus.Success
          });
        }
      } else {
        setErrorPageStatus({
          visible: true,
          text: data?.errorMsg || '获取订单保障信息失败',
          type: 'error'
        });
        setPageStatus({
          status: LoadStatus.Success
        });
      }
    } catch (error) {
      console.log(error, 'i am what');
    }
  };

  useEffect(() => {
    if (!orderId) {
      setErrorPageStatus({
        visible: true,
        text: '订单号不能为空',
        type: 'error'
      });
      return;
    }
    // initPage(orderId);
  }, [orderId]);

  if (successPageStatus.visible) {
    return <SuccessPage {...productData} />;
  }

  if (errorPageStatus.visible) {
    return <ErrorPage {...errorPageStatus} />;
  }

  const { classList, giftList } = productData;

  const isEmpty = classList.length === 0 && giftList.length === 0;

  return (
    <StateHandler options={pageStatus}>
      <main className={styles.main}>
        <title>{!hasMakeSure ? '权益升级页面' : '权益保障页面'}</title>
        {!hasMakeSure ? (
          <>
            <div className={styles['upgrade-container']}>
              <div className={styles.tips}>
                <img src={WarnIcon} alt='' className={styles['tips-img']} />
                <div className={styles['tips-text']}>
                  新赠品中的实物，将寄送至本订单的收货地址哦
                </div>
              </div>
              {/* 订单信息 */}
              <div className={styles['order-info']}>
                <img
                  className={styles['order-img']}
                  src={
                    productData?.headImageUrl ||
                    'https://jojostorage.oss-cn-hangzhou.aliyuncs.com/uc/userDefaultHeadImg.png'
                  }
                  alt=''
                />
                <div className={styles['order-detail']}>
                  <div className={styles['order-name']}>{productData?.productName}</div>
                  <div className={styles['order-time']}>
                    下单时间： {dayjs(productData?.createTime).format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                </div>
              </div>
              {/* 订单赠品信息 */}
              <div className={styles['order-gift']}>
                <div className={styles['gift-title']}>
                  <div className={styles.line} />
                  <div className={styles.text}>原订单赠送</div>
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
                          <div className={styles['gift-text']}>{creatName(classList)}</div>
                        </div>
                      )}

                      {giftList.length > 0 && (
                        <div className={styles['product-gift']}>
                          <div className={styles['product-icon']}>
                            <img src={GiftIcon} alt='' className={styles['product-img']} />
                            <div className={styles['product-text']}>赠品</div>
                          </div>
                          <div className={styles['gift-text']}>{creatName(giftList)}</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              {/* 可升级赠品信息 */}
              <div className={styles['gift-select']}>
                <div className={styles['gift-title']}>
                  <div className={styles.line} />
                  <div className={styles.text}>可更换为</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles['protection-container']}>
              <LoginBar isPopLogin={false} onLoginSuccess={() => window.location.reload()} />
              <img src={''} alt='' className={styles['protection-img']} />
              <div
                className={styles.btn}
                onClick={() => {
                  setHaseMakeSure(true);
                }}>
                <span>已阅读并同意上述规则</span>
              </div>
            </div>
          </>
        )}
      </main>
    </StateHandler>
  );
};

export default RightsProtection;
