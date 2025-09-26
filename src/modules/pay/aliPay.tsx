import QRCode from 'qrcode';
import qs from 'query-string';

import { getAliExist } from '@/lib/utils';
import { billCheckOutByToken, getTokenForBillCheckOut } from '@/services/api/orderPay';
import { getEnvEnum } from '@/services/common';
import { FROUNT_URL, FROUNT_URL_OLD } from '@/services/config';

import AliPayScan from './components/AliPayScan';
import GuidePop from './components/GuidePop';

type QueryParams = {
  shopCode?: string;
  isUpdate?: string;
  shizi_url?: string;
  bizType?: string;
  orderSource?: string;
  [key: string]: any;
};

type AliPreparePayProps = {
  payWay: number;
  query: QueryParams;
  orderPayId: number;
  aliCashierType: string;
  curStage: any;
  orderId: string;
  totalAmount: string;
  orderType: 'learning_pay' | undefined;
  curRoute: string;
  scanPayMethods: { code: 111 | 142 };
  showPayModel: (props: {
    scanUrl: string;
    totalAmount: string;
    payWay: number;
    token?: string;
  }) => void;
  cancelRequesting: () => void;
  continueRequesting: () => void;
};

// 支付宝token支付
const aliPreparePay = async ({ token }: { token: string }) => {
  if (!token) {
    JOJO.toast.show({ content: '没获取到支付token', duration: 2000, icon: 'fail' });
    return;
  }

  try {
    const response = await billCheckOutByToken({ token });
    const { data: resData, errorMessage } = response;
    const { data, payWay } = resData || {};

    if (!resData || !data) {
      JOJO.toast.show({ content: errorMessage || '系统开小差啦', duration: 2000, icon: 'fail' });
      return;
    }

    const { content } = data;
    if (!content) {
      JOJO.toast.show({ content: '创建支付宝预付单失败!', duration: 2000, icon: 'fail' });
      return;
    }

    if (payWay === 140) {
      // 如果是中行
      window.location.replace(content);
      return;
    }

    // 获取到支付宝支付表单以及自动提交脚本添加到dom并自动提交
    const div = document.createElement('div');
    div.innerHTML = content;
    document.body.appendChild(div);
    if (document.forms[0]) {
      document.forms[0].submit();
    } else {
      JOJO.toast.show({ content: '支付表单异常', duration: 2000, icon: 'fail' });
    }
  } catch (error) {
    console.error('支付处理失败:', error);
    JOJO.toast.show({ content: '支付处理失败', duration: 2000, icon: 'fail' });
  }
};

/**
 * 处理支付宝在线支付和支付宝中行支付 (payWay: 110, 140)
 */
async function handleAlipayOnline(
  props: AliPreparePayProps,
  token: string,
  alipayExist: boolean
): Promise<boolean> {
  const {
    query,
    orderId,
    payWay,
    orderPayId,
    totalAmount,
    curRoute,
    continueRequesting,
    cancelRequesting,
    showPayModel
  } = props;
  console.log(55555, props);

  const { shopCode, isUpdate, shizi_url, bizType, orderSource } = query;
  // await aliPreparePay({ token });
  // return;
  if (JOJO.Os.app) {
    console.log(1111111, alipayExist, token);

    if (alipayExist) {
      await aliPreparePay({ token });
      return true;
    } else {
      continueRequesting();
      // 未安装支付宝
      // 检测功能只在app有效，app内不接入中行
      // 获取支付二维码
      try {
        const response = await billCheckOutByToken({ token });
        cancelRequesting();
        const { data: payData } = response.data || {};
        const { amount, hasPaid, content } = payData || {};

        if (hasPaid) {
          return true;
        }

        if (content) {
          const scanUrl = window.btoa(content);
          showPayModel({
            scanUrl,
            totalAmount: amount || totalAmount,
            payWay,
            token
          });
          return true;
        } else {
          const url = `/order/aliScanPay?${qs.stringify({
            ...query,
            orderId,
            bizType,
            token,
            isUpdate,
            shizi_url,
            shopCode,
            orderPayId,
            orderSource,
            totalAmount,
            payWay,
            orderType: props.orderType,
            backRoute: curRoute,
            isAlreadyCreateOrder: 1
          })}`;
          JOJO.showPage(`${FROUNT_URL_OLD}${url}`, { mode: 'replace', to: 'externalWeb' });
          return true;
        }
      } catch (error) {
        cancelRequesting();
        console.error('获取支付二维码失败:', error);
        JOJO.toast.show({ content: '获取支付二维码失败', duration: 2000, icon: 'fail' });
        return false;
      }
    }
  } else if (JOJO.Os.wechatBrowser) {
    // 显示引导蒙层 并 replace 当前页面
    // JOJO.showPage(curRoute, {
    //   params: {
    //     ...query,
    //     orderId,
    //     payWay,
    //     token,
    //     orderPayId,
    //     totalAmount,
    //     aliUrl: '',
    //     isAlreadyCreateOrder: 1
    //   },
    //   mode: 'replace'
    // });
    const a = JOJO.popup(
      <GuidePop
        onClose={() => {
          a.destroy();
        }}
      />,
      {
        animate: true,
        bodyStyle: {
          width: '100vw',
          height: '100vh',
          borderRadius: 0,
          margin: 0,
          backgroundColor: 'transparent'
        }
      }
    );
    return true;
  } else {
    console.log(4444444, curRoute);

    JOJO.showPage(curRoute, {
      params: {
        ...query,
        orderId,
        payWay,
        token,
        orderPayId,
        totalAmount,
        aliUrl: '',
        isAlreadyCreateOrder: 1
      },
      mode: 'replace'
    });
    await aliPreparePay({ token });
    return true;
  }
}

/**
 * 处理其他支付方式
 */
async function handleOtherPay(props: AliPreparePayProps, token: string): Promise<void> {
  const { orderId } = props;
  JOJO.showPage(`/order/create`, {
    mode: 'replace',
    params: {
      ...JOJO.Utils.getQuery(),
      orderId,
      isAlreadyCreateOrder: 1
    }
  });
  let detail;
  try {
    const res = await billCheckOutByToken({ token });
    const { data } = res || {};
    if (res?.resultCode === 200) {
      if (data.hasPaid) {
        return;
      }
      // 有content url才能生成二维码
      if (data.data.content) {
        const aliPayUrl = data.data.content;
        QRCode.toDataURL(aliPayUrl, { margin: 0 })
          .then((url) => {
            detail = { ...data.data, content: url };
            const a = JOJO.popup(
              <AliPayScan
                onClose={() => {
                  a.destroy();
                }}
                info={detail}
              />,
              {
                animate: true,
                bodyStyle: {
                  width: '100vw',
                  height: '100vh',
                  borderRadius: 0,
                  margin: 0,
                  backgroundColor: 'transparent'
                }
              }
            );
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * 支付宝获取支付token
 * @param props AliPreparePayProps
 * @returns
 */
export const aliPay = async (props: AliPreparePayProps) => {
  const {
    orderPayId,
    scanPayMethods,
    curRoute = '/order/create',
    payWay,
    query,
    cancelRequesting = () => {}
  } = props;

  try {
    const alipayExist = await getAliExist();
    const payEnv = await getEnvEnum();

    // 统一获取支付信息
    const params = {
      // 当前支付方式为 支付宝支付 ，但用户未安装支付宝时，用扫码付替换
      payWay: payWay === 110 && !alipayExist ? scanPayMethods.code || 111 : payWay,
      backUrl: `${FROUNT_URL}${curRoute}?${qs.stringify({
        ...query,
        isAlreadyCreateOrder: '1'
      })}`,
      payBillId: orderPayId,
      payEnv
    };

    const { data } = await getTokenForBillCheckOut(params);

    cancelRequesting();
    if (!data) {
      JOJO.toast.show({ content: '获取支付链接失败', duration: 2000, icon: 'fail' });
      return;
    }

    // 根据不同的支付方式处理
    if (payWay === 110 || payWay === 140) {
      // 支付宝在线支付, 支付宝中行
      await handleAlipayOnline(props, data, alipayExist);
    } else {
      // 其他支付方式
      handleOtherPay(props, data);
    }
  } catch (error) {
    cancelRequesting();
    console.error('支付处理异常:', error);
    JOJO.toast.show({ content: '支付处理异常', duration: 2000, icon: 'fail' });
  }
};
