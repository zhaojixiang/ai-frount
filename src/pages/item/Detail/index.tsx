import { isEmpty } from 'lodash-es';
import qs from 'query-string';
import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import LoginBar from '@/components/LoginBar';
import ReNew from '@/components/ReNew';
import { getQuery } from '@/lib/utils';
import { isAuditGuestLogin, popLogin, wxAuth } from '@/modules/auth';
import { getJingTanPath } from '@/modules/customerService';
import { appShareH5Config } from '@/modules/share/appShare';
import WxShare, { WxConfigInit } from '@/modules/share/wxShare';
import { getCouponList } from '@/services/api/coupon';
import { FROUNT_URL_OLD } from '@/services/config';

import BottomArea from './components/BottomArea';
import CouponWrapper from './components/CouponWrapper';
import DownloadAppPopup from './components/DownloadAppPopup';
import ImageSlider from './components/ImageSlider';
import PriceAndTitle from './components/PriceAndTitle';
import ProductDesc from './components/ProductDesc';
import SharePop from './components/SharePop';
import Skeleton from './components/Skeleton';
import SkuSelectPop from './components/SkuSelectPop';
import SoldOutPop from './components/SoldOutPop';
import ValidatePayAfterPop from './components/ValidatePayAfterPop';
import ValidatePricePop from './components/ValidatePricePop';
import S from './index.module.less';
import type { SkuSelectParams } from './type';
import {
  checkOrder,
  getDetail,
  isLoginInDetail,
  replaceStateInMiniApp,
  upgradeChinese
} from './utils';

// 分享详情页面的url
export const SHARE_DETAIL_URL_KEY = '_de_ur_';

export default function Detail() {
  const [searchParams] = useSearchParams();
  // 公共参数
  const { linkCode = '' } = useParams(); // 商品链接码
  const toPurchased = searchParams.get('toPurchased') || ''; // 是否打开购买弹窗
  const orderSource = searchParams.get('orderSource') || ''; // 订单来源
  // 内部参数
  const useType = searchParams.get('useType') || '';
  const needPopLogin = JSON.parse(searchParams.get('needPopLogin') || 'false');

  const [pageData, setPageData] = useState<any>({});

  const [loading, setLoading] = useState(true);

  // 售罄弹窗
  const [soldOutVisible, setSoldOutVisible] = useState(false);
  // 购买弹窗
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  // 分享弹窗
  const [shareModalVisible, setShareModalVisible] = useState(false);
  // 校验价格弹窗
  const [validatePricePopVisible, setValidatePricePopVisible] = useState(false);
  // 校验先学后付弹窗
  const [validatePayAfterPopVisible, setValidatePayAfterPopVisible] = useState(false);
  // 下载app弹窗
  const [downloadAppPopupVisible, setDownloadAppPopupVisible] = useState(false);

  // sku详情
  const [skuDetail, setSkuDetail] = useState<any>({});
  // 客服链接
  const [supportURL, setSupportURL] = useState('');
  // 校验价格弹窗
  const [priceComparisonInfo, setPriceComparisonInfo] = useState<any>();
  // 校验先学后付弹窗
  const [payAfterInfo, setPayAfterInfo] = useState<any>();
  // 订阅类型
  const [curSubScribeType, setCurSubScribeType] = useState<any>(null);
  // 优惠券列表
  const [recommendCoupon, setRecommendCoupon] = useState<any[]>([]);

  // 校验价格弹窗是否已显示
  const isAlReadyShowvalidatePricePopRef = useRef<boolean>(false);
  // 是否跨租户
  const isCrossTenant = useRef(false);
  // 当前价格(记录当前价格，用于价格比对)
  const curPriceRef = useRef<any>(0);

  const { currencyType, payMode, skuList, learningPay, giftPools } = pageData || {};

  /**
   * 初始化页面
   */
  const initPage = () => {
    popLoginAssist();
    // 获取客服链接
    _getJingTanPath();

    getProductDetail();
  };
  /**
   * 获取商品详情
   */
  const getProductDetail = async () => {
    setLoading(true);
    const res = await getDetail({ linkCode }, isLoginInDetail());
    // 商品租户与当前域名不匹配，返回空，不进行后续处理，等待链接重定向处理
    isCrossTenant.current = res?.data?.isCorssTenant;
    const { data, resultCode } = res || {};
    if (resultCode === 200) {
      const { productLabel, id } = data;
      setPageData({ ...data, productLabel: productLabel?.split(/[,，]/) || [] });
      // 获取优惠券列表
      if (isRequestAuthApi()) {
        await _getRecommendCoupon(id);
      }
      setLoading(false);

      // 商品售罄弹窗
      if (data?.productState === 4) {
        setSoldOutVisible(true);
      }

      // 设置默认选中sku
      if (data?.skuList?.length === 1) {
        setSkuDetail(data?.skuList?.[0]);
      }

      // 链接上携带参数，直接弹出购买弹窗
      if (toPurchased) {
        setActionSheetVisible(true);
      }

      // 小程序分享
      if (JOJO.Os.xcx) {
        replaceStateInMiniApp({
          shareImage: data?.shareImageUrl || data?.imageUrls?.[0] || '',
          shareTitle: data?.shareName || data?.productTitle || data?.productName || '',
          shareUrl: window.location.href
        });
      }
      // 微信分享
      if (isRequestAuthApi()) {
        WxConfigInit();
        WxShare(
          {
            title: data?.productTitle,
            imgUrl: data?.shareImageUrl,
            link: window.location.href,
            desc: data?.shareName || ''
          },
          true
        );
      }

      // APP分享
      try {
        if (data?.currencyType !== 'USD') {
          appShareH5Config({
            data: {
              title: data?.productTitle || '',
              desc: data?.shareName || '',
              imgUrl: data?.shareImageUrl || '',
              link: window.location.href
            },
            notShowShare: false
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    return res;
  };

  /**
   * 获取优惠券列表
   */
  const _getRecommendCoupon = async (productId: string) => {
    try {
      const res = await getCouponList({
        linkCode,
        productId,
        displayPosition: 'RECOMMEND'
      });
      const { resultCode, data } = res || {};
      if (resultCode === 200 && data?.length) {
        setRecommendCoupon(data?.[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 获取客服链接
  const _getJingTanPath = () => {
    const url = getJingTanPath(
      {
        origin: 'luodiyeXQY',
        channel: 'c8eee0ad911542d49133e1b05a4e5a01',
        channelId: 9
      },
      {
        redirect: true,
        fromType: 'mallDetailV2'
      }
    );
    setSupportURL(url);
  };

  /**
   * 用户点击分享按钮
   */
  const onHandleShare = () => {
    if (!judgeLogin()) {
      return;
    }
    setShareModalVisible(true);
    WxShare({
      title: pageData?.productTitle,
      imgUrl: pageData?.shareImageUrl,
      link: window.location.href,
      desc: pageData?.shareName || '',
      isShowTipToast: false
    });
  };
  // TODO:用户点击生成海报
  const onShare = () => {
    setShareModalVisible(false);
    localStorage.setItem(SHARE_DETAIL_URL_KEY, window.location.href);
    const query = qs.parse(window.location.search);
    const newQuery = { ...query };
    if (!newQuery.productId) {
      newQuery.productId = String(pageData.id);
    }
    JOJO.showPage(`${FROUNT_URL_OLD}/item/share?${qs.stringify(newQuery)}`, { to: 'externalWeb' });
  };

  /**
   * 切换sku
   * @param sku sku详细信息
   */
  const onSkuChange = (sku: any) => {
    if (sku) {
      setSkuDetail(sku);
    }
  };

  /**
   * 选择sku完成，点击确定
   * @param sku sku详细信息
   */
  const onSelectOk = (val: SkuSelectParams) => {
    toConfirm(val);
  };

  /**
   * 领取优惠券后的回调
   */
  const onAfterReceiveCoupon = () => {};

  /**
   * 点击购买按钮
   */
  const handleBuyBtn = async () => {
    console.log('handleBuyBtn');

    const { canBuy } = pageData || {};
    // 前置判断
    if (canBuy === 0) {
      JOJO.toast.error({
        content: '商品为限购商品，您不满足限购条件，无法购买'
      });
      return;
    }
    // 游客 审核 并且在ios的JOJOapp中 需要调用原生登录页面
    if (await isAuditGuestLogin()) {
      return;
    }

    // ---------- 购买点击逻辑处理 -----------
    // 1. 多个sku || M选N || 没有选择sku || 订阅
    if (
      skuList?.length > 1 ||
      giftPools?.length > 0 ||
      !skuDetail?.id ||
      skuDetail?.subscriptionList?.length
    ) {
      setActionSheetVisible(true);
      return;
    }

    // 默认选中订阅模式
    if (skuDetail?.subscriptionList?.length) {
      setCurSubScribeType(skuDetail?.subscriptionList?.[0]);
      return;
    }

    // 直接购买
    toConfirm();
  };

  /**
   * 用户点击确定开始下单
   * @param skuModalParmas sku选择弹窗中携带的数据
   */
  const toConfirm: any = async (skuModalParmas?: SkuSelectParams) => {
    // 防止重复请求
    if (toConfirm.requesting) {
      console.log('to confirm requesting ...');
      return;
    }
    toConfirm.requesting = true;

    // 当前价格
    let curPrice: any = 0;
    if (actionSheetVisible) {
      curPrice = skuModalParmas?.curPrice;
    } else {
      curPrice = curPriceRef.current;
    }

    const properties: any = {
      skuDetail,
      linkCode,
      orderSource,
      payMode,
      curPrice,
      currencyType,
      isAlReadyShowvalidatePricePop: isAlReadyShowvalidatePricePopRef.current,
      curSubscribeType: String(curSubScribeType),
      learningPay,
      ...(skuModalParmas || {}) // 如果skuModalParmas存在，则为sku选择弹窗中的数据
    };

    const callbacks = {
      closeSkuSelectModal,
      refresh: initPage,
      showValidatePriceModal,
      showValidatePayAfterModal,
      setDownloadAppPopupVisible
    };

    // 开始校验订单
    let validateOrderRes;
    try {
      validateOrderRes = await checkOrder({ ...properties }, callbacks);
      toConfirm.requesting = false;
    } catch (error) {
      console.log('校验订单接口报错', error);
      toConfirm.requesting = false;
      return;
    }

    // 校验失败，终止
    if (!validateOrderRes) {
      return;
    }

    // 校验完成
    closeSkuSelectModal();
    const urlParams: any = {
      linkCode,
      skuId: skuDetail?.id,
      orderSource,
      giftPools,
      ...(curSubScribeType ? { subscriptionType: curSubScribeType } : {})
    };

    const search = getQuery(window.location.search);
    const { channel, channelNo } = search || {};
    // 渠道参数（old）
    if (channel && !['null', 'undefined'].includes(channel)) {
      urlParams.orderChannel = channel;
    }
    // 渠道码(new)
    if (channelNo && !['null', 'undefined'].includes(channelNo)) {
      urlParams.channelNo = channelNo;
    }
    console.log('urlParams', qs.stringify(urlParams));

    JOJO.showPage(`/order/create?${qs.stringify(urlParams)}`);
  };

  /**
   * 关闭sku选择弹窗
   */
  const closeSkuSelectModal = () => {
    setActionSheetVisible(false);
  };

  /**
   * 显示校验价格弹窗
   */
  const showValidatePriceModal = (params: any) => {
    isAlReadyShowvalidatePricePopRef.current = true;
    setPriceComparisonInfo(params);
    setValidatePricePopVisible(true);
  };

  /**
   * 显示校验先学后付弹窗
   */
  const showValidatePayAfterModal = (params: any) => {
    setPayAfterInfo(params);
    setValidatePayAfterPopVisible(true);
  };

  /**
   * 是否请求需要授权的接口
   * @returns boolean
   */
  const isRequestAuthApi = () => {
    return isLoginInDetail();
  };
  /**
   * 登录判断
   */
  const judgeLogin = () => {
    if (isRequestAuthApi()) {
      console.log('已登录');

      // 已登录，继续后续流程
      return true;
    } else {
      console.log('未登录');

      // 弹窗登录
      popLogin({
        callback: () => {
          getProductDetail();
        }
      });

      return false;
    }
  };
  /**
   * 未登录点击拦截
   */
  const onNotLoginIntercept = (e: any) => {
    console.log('onNotLoginIntercept');

    if (!judgeLogin()) {
      console.log('未登录点击拦截');

      e.stopPropagation();
    }
  };
  // 弹窗登录
  const popLoginAssist = () => {
    // 微信授权
    wxAuth();
    try {
      // 防止弹窗登录 iframe 冻结或失效
      window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
          const iframe: any = document.getElementById('accountSDKPopupIframe');
          const im = iframe?.src;
          if (iframe) {
            iframe.src = im;
          }
        }
      });
    } catch (error) {
      console.log('弹窗登录异常', error);
    }
  };

  useEffect(() => {
    initPage();
  }, []);

  // 弹窗登录
  useEffect(() => {
    if (needPopLogin) {
      popLogin({
        callback: () => {
          getProductDetail();
        }
      });
    }
  }, [needPopLogin]);

  useEffect(() => {
    if (!isEmpty(pageData)) {
      const { productState, stock } = pageData;
      if (toPurchased && toPurchased === 'true') {
        // 已下架
        if (productState === 4) {
          return;
        }
        // 已售罄
        if (typeof stock === 'number' && !stock) {
          return;
        } else if (typeof stock !== 'number') {
          return;
        }
        if (skuDetail?.stage === 1) {
          return;
        }
        setActionSheetVisible(true);
      }
    }
  }, [pageData]);

  // 小升初
  const upgradeChineseRes = upgradeChinese(useType, linkCode);
  if (upgradeChineseRes === 'env error') {
    return <ReNew />;
  }
  // 参数错误
  if (!linkCode) {
    return null;
  }
  if (loading) {
    return <Skeleton />;
  }
  return (
    <div className={S.detail}>
      {/* 切换登录 */}
      <LoginBar isPopLogin={true} onLoginSuccess={getProductDetail} />
      {/* 轮播 */}
      <ImageSlider pageData={pageData} />
      {/* 价格 title 分享 */}
      <PriceAndTitle
        pageData={pageData}
        coupon={recommendCoupon}
        isLogin={isLoginInDetail()}
        onHandleShare={onHandleShare}
      />
      {/* 优惠券 */}
      {!isEmpty(recommendCoupon) && (
        <CouponWrapper coupon={recommendCoupon} afterReceive={onAfterReceiveCoupon} />
      )}
      {/* 商品描述 */}
      <ProductDesc pageData={pageData} />

      {/* sku选择弹窗 */}
      <SkuSelectPop
        visible={actionSheetVisible}
        skuDetail={skuDetail}
        couponInfo={recommendCoupon}
        pageData={pageData}
        onClose={() => setActionSheetVisible(false)}
        onSkuChange={onSkuChange}
        onOk={onSelectOk}
      />
      {/* 购买按钮 */}
      <BottomArea
        onNotLoginIntercept={onNotLoginIntercept}
        onHandleBuyBtn={handleBuyBtn}
        supportURL={supportURL}
        pageData={pageData}
        isLogin={isRequestAuthApi()}
      />
      {/* 价格比对弹窗 */}
      <ValidatePricePop
        visible={validatePricePopVisible}
        onClose={() => setValidatePricePopVisible(false)}
        info={priceComparisonInfo}
      />
      {/* 校验先学后付弹窗 */}
      <ValidatePayAfterPop
        visible={validatePayAfterPopVisible}
        onClose={() => setValidatePayAfterPopVisible(false)}
        info={payAfterInfo}
      />
      {/* 下载app弹窗 */}
      <DownloadAppPopup
        visible={downloadAppPopupVisible}
        onClose={() => setDownloadAppPopupVisible(false)}
      />
      {/* 商品下架弹窗 */}
      <SoldOutPop
        visible={soldOutVisible}
        onClose={() => setSoldOutVisible(false)}
        projectId={pageData?.projectId}
        pointNotEnoughJump={pageData?.pointNotEnoughJump}
      />
      {/* 分享弹窗 */}
      <SharePop
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        onOK={onShare}
      />
    </div>
  );
}
