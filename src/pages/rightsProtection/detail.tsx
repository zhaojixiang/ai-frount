import { Button, Toast } from 'antd-mobile';
import dayjs from 'dayjs';
import { cloneDeep, isEmpty } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import ClassIcon from '@/assets/images/jojo/rightsProtection/class.png';
import GiftIcon from '@/assets/images/jojo/rightsProtection/gift.png';
import WarnIcon from '@/assets/images/jojo/rightsProtection/warn.png';
import FixBottom from '@/components/FixBottom';
import StateHandler, { LoadStatus } from '@/components/StateHandler';
import Address from '@/modules/Address';
import {
  getOrderProduct,
  getOrderProtection,
  getOrderRules,
  submitPriceProtection
} from '@/services/api/rightsProtection';

import ChoiceGift from './components/choiceGift';
import ErrorPage from './components/errorPage';
import Skeleton from './components/Skeleton';
import SubmitModal from './components/submitModal';
import SuccessPage from './components/successPage';
import styles from './index.module.less';

export interface GiftSku {
  skuId: number;
  skuName: string;
  skuImageUrl: string;
  skuType?: 'COMBINE' | 'ENTITY' | 'COURSE' | 'COUPON';
  resourcePlatform: number;
  mergeDelivery: boolean;
  giftMaxNum: number;
  giftUsedNum: number;
  productGroupId: number;
  productGroupName: string;
  fixedGift: boolean;
  shipMoment: 'IMMEDIATE' | string;
}

export interface PromotionItem {
  // 是否命中促销
  hitPromotion: boolean;
  // 命中的促销活动 ID
  promotionId: number;
  // 命中的促销活动版本号
  promotionVersion: number;
  // 赠送策略，NORMAL_GIFT-普通赠送；CHOICES_GIFT-M选N
  giftStrategy: 'NORMAL_GIFT' | 'CHOICES_GIFT' | string;
  // SKU ID
  skuId: number;
  // 标准价格
  price: number;
  // 促销价格
  promotionPrice: number;
  // 立减金额
  discountAmount: number;
  // 赠品池信息列表
  giftPools: GiftPool[];
  // 目标用户 ID
  targetUserId: number;
  // 规则冲突策略，COUPON_FIRST-优惠券优先；DISCOUNT_COUPON_COMBINATION-立减、优惠券叠加
  ruleConflictStrategy: 'COUPON_FIRST' | 'DISCOUNT_COUPON_COMBINATION' | string;
  // 促销信息
  promotionInfo: PromotionInfo;
  // 匹配促销规则时间（时间戳）
  matchedRuleTime: number;
}

export interface PromotionInfo {
  // 促销活动名称
  promotionName: string;
  // 促销类型
  promotionType: 'DISCOUNT' | string;
}

export interface GiftPool {
  poolId: number;
  poolName: string;
  giftOptionalNum: number;
  giftSkus: GiftSku[];
}

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

const RightsProtectionDetail = () => {
  const { orderId } = useParams();

  const [userAddressId, setUserAddressId] = useState<number>();
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
    status: LoadStatus.Loading,
    loadingElement: <Skeleton />
  });
  // 订单保障规则
  const [promotionData, setPromotionData] = useState({
    giftPoolsType: '',
    poolNum: 0,
    normalList: [],
    choiceList: []
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

  // 订单是否有地址相关信息
  const [hasAddress, setHasAddress] = useState(false);

  //填地址dom
  const addressRef = useRef<any>(null);

  //普通奖池用户选择
  const [normalChoiceData, setNormalChoiceData] = useState<any>([]);
  // M选N奖池用户选择
  const [choicesChoiceData, setChoicesChoiceData] = useState<any>([]);

  const [modalStatus, setModalStatus] = useState({
    visible: false,
    content: '',
    btnText: '',
    type: 'submit'
  });

  const timer = useRef<any>(null);

  // 获取到奖池规则
  const getCurrentPromotionList = (discounts: any) => {
    // 获取到命中规则的奖池List
    const hitPromotionList = discounts?.filter((item: any) => item.hitPromotion === true) ?? [];
    const poolList = hitPromotionList
      .filter((item: PromotionItem) => item.giftPools?.length > 0)
      .flatMap((item: PromotionItem) => item.giftPools);

    let normalList = poolList
      .map((pool: GiftPool) => ({
        poolId: pool.poolId,
        poolName: pool.poolName,
        giftOptionalNum: pool.giftOptionalNum,
        giftSkus: pool.giftSkus.filter((sku) => sku.fixedGift).map((sku) => cloneDeep(sku))
      }))
      .filter((pool: GiftPool) => pool.giftSkus.length > 0);

    const choiceList = poolList
      .map((pool: GiftPool) => ({
        poolId: pool.poolId,
        poolName: pool.poolName,
        giftOptionalNum: pool.giftOptionalNum,
        giftSkus: pool.giftSkus.filter((sku) => !sku.fixedGift).map((sku) => cloneDeep(sku))
      }))
      .filter((pool: GiftPool) => pool.giftSkus.length > 0);

    const seenSkusGlobal = new Set(); // 用于跨奖池去重
    const deduplicatedList: any = [];

    normalList.forEach((pool: GiftPool) => {
      const seenSkusInPool = new Set(); // 用于奖池内去重
      const uniqueSkus: any = [];

      // 奖池内去重
      pool.giftSkus.forEach((sku) => {
        const skuId = sku.skuId;
        if (!seenSkusInPool.has(skuId)) {
          seenSkusInPool.add(skuId);
          // 跨奖池去重：只保留第一个奖池中的 skuId
          if (!seenSkusGlobal.has(skuId)) {
            seenSkusGlobal.add(skuId);
            uniqueSkus.push(cloneDeep(sku));
          }
        }
      });

      // 如果奖池内有 sku，添加到结果
      if (uniqueSkus.length > 0) {
        deduplicatedList.push({
          poolId: pool.poolId,
          poolName: pool.poolName,
          giftOptionalNum: pool.giftOptionalNum,
          giftSkus: uniqueSkus
        });
      }
    });

    normalList = deduplicatedList;

    let type = 'MIX_GIFT';
    // const normalList =
    //   hitPromotionList?.filter((item: any) => item.giftStrategy === 'NORMAL_GIFT') ?? [];
    // const choiceList =
    //   hitPromotionList?.filter((item: any) => item.giftStrategy === 'CHOICES_GIFT') ?? [];
    if (normalList.length > 0 && choiceList.length > 0) {
      type = 'MIX_GIFT';
    } else if (normalList.length > 0 && choiceList.length === 0) {
      type = 'NORMAL_GIFT';
    } else if (normalList.length === 0 && choiceList.length > 0) {
      type = 'CHOICES_GIFT';
    } else {
      setErrorPageStatus({
        visible: true,
        text: '获取订单保障规则失败',
        type: 'error'
      });
    }

    return {
      giftPoolsType: type,
      normalList,
      choiceList,
      poolNum: hitPromotionList?.length
    };
  };

  //获取订单商品信息并处理整合
  const getCurrentProductList = (productList: any) => {
    // 获取到订单内容
    const targetProduct =
      productList.find((product: any) => product?.skus.some((sku: any) => sku.gift !== true)) ?? [];
    const { productId, productName, headImageUrl } = targetProduct;

    const allSkuList =
      productList.flatMap((item: any) => item.skus).filter((sku: any) => sku.gift === true) ?? [];

    // 获取赠课list
    const classList = allSkuList?.filter((sku: any) => sku.resourcePlatform === 1) ?? [];
    // 获取赠品list
    const giftList = allSkuList?.filter((sku: any) => sku.resourcePlatform !== 1) ?? [];
    return {
      productId,
      productName,
      headImageUrl,
      classList,
      giftList
    };
  };

  const [initData, setInitData] = useState<any>({});

  // 用户点击选择商品
  const userHandleClick = useCallback(
    ({ normalData = [], choicesData = [] }: { normalData: any; choicesData: any }) => {
      if (normalData.length > 0) {
        setNormalChoiceData(normalData);
      }
      if (choicesData.length > 0) {
        setChoicesChoiceData(choicesData);
      }
    },
    []
  );

  // 初始加载
  const initPage = async (oId: string) => {
    try {
      const OrderProtectionRes = await getOrderProtection({ orderId: oId });

      const { resultCode, data, errorMsg } = OrderProtectionRes || {};
      if (resultCode === 200 && data) {
        const {
          createTime,
          priceProtectPromotion = {} // 价保的促销信息
        } = data;
        const { promotionId, promotionVersion, matchCondition } = priceProtectPromotion;

        const { skuInfoList = [], productId, matchedRuleTime } = matchCondition || {};
        const [ruleRes, productRes] = await Promise.all([
          getOrderRules({
            promotionId,
            promotionVersion,
            skuList: encodeURIComponent(JSON.stringify(skuInfoList)),
            productId,
            matchedRuleTime
          }),
          getOrderProduct({ orderId: oId })
        ]);
        setInitData({
          promotionId,
          promotionVersion
        });

        const { code: ruleCode, data: ruleData } = ruleRes || {};

        if (ruleCode === 'SUCCESS' && ruleData) {
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
            status: LoadStatus.Success,
            loadingElement: <Skeleton />
          });
          return;
        }
        const { resultCode: productCode, data: productdata } = productRes || {};
        if (productCode === 200 && productdata) {
          const { products, orderAddress } = productdata;
          const productItem = getCurrentProductList(products);

          const isEmptyOrder = isEmpty(orderAddress);
          setProductData({ ...productItem, ...createTime });
          setHasAddress(!isEmptyOrder);
        } else {
          setErrorPageStatus({
            visible: true,
            text: '获取订单信息出错',
            type: 'error'
          });
          setPageStatus({
            status: LoadStatus.Success,
            loadingElement: <Skeleton />
          });
          return;
        }
        setPageStatus({
          status: LoadStatus.Success,
          loadingElement: <Skeleton />
        });
      } else {
        switch (resultCode) {
          case 15301:
            jumpToSuccessPage();
            break;
          default:
            setErrorPageStatus({
              visible: true,
              text: errorMsg || '出错了，请重试',
              type: 'error'
            });
            setPageStatus({
              status: LoadStatus.Success,
              loadingElement: <Skeleton />
            });
            break;
        }
      }
    } catch (error) {
      setErrorPageStatus({
        visible: true,
        text: error?.errorMsg || error?.message || '出错了，请重试',
        type: 'error'
      });
    }
  };

  const getSelectStatus = () => {
    // 如果数组为空，直接返回 true
    if (!choicesChoiceData || choicesChoiceData.length === 0) {
      return true;
    }

    // 遍历每个 item，检查 skuIds 长度是否等于 giftOptionalNum
    return choicesChoiceData.every((item: any) => item.skuIds.length === item.giftOptionalNum);
  };

  // 地址填写后调用
  const onAddressSubmit = (addressId: number) => {
    if (addressId) {
      setUserAddressId(addressId);
      addressRef.current.destroy();
      onSure(addressId);
      JOJO.loading.show({ content: '赠品升级中' });
    }
  };

  // 确认升级按钮
  const onSubmit = () => {
    const normalneedAddress = normalChoiceData.some((item: any) => item.needAddress === true);
    const choicesneedAddress = choicesChoiceData.some((item: any) => item.needAddress === true);
    const isNeed = normalneedAddress || choicesneedAddress;
    if (!hasAddress && !userAddressId && isNeed) {
      setModalStatus({
        ...modalStatus,
        visible: false
      });
      addressRef.current = JOJO.popup(<Address onSubmit={onAddressSubmit} />, {
        animate: false,
        bodyStyle: {
          width: '100vw',
          height: '100vh',
          borderRadius: 0,
          margin: 0,
          backgroundColor: '#fff'
        }
      });
      return;
    }
    onSure();
    JOJO.loading.show({ content: '赠品升级中' });
  };

  //跳转成功页
  const jumpToSuccessPage = async () => {
    if (!orderId) {
      return;
    }

    const OrderProtectionRes = await getOrderProduct({ orderId });
    const { resultCode, data } = OrderProtectionRes || {};
    if (resultCode === 200 && data) {
      const { products } = data;
      const productItem = getCurrentProductList(products);
      setProductData({ ...productData, ...productItem });
      setSuccessPageStatus({
        visible: true
      });
      JOJO.loading.close();

      setPageStatus({
        status: LoadStatus.Success,
        loadingElement: <Skeleton />
      });
      if (timer.current) {
        clearTimeout(timer.current);
      }
    } else {
      setModalStatus({
        visible: true,
        content: '出错了，请重试',
        btnText: '我知道了',
        type: 'error'
      });
      JOJO.loading.close();

      setPageStatus({
        status: LoadStatus.Success,
        loadingElement: <Skeleton />
      });
      if (timer.current) {
        clearTimeout(timer.current);
      }
    }
  };

  // 点击确认按钮
  const onSure = async (id?: number | string) => {
    const addressId = id || userAddressId;
    if (!orderId) {
      JOJO.loading.close();
      return;
    }
    const reqParams: any = {
      orderId,
      userAddressId: addressId,
      promotionId: initData?.promotionId,
      promotionVersion: initData?.promotionVersion
    };
    if (choicesChoiceData.length > 0) {
      const paramsdata = choicesChoiceData.map((item) => {
        return {
          poolId: item.poolId,
          skuIds: item.skuIds
        };
      });
      reqParams.chooseGifts = paramsdata;
    }
    const submitRes = await submitPriceProtection(reqParams);
    const { resultCode, errorMsg } = submitRes || {};
    if (resultCode === 200) {
      timer.current = setTimeout(() => {
        jumpToSuccessPage();
      }, 1000);
    } else {
      JOJO.loading.close();
      setModalStatus({
        visible: true,
        content: errorMsg || '出错了，请重试',
        btnText: '我知道了',
        type: 'error'
      });
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

    initPage(orderId);
  }, [orderId]);

  if (successPageStatus.visible) {
    return <SuccessPage {...productData} />;
  }

  if (errorPageStatus.visible) {
    return <ErrorPage {...errorPageStatus} />;
  }

  const { classList, giftList } = productData;

  const Empty = classList?.length === 0 && giftList?.length === 0;
  return (
    <StateHandler options={pageStatus}>
      <SubmitModal
        {...modalStatus}
        onCancel={() =>
          setModalStatus({
            ...modalStatus,
            visible: false
          })
        }
        onSubmit={onSubmit}
      />
      <main className={styles.main}>
        <title>{'权益升级页面'}</title>
        <div className={styles['upgrade-container']}>
          <div className={styles.tips}>
            <img src={WarnIcon} alt='' className={styles['tips-img']} />
            <div className={styles['tips-text']}>新赠品中的实物，将寄送至本订单的收货地址哦</div>
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
              {Empty ? (
                <div className={styles['no-gift']}>暂无赠品</div>
              ) : (
                <>
                  {classList?.length > 0 && (
                    <div className={styles['class-gift']}>
                      <div className={styles['class-icon']}>
                        <img src={ClassIcon} alt='' className={styles['class-img']} />
                        <div className={styles['class-text']}>赠课</div>
                      </div>
                      <div className={styles['gift-text']}>{creatName(classList)}</div>
                    </div>
                  )}

                  {giftList?.length > 0 && (
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
            <ChoiceGift
              {...promotionData}
              onUserHandleClick={userHandleClick}
              choicesChoiceData={choicesChoiceData}
            />
          </div>
          <FixBottom>
            <div className={styles['bottom-btn']}>
              <Button
                shape='rounded'
                className={styles.btn}
                onClick={() => {
                  const isSelectAll = getSelectStatus();
                  if (!isSelectAll) {
                    Toast.show('请先选择赠品');
                    return;
                  }
                  setModalStatus({
                    visible: true,
                    content: '确认后将为您更换新赠课赠品，原有赠课赠品将会被回收',
                    btnText: '确认升级',
                    type: 'submit'
                  });
                }}>
                确认升级赠品
              </Button>
            </div>
          </FixBottom>
        </div>
      </main>
    </StateHandler>
  );
};

export default RightsProtectionDetail;
