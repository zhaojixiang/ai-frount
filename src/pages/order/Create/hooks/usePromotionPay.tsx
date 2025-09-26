import { Modal } from 'antd-mobile';
import type React from 'react';
import { useRef, useState } from 'react';

import { aliPay } from '@/modules/pay';
import { createOrder, preCheck } from '@/services/api/order';
import { getOrderPayOrCreate, getPaiedBillInfo, getPayedOrderInfo } from '@/services/api/orderPay';
import { UNBIND_URL } from '@/services/config';

import type { ScanPayDataProps } from '../type';
import { toPayAfter } from '../utils';

interface IProps {
  canLeave: React.MutableRefObject<boolean>;
  query: any;
  address: any;
  detail: any;
  payWays: any;
  curPayWay: number;
  toAddress?: (item: any, isEdit: boolean) => void;
  setRiseInPriceVisible?: (visible: boolean) => void;
  setPayResultVisible?: (visible: boolean) => void;
  setValidatePricePopVisible?: (visible: boolean) => void;
  setTipVisible?: (visible: boolean) => void;
  setActivityChangeVisible?: (visible: boolean) => void;
  setActivityChangeContent?: (content: string) => void;
  setBridgeFailVisible?: (visible: boolean) => void;
  setPayFailVisible?: (visible: boolean) => void;
  setVerifyFailVisible?: (visible: boolean) => void;
  setPayComfirmLoading?: (visible: boolean) => void;
}

export default (props: IProps) => {
  const {
    query,
    address,
    detail,
    // setRiseInPriceVisible,
    toAddress,
    payWays,
    curPayWay,
    canLeave
    // setPayResultVisible,
    // setValidatePricePopVisible,
    // setTipVisible,
    // setActivityChangeVisible,
    // setActivityChangeContent,
    // setBridgeFailVisible,
    // setPayFailVisible,
    // setVerifyFailVisible,
    // setPayComfirmLoading
  } = props;
  const { orderSource, skuId, payMode, shizi_url } = query;

  const [priceComparisonInfo, setPriceComparisonInfo] = useState();

  const orderIdRef = useRef(null);
  const orderDataRef = useRef(null);
  const orderPayIdRef = useRef(null);
  const timerRef = useRef<any>(null);
  const pollingCountRef = useRef(0);
  const isAlReadyShowvalidatePricePopRef = useRef(false);

  const _createOrder: any = async (params: any) => {
    JOJO.loading.show({
      content: '支付中...'
    });
    if (_createOrder.requesting) {
      return;
    }
    _createOrder.requesting = true;
    // 验证是否有更优惠的待支付订单
    if (!isAlReadyShowvalidatePricePopRef.current) {
      try {
        const res1 = await preCheck({
          payAmount: detail.totalCast,
          skuId,
          payMode,
          orderSourceCode: orderSource,
          action: 'CHEAP'
        });
        if (res1?.data?.orderId) {
          JOJO.loading.close();
          _createOrder.requesting = false;
          isAlReadyShowvalidatePricePopRef.current = true;
          setPriceComparisonInfo(res1?.data);
          // setValidatePricePopVisible(true);
          return;
        }
      } catch (error) {
        console.log('校验订单接口报错', error);
      }
    }
    createOrder(params).then(async ({ data, resultCode, errorMsg }: any) => {
      _createOrder.requesting = false;
      if (resultCode === 1505030140) {
        JOJO.loading.close();
        // setActivityChangeContent(errorMsg);
        // setActivityChangeVisible(true);
        const { giftPools, ...rest } = query;
        JOJO.showPage(`/order/create`, {
          params: rest,
          mode: 'replace'
        });
        return;
      }
      if (!(resultCode || data)) {
        JOJO.loading.close();
        JOJO.toast.show({
          icon: 'fail',
          content: errorMsg
        });
        return;
      }
      // 涨价提示
      if (resultCode === 666) {
        JOJO.loading.close();
        // setRiseInPriceVisible(true);
        return;
      }
      // 3001 子账号购买
      if (resultCode === 3001) {
        JOJO.loading.close();
        Modal.confirm({
          title: '提示',
          content: '你当前是子账号状态，不能单独购买商品，如需购买商品，需要解绑账号后重试',
          onConfirm: () => {
            const url = `${UNBIND_URL}?redirect=${window.location.href}`;
            return window.location.replace(url);
          },
          onCancel: () => {}
        });
        return;
      }

      // 台湾地址缺少证件号
      if (resultCode === 4001) {
        JOJO.loading.close();
        Modal.confirm({
          title: '提示',
          content: '根据国家政策要求，发往台湾地区的快件需填写证件号码，请您补充填写',
          onConfirm: () => {
            toAddress({ id: address?.id }, true);
          },
          onCancel: () => {}
        });
        return;
      }
      // 价格发生变化
      if (resultCode === 1001) {
        JOJO.loading.close();
        // 仅用于商品发生价格变动，而不是支付价格
        JOJO.toast.show({
          icon: 'fail',
          content: '抱歉，价格已发生变化!'
        });
        delete query.cpId;
        JOJO.showPage(`/order/create`, {
          params: query,
          mode: 'replace'
        });
        return;
      }

      if (resultCode !== 200) {
        JOJO.loading.close();
        JOJO.toast.show({
          icon: 'fail',
          content: errorMsg || '抱歉，创建订单失败！'
        });
        return;
      }
      const { orderId, orderPayId } = data;
      orderIdRef.current = orderId;
      _createOrder.requesting = true;
      orderPayIdRef.current = orderPayId;
      if (!orderPayId) {
        try {
          const initOrderPayRes = await getOrderPayOrCreate({ bizId: orderId, bizType: 'NORMAL' });
          const {
            errorMsg: orderPayErrorMessage,
            data: orderPayData,
            resultCode: orderPayResultCode
          } = initOrderPayRes || {};
          if (!orderPayData && orderPayResultCode !== 6001) {
            _createOrder.requesting = false;
            JOJO.loading.close();
            // 0元单没有
            JOJO.toast.show({
              icon: 'fail',
              content: orderPayErrorMessage || '抱歉，创建订单失败！'
            });
            return;
          }
          orderPayIdRef.current = orderPayData;
        } catch (error) {
          console.error(error);
          _createOrder.requesting = false;
          JOJO.loading.close();
          return;
        }
      }

      // 创建之后订单检测
      getPayedOrderInfo({ orderId }).then(async ({ data: newData }) => {
        orderDataRef.current = newData;

        // 先学后付 直接跳转加班加老师
        if (Number(curPayWay) === 999) {
          JOJO.loading.close();
          toPayAfter({
            data: newData,
            orderId
          } as any);
          return;
        }
        // 环境检测
        // if (!isWXBrowser() && !isJoJoBrowser()) {
        //   setTipVisible(true);
        //   JOJO.loading.close()
        //   return;
        // }
        _createOrder.requesting = false;
        if (newData.reallySuccess) {
          toPayAfter({
            data: newData,
            orderId
          } as any);
        } else {
          toPay();
        }
      });
    });
  };

  /**
   * 监听用户支付操作
   * @param {boolean} val 监听 || 移除监听
   */
  const listenOrRemovePayment = (val: any) => {
    if (JOJO.Os.app && JOJO.bridge.canUseBridge()) {
      try {
        if (val) {
          JOJO.bridge.on('appCalljs_paymentVerifying', payCompleteCallback);
        } else {
          JOJO.bridge.off('appCalljs_paymentVerifying', payCompleteCallback);
        }
      } catch (e) {
        console.log('bridge ready error', e);
      }
    }
  };

  /**
   * 用户支付完成回调
   */
  const payCompleteCallback = () => {
    console.log('客户端开始验证支付结果');
    // 客户端开始验证支付结果
    JOJO.loading.close();
    // setPayComfirmLoading(true);
  };

  /**
   * 确认支付
   */
  const toPay: any = async (payWay: number) => {
    canLeave.current = true;
    if (toPay?.requesting) {
      return;
    }

    const innerPayWay = payWay || curPayWay;

    if (!detail?.externalProductCode && [160, 180].includes(innerPayWay)) {
      JOJO.toast.show({
        icon: 'fail',
        content: '内购商品已失效'
      });
      JOJO.loading.close();
      return;
    }
    toPay.requesting = true;
    const params = {
      query,
      orderId: query?.orderId || orderIdRef.current,
      totalAmount: query?.totalAmount || detail?.totalCast,
      payWay: innerPayWay,
      orderPayId: query?.orderPayId || orderPayIdRef.current,
      showPayModel,
      cancelRequesting: () => {
        toPay.requesting = false;
      },
      continueRequesting: () => {
        toPay.requesting = true;
      }
    };
    console.log(111111, innerPayWay);

    try {
      if (innerPayWay === 160) {
        JOJO.showPage(`/order/create`, {
          params: {
            ...query,
            orderId: params.orderId,
            payWay,
            orderPayId: params.orderPayId,
            totalAmount: params.totalAmount,
            isAlreadyCreateOrder: 1
          },
          mode: 'replace'
        });
        // 苹果支付
        listenOrRemovePayment(true);

        // applePayV2({
        //   payEnv: 3,
        //   payWay: params.payWay,
        //   orderPayId: params.orderPayId,
        //   externalProductCode: detail?.externalProductCode,
        //   onSuccess: () => {
        //     listenOrRemovePayment(false);
        //     JOJO.loading.close()
        //     setPayComfirmLoading(true);
        //     toPay.requesting = false;
        //     getPayResult();
        //   },
        //   onFail: (res: any) => {
        //     listenOrRemovePayment(false);
        //     setPayComfirmLoading(false);
        //     JOJO.loading.close()
        //     toPay.requesting = false;
        //     if (res?.status === 404) {
        //       setBridgeFailVisible(true);
        //     } else if (res?.status === 9000001) {
        //       setVerifyFailVisible(true);
        //     } else {
        //       setPayFailVisible(true);
        //     }
        //   }
        // });
      } else if (innerPayWay === 180) {
        // 谷歌支付
        listenOrRemovePayment(true);
        JOJO.showPage(`/order/create`, {
          params: {
            ...query,
            orderId: params.orderId,
            payWay,
            orderPayId: params.orderPayId,
            totalAmount: params.totalAmount,
            isAlreadyCreateOrder: 1
          },
          mode: 'replace'
        });
        // googlePay({
        //   payEnv: 3,
        //   payWay: params.payWay,
        //   orderPayId: params.orderPayId,
        //   externalProductCode: detail?.externalProductCode,
        //   onSuccess: () => {
        //     listenOrRemovePayment(false);
        //     JOJO.loading.close()
        //     toPay.requesting = false;
        //     getPayResult();
        //   },
        //   onFail: (res: any) => {
        //     listenOrRemovePayment(false);
        //     setPayComfirmLoading(false);
        //     JOJO.loading.close()
        //     toPay.requesting = false;
        //     if (res?.status === 404) {
        //       setBridgeFailVisible(true);
        //     } else if (res?.status === 9000001) {
        //       setVerifyFailVisible(true);
        //     } else {
        //       setPayFailVisible(true);
        //     }
        //   }
        // });
      } else if ([110, 111, 112, 140, 142].includes(Number(innerPayWay))) {
        console.log(333333);

        // 支付宝
        await aliPay({
          ...params,
          curRoute: '/order/create',
          scanPayMethods: payWays.find((i: any) => [111, 142].includes(i.code))
        } as any);
        getPayResult();
        JOJO.loading.close();
      } else {
        // // 微信
        // await processWxPayV2({
        //   ...params
        // } as any);
        // getPayResult();
        // JOJO.loading.close()
      }
    } catch (error) {
      console.error(error);
      JOJO.loading.close();
    }
  };

  // 支付弹窗只有原生支付
  const showPayModel = (data: ScanPayDataProps) => {
    console.log(1111, data);

    pollingCountRef.current = 0;
    getPayResult(false);
  };

  /**
   * 获取支付结果
   */
  const getPayResult = async (showPayResultCheck = true) => {
    canLeave.current = true;
    let res = null;
    try {
      res = await getPaiedBillInfo({
        orderPayId: orderPayIdRef.current
      } as any);
    } catch (error) {
      console.error(error);
      // setPayComfirmLoading(false);
      return;
    }
    // if (unmounted) return;
    const { data } = res || {};
    if (!data) {
      // setPayComfirmLoading(false);
      return;
    }
    if ((JOJO.Os.wechatBrowser || JOJO.Os.app) && data?.reallySuccess) {
      // setPayComfirmLoading(false);
      // setPayResultVisible(false);
      // 微信浏览器内检测到支付完成弹框后直接跳转支付成功页面
      JOJO.toast.show({
        icon: 'success',
        content: '支付成功'
      });
      setTimeout(() => {
        toPayAfter({
          data,
          orderId: query?.orderId || orderIdRef.current,
          shizi_url,
          platformOrderSource: orderSource
        } as any);
      }, 1000);
      return;
    }
    if (data?.reallySuccess) {
      // setPayResultVisible(false);
      // setPayComfirmLoading(false);

      JOJO.toast.show({
        icon: 'success',
        content: '支付成功，请返回微信继续操作',
        duration: 99999
      });
      return;
    }

    // 没有支付成功，且轮询5次10秒展示未检测到支付结果
    if (pollingCountRef.current >= 30 && showPayResultCheck) {
      pollingCountRef.current = 0;
      // setPayResultVisible(true);
      // setPayComfirmLoading(false);
      clearTimeout(timerRef.current);
      return;
    }

    pollingCountRef.current += 1;

    timerRef.current = setTimeout(() => {
      getPayResult(showPayResultCheck);
    }, 2000);
  };

  return {
    _createOrder,
    getPayResult,
    toPay,
    priceComparisonInfo
  };
};
