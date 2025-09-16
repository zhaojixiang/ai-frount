import qs from 'query-string';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// import { popupLogout } from '@/modules/auth';
import {
  getSubscribeProtocoLink,
  getUserPurchaseProtocoLink,
  getUserServiceProtocoLink
} from '@/modules/protocols';
import { getVoucherList } from '@/services/api/coupon';
import { getProductDetail, getUserAddress } from '@/services/api/order';
import { getPayMethods } from '@/services/api/orderPay';
import { getRecommendSkus } from '@/services/api/product';
import { getAppEnum, getEnvEnum } from '@/services/common';
import { FROUNT_URL_OLD } from '@/services/config';

import Address from './components/Address';
import AgreementPop from './components/AgreementPop';
import BottomArea from './components/BottomArea';
import PayAfterProtocolPop from './components/PayAfterProtocolPop';
import PayMethods from './components/PayMethods';
import Price from './components/Price';
import RecommendSku from './components/RecommendSku';
import Skeleton from './components/Skeleton';
import SkuDetail from './components/SkuDetail';
import Title from './components/Title';
import usePromotionPay from './hooks/usePromotionPay';
import S from './index.module.less';
import { formatUserCouponIdList, jumpToSubscribePay, needJumpToMiniPay } from './utils';

export default function CreateOrder() {
  const [searchParams] = useSearchParams();
  // 公共参数
  const linkCode = searchParams.get('linkCode') || ''; // 商品链接码
  const skuId = searchParams.get('skuId') || ''; // 商品skuId
  const subscriptionType = searchParams.get('subscriptionType') || ''; // 订阅类型
  const giftPools = searchParams.get('giftPools') || ''; // 订阅类型
  const cpId = searchParams.get('cpId') || ''; // 订阅类型
  const maxDiscountCouponIdList = searchParams.get('maxDiscountCouponIdList') || ''; // 订阅类型
  const buyNum = searchParams.get('buyNum') || 1; // 订阅类型
  const channelNo = searchParams.get('channelNo') || ''; // 渠道号（新）
  const orderChannel = searchParams.get('orderChannel') || ''; // 渠道参数（旧）
  const orderSource = searchParams.get('orderSource') || ''; // 订单来源
  // 内部参数
  const voucherIds = searchParams.get('voucherIds') || ''; // 订阅类型
  const curVoucherIds = voucherIds ? voucherIds.split(',') : [];

  // 商品详情
  const [detail, setDetail] = useState<any>({});
  // 加载中
  const [loading, setLoading] = useState(true);
  // 代金券
  const [disabledVoucher, setDisabledVoucher] = useState(false);
  // 使用优惠券
  const [useUserCouponIds, setUseUserCouponIds] = useState<string[]>([]);
  // 推荐代金券
  const [recommendVoucherData, setRecommendVoucherData] = useState<any>({});
  // 推荐商品
  const [recommendSkusData, setRecommendSkusData] = useState<{ skuList: any[] }>({
    skuList: []
  });
  // 推荐商品id
  const [recommendSkuId, setRecommendSkuId] = useState<string | undefined>('');
  // 是否同意协议
  const [isAcceptProtocol, setIsAcceptProtocol] = useState(false);
  // 协议链接
  const [protocolLink, setProtocolLink] = useState<{
    userPurchaseProtocolLink: string;
    userServiceProtocolLink: string;
    autoRenewableProtocolLink: string;
  }>({
    userPurchaseProtocolLink: '',
    userServiceProtocolLink: '',
    autoRenewableProtocolLink: ''
  });
  // 收货地址
  const [address, setAddress] = useState<any>({});
  // 支付方式
  const [payWays, setPayWays] = useState<any>([]);
  // 当前支付方式
  const [curPayWay, setCurPayWay] = useState(0);
  // 是否有优惠券
  const [haveCoupon, setHaveCoupon] = useState(false);

  // 协议弹窗
  const [agreementVisible, setAgreementVisible] = useState(false);
  // 先学后付协议弹窗
  const [payAfterProtocolVisible, setPayAfterProtocolVisible] = useState(false);

  // 未检测到支付结果弹窗
  // const [payResultVisible, setPayResultVisible] = useState(false);
  // 价格对比弹窗
  // const [validatePricePopVisible, setValidatePricePopVisible] = useState(false);
  // // 活动变更提示弹窗
  // const [activityChangeVisible, setActivityChangeVisible] = useState(false);
  // const [activityChangeContent, setActivityChangeContent] = useState('');
  // 支付确认loading
  // const [payComfirmloading, setPayComfirmLoading] = useState(false);

  // 代金券列表
  const curVoucherIdsRef = useRef<any>(curVoucherIds);

  // 是否可以离开
  const canLeave = useRef(false);
  // 先学后付协议
  const isAcceptPayAfterProtocolRef = useRef(false);

  const { currencyType } = detail || {};

  // 链接上是否包含 voucherIds
  const hasVoucherIdsField = Object.keys(JOJO.Utils.getQuery(window.location.search)).includes(
    'voucherIds'
  );

  const { _createOrder } = usePromotionPay({
    query: JOJO.Utils.getQuery(),
    // query: {},
    address,
    detail,
    payWays,
    curPayWay,
    canLeave
    // setPayResultVisible,
    // setValidatePricePopVisible,s
    // setTipVisible,
    // setActivityChangeVisible,
    // setActivityChangeContent,
    // setBridgeFailVisible,
    // setPayFailVisible,
    // setVerifyFailVisible,
    // setPayComfirmLoading,
    // toAddress
  });

  useEffect(() => {
    initPage();
  }, []);
  /**
   * 跳转选择地址
   */
  const toAddress = (id = '') => {
    canLeave.current = true;
    // sensClickInitiative({
    //   $element_name: '商城订单确认页_地址点击'
    // });
    if (id) {
      JOJO.showPage(`${FROUNT_URL_OLD}/address/list`, {
        params: {
          type: 'order',
          redirect_url: window.location.href
        },
        to: 'externalWeb'
      });
    } else {
      JOJO.showPage(`${FROUNT_URL_OLD}/address/edit`, {
        to: 'externalWeb',
        params: {
          type: 'order',
          redirect_url: window.location.href
        }
      });
    }
  };
  /**
   * 是否显示代金券模块
   */
  const showVoucher = useMemo(() => {
    return !subscriptionType || JOJO.Os.jojo;
  }, [subscriptionType]);

  /**
   * 是否需要地址
   */
  const needAddress = useMemo(() => {
    return (detail.shipmentType !== 1 || subscriptionType) && currencyType !== 'USD';
  }, [detail, subscriptionType, currencyType]);

  // 初始化页面
  const initPage = async () => {
    setLoading(true);
    try {
      await _getRecommendVoucher();
      await getPageDetail();
      setCurrentAddress();
      _getRecommendSkus();
      getUserProtocolLink();
      setLoading(false);
    } catch (err) {
      console.error('确认订单收银台页面初始化：', err);
      setLoading(false);
    }
  };

  /**
   * 获取推荐代金券
   */
  const _getRecommendVoucher = async () => {
    if (!showVoucher) {
      return;
    }
    const res = await getVoucherList({
      skuId,
      assetsType: 'OPTIMAL_CHOICE'
    });
    if (res.resultCode === 200) {
      const data = res?.data || {};
      setRecommendVoucherData(data?.items?.[0]?.optimalChoices);

      if (!hasVoucherIdsField && !curVoucherIdsRef.current?.length) {
        curVoucherIdsRef.current = data?.items?.[0]?.optimalChoices?.optimalChoices?.map(
          (item: any) => item?.assetsId
        );
        JOJO.showPage('/order/create', {
          params: {
            ...JOJO.Utils.getQuery(window.location.search),
            voucherIds: decodeURIComponent(
              data?.items?.[0]?.optimalChoices?.optimalChoices?.map(
                (item: any) => item?.assetsId
              ) || ''
            )
          },
          mode: 'replace'
        });
      }
    }
  };

  /**
   * 获取扩科商品信息
   */
  const _getRecommendSkus = async () => {
    // let hasRecommendSkus = false;
    try {
      const res = await getRecommendSkus({ saleSkuId: skuId });
      if (res?.resultCode === 200) {
        setRecommendSkusData(res?.data);
        // if (res?.data?.skuList?.length) {
        //   // hasRecommendSkus = true;
        // }
      }
    } catch (error) {
      console.error('获取扩科组件失败', error);
    }
    // sensElementView({
    //   $title: '下单页',
    //   $element_name: '扩科组件曝光',
    //   custom_state: hasRecommendSkus
    // });
  };
  /**
   * 获取支付方式
   */
  const _getPayWay = async (params: { aliCashierType: string; wechatCashierType: string }) => {
    try {
      const deviceOS = await JOJO.Utils.getDeviceOS();
      if (currencyType === 'USD' && deviceOS === 'iOS' && JOJO.Os.jojoReadApp) {
        setPayWays([
          {
            code: 160,
            name: 'Apple Pay'
          }
        ]);
        setCurPayWay(160);
      } else if (currencyType === 'USD' && deviceOS === 'Android' && JOJO.Os.jojoReadApp) {
        setPayWays([
          {
            code: 180,
            name: 'Google Pay'
          }
        ]);
        setCurPayWay(180);
      } else {
        const env = await getEnvEnum();
        const res = await getPayMethods({
          aliCashierType: params?.aliCashierType,
          wechatCashierType: params?.wechatCashierType,
          env,
          skuId,
          linkCode
        });
        if (res?.data?.length) {
          // 过滤花呗
          const ways = res.data?.filter((item: any) => {
            return Number(item?.code) !== 112;
          });

          setPayWays(ways);
          setCurPayWay(ways?.[0]?.code);
        } else {
          setPayWays([]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * 获取页面信息
   */
  const getPageDetail = async () => {
    const curGiftPools = JSON.parse(decodeURIComponent(giftPools || '') || '[]') || [];
    const giftSkuIds: any[] = [];
    curGiftPools?.forEach((item: any) => {
      giftSkuIds.push(...item.skuIds);
    });

    let params: any = {};
    let userCouponIds: any[] = [];
    if (cpId) {
      if (!Array.isArray(cpId)) {
        userCouponIds = cpId?.split(',');
      } else {
        userCouponIds = cpId;
      }
    }
    // 兼容默认选择优惠券的问题 一进来没有cpId和maxDiscountCouponIdList表示没有优惠券就要使用默认优惠券
    let useRecommendCoupon = true;
    if (!maxDiscountCouponIdList && !cpId) {
      useRecommendCoupon = true;
    } else {
      useRecommendCoupon = false;
    }

    params = JOJO.Utils.filterEmptyParams({
      userCouponIds,
      useRecommendCoupon,
      giftSkuIds,
      linkCode,
      skuId,
      giftPools,
      buyNum,
      payMode: 'CASH',
      ...(subscriptionType ? { subscriptionMode: 'QUARTER', subscriptionMethod: 'AUTO' } : {}), // 订阅
      ...(curVoucherIdsRef.current?.length ? { voucherIds: curVoucherIdsRef.current } : {}) // 代金券
    });

    // 获取商品详情
    const res = await getProductDetail(params);
    const { data, resultCode, errorMsg } = res || {};
    const newData = { ...data };

    // 代金券扣减失败 | 未使用代金券 清空
    if (data?.voucherAmount <= 0) {
      curVoucherIdsRef.current = [];
    }
    if (resultCode === 200) {
      if (errorMsg === 'NOT_VOUCHER') {
        // 已优惠至0元，不需要使用代金券
        curVoucherIdsRef.current = [];
        setDisabledVoucher(true);
      } else if (errorMsg) {
        // 异常处理: 代金券
        curVoucherIdsRef.current = [];
        JOJO.toast.show({
          content: errorMsg,
          icon: 'info'
        });
        JOJO.showPage('/order/create', {
          params: {
            ...JOJO.Utils.getQuery(window.location.search),
            voucherIds: ''
          },
          mode: 'replace'
        });
      }

      // 获取外部编码
      const { externalConfigList, haveCoupon: hc } = newData || {};
      const deviceOS = await JOJO.Utils.getDeviceOS();
      if (deviceOS === 'iOS' && JOJO.Os.jojoReadApp) {
        const iosExternalConfig = externalConfigList?.find(
          (item: { payPlatform: string }) => item?.payPlatform === 'APPLE_STORE'
        );
        newData.externalProductCode = iosExternalConfig?.externalProductCode;
      } else if (deviceOS === 'Android' && JOJO.Os.jojoReadApp) {
        const androidExternalConfig = externalConfigList?.find(
          (item: { payPlatform: string }) => item?.payPlatform === 'GOOGLE_PAY'
        );
        newData.externalProductCode = androidExternalConfig?.externalProductCode;
      }

      setDetail(newData);
      setUseUserCouponIds(newData?.useUserCouponId ? [newData?.useUserCouponId] : []);
      setHaveCoupon(hc);

      _getPayWay({
        aliCashierType: newData?.aliCashierType,
        wechatCashierType: newData?.wechatCashierType
      });
    }
  };

  /**
   * 设置地址
   */
  const setCurrentAddress = async () => {
    try {
      const res = await getUserAddress();
      const { data } = res || {};
      const currentAddressId = localStorage.getItem('currentAddressID');
      let newAddress = data[0];
      if (currentAddressId) {
        newAddress = data.find((item: any) => {
          return currentAddressId && `${item.id}` === `${currentAddressId}`;
        });
      } else {
        newAddress = data.find((item: any) => {
          return item.checked;
        });
      }
      newAddress = newAddress || data[0] || {};
      setAddress(newAddress);
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * 获取用户协议链接
   */
  const getUserProtocolLink = async () => {
    // 获取用户购买协议
    const userPurchaseLink = await getUserPurchaseProtocoLink();
    // 获取用户服务协议
    const userServiceLink = await getUserServiceProtocoLink();
    // 获取自动续费协议
    const autoRenewableLink = await getSubscribeProtocoLink();
    setProtocolLink({
      userPurchaseProtocolLink: userPurchaseLink,
      userServiceProtocolLink: userServiceLink,
      autoRenewableProtocolLink: autoRenewableLink
    });
  };

  /**
   * 跳转代金券选择
   */
  const toVoucher = () => {
    if (disabledVoucher) {
      return;
    }
    canLeave.current = true;
    // TODO：这里跳转过去之后无法跳转回来，需修改代金券选择页回跳逻辑
    JOJO.showPage(`${FROUNT_URL_OLD}/coupon/voucherSelect`, {
      params: {
        ...JOJO.Utils.getQuery(window.location.search),
        rediectRouter: '/order/create',
        voucherIds: decodeURIComponent(curVoucherIdsRef.current),
        maxDiscountAmount: recommendVoucherData?.maxDiscountAmount
      },
      to: 'externalWeb'
    });
  };
  /**
   * 跳转选择优惠券
   */
  const toCoupon = () => {
    // 自动领取的优惠券不允许更换
    if (detail?.couponInfo?.autoPick) {
      return;
    }
    canLeave.current = true;
    const { useUserCouponId } = detail ?? {};
    // sensClickInitiative({
    //   $element_name: '商城订单确认页_优惠券点击'
    // });
    JOJO.showPage(`${FROUNT_URL_OLD}/coupon/use`, {
      params: {
        ...(qs.parse(window.location.search) || {}),
        _ppl: detail.productLinkId,
        banForUsing: haveCoupon,
        stageNum: undefined,
        displayProductPrice: detail.promotionPrice >= 0 ? detail.promotionPrice : detail.price,
        maxDiscountCouponIdList: [useUserCouponId],
        skuSubSectionModeDetailId: detail.skuSubSectionModeDetailId,
        isPromotion: true,
        couponTemplateId: detail?.couponTemplateId,
        promPrice: detail?.price,
        sellerIpId: detail?.sellerIpId
      },
      to: 'externalWeb'
    });
  };

  // 跳转协议页面
  const toProtocol = (type: string) => {
    canLeave.current = true;
    if (type === 'userService') {
      window.location.href = protocolLink?.userServiceProtocolLink;
    }
    if (type === 'autoRenew') {
      window.location.href = protocolLink?.autoRenewableProtocolLink;
    }
    if (type === 'purchase') {
      window.location.href = protocolLink?.userPurchaseProtocolLink;
    }
  };

  /**
   * 选中扩科商品
   */
  const onHandleCheck = (checked: boolean, curCheck?: string) => {
    setRecommendSkuId(checked ? curCheck : '');
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
   * 页面触发下单操作: 前置判断
   */
  const handleConfirm = async () => {
    // TODO: 校验是否申请注销，需要撤销注销才能执行下单操作
    // const isLogout = await popupLogout();
    // if (isLogout) {
    //   return;
    // }

    // 目前商城链路未支持IAP支付，对纯虚拟商品做兜底处理，阻止下单操作
    const iosApp = await JOJO.Utils.isIosApp();
    if (iosApp && currencyType !== 'USD') {
      if (detail?.shipmentType === 1 && detail?.totalCast > 0) {
        JOJO.toast.show({
          content: '该商品暂时无法购买，请联系客服',
          icon: 'info'
        });
        return;
      }
    }

    if (!skuId) {
      JOJO.toast.show({
        content: '未选择商品',
        icon: 'info'
      });
      return;
    }

    if (!address?.id && needAddress) {
      JOJO.toast.show({
        content: '未选择地址',
        icon: 'info'
      });
      return;
    }

    if (!curPayWay && detail?.totalAmount > 0 && !subscriptionType) {
      JOJO.toast.show({
        content: '未选择支付方式',
        icon: 'info'
      });
      return;
    }

    // 先学后付 & APP环境：未安装支付宝下单拦截
    if (Number(curPayWay) === 116 && JOJO.Os.app) {
      const alipayExist = await JOJO.Utils.getAliExist();
      if (!alipayExist) {
        JOJO.toast.show({
          content: '未检测到支付宝',
          icon: 'info'
        });
        return;
      }
    }

    if (!isAcceptProtocol) {
      setAgreementVisible(true);
      return;
    }

    // 先学后付协议
    if (Number(curPayWay) === 999) {
      if (!isAcceptPayAfterProtocolRef.current) {
        setPayAfterProtocolVisible(true);
        return;
      } else {
        // 设置为未同意，保证每次点击支付按钮都会弹出协议弹窗
        isAcceptPayAfterProtocolRef.current = false;
      }
    }

    // sensClickInitiative({
    //   $element_name: '确认订单收银台-立即支付按钮点击',
    //   c_element_id: address?.id,
    //   $element_content: `优惠券ID：${String(formatUserCouponIdList())}; 代金券ID：${String(
    //     curVoucherIdsRef.current
    //   )}; 合计价格：${detail?.totalCast}`
    // });

    canLeave.current = true;

    // 获取包名枚举
    const app = await getAppEnum();

    const params = {
      linkCode,
      quantity: 1, // 暂时解决因购物车数量可更改导致下单数量为多个
      skuId,
      userAddressId: needAddress ? address?.id : '',
      totalAmount: detail.totalCast, // 仅用于学豆余额校验，活动sku已在加载时做了替换
      userCouponIdList: formatUserCouponIdList(cpId, useUserCouponIds),
      // outToken,
      orderSource,
      subscriptionType,
      orderChannel,
      channelNo,
      skuPrice: detail.skuSaleResp ? detail.skuSaleResp.skuPrice : '',
      skuSubsectionModeId: detail.skuSubSectionModeId,
      skuSubSectionModeDetailId: detail.skuSubSectionModeDetailId,
      payMode: 'CASH',
      externalProductCode: detail.externalProductCode,
      app,
      recommendSkuId,
      giftPools: JSON.parse(decodeURIComponent(giftPools || '') || '[]'),
      orderType: Number(curPayWay) === 999 ? 'LEARNING_PAY' : 'NORMAL',
      voucherIds: curVoucherIdsRef.current || []
    };

    if (subscriptionType) {
      // 页面跳转不需要解码
      if (giftPools) {
        params.giftPools = giftPools;
      }
      if (
        await needJumpToMiniPay({
          subscriptionType
        })
      ) {
        jumpToSubscribePay({
          ...params,
          cost: detail?.convertCash,
          resourcePlatform: detail?.resourcePlatform
        });
      } else {
        // onSubscriptionPay();
      }
    } else {
      // setPayLoading(true);
      _createOrder(params);
    }
  };

  if (!linkCode || !skuId) {
    return '参数错误';
  }

  if (loading) {
    return <Skeleton />;
  }
  return (
    <div className={S.create_container}>
      <div className={S.page_wrap}>
        {needAddress ? <Address detail={address} toAddress={toAddress} /> : null}
        <Title text='商品明细' />
        <SkuDetail detail={detail} />
        {/* 扩科 */}
        {recommendSkusData?.skuList?.length ? (
          <div style={{ marginTop: '16px' }}>
            <RecommendSku data={recommendSkusData} onHandleCheck={onHandleCheck} />
          </div>
        ) : null}
        <Title text='价格明细' />
        <Price
          detail={detail}
          payWay={curPayWay}
          voucher={{ showVoucher, disabledVoucher, hasVoucherIdsField, recommendVoucherData }}
          query={{ subscriptionType }}
          onHandleGoVoucher={toVoucher}
          onHandleGoCoupon={toCoupon}
        />
        {(payWays.length > 0 && detail?.totalCast > 0) || subscriptionType ? (
          <>
            <Title text='支付方式' />
            <PayMethods
              subscriptionType={subscriptionType}
              payWays={payWays}
              curPayWay={curPayWay}
              onChange={(code) => {
                setCurPayWay(code);
              }}
            />
          </>
        ) : null}
      </div>
      <div className={S.safeArea} />
      {/* 按钮 & 协议 */}
      <BottomArea
        onConfirm={handleConfirm}
        subscriptionType={subscriptionType}
        isAcceptProtocol={isAcceptProtocol}
        setIsAcceptProtocol={setIsAcceptProtocol}
        toProtocol={toProtocol}
        detail={detail}
        curPayWay={curPayWay}
        renderPriceLabel={renderPriceLabel}
      />
      {/* 协议弹窗 */}
      <AgreementPop
        visible={agreementVisible}
        onHandleGoProtocol={toProtocol}
        subscriptionType={subscriptionType}
        onClose={() => setAgreementVisible(false)}
        onHandleAgree={() => {
          setAgreementVisible(false);
          setIsAcceptProtocol(true);
        }}
      />
      {/* 先学后付协议弹窗 */}
      <PayAfterProtocolPop
        visible={payAfterProtocolVisible}
        onClose={() => setPayAfterProtocolVisible(false)}
        onOk={() => {
          isAcceptPayAfterProtocolRef.current = true;
          setPayAfterProtocolVisible(false);
        }}
      />
    </div>
  );
}
