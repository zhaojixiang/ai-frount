// import qs from 'query-string';

// import { getWxExist } from '@/lib/utils';
// import { getEnvEnum } from '@/services/common';
// import { FROUNT_URL, FROUNT_URL_OLD } from '@/services/config';

// // 获取支付参数
// export const getPayParamsV2 = ({
//   query,
//   payWay,
//   orderId,
//   payEnv,
//   totalAmount,
//   orderPayId,
//   alipayExist,
//   backRoute = '/order/create',
//   scanPayMethods
// }) => {
//   const { bizType, shopCode, shizi_url, orderSource } = query;
//   let paramPayWay = payWay;

//   let backUrl = '';
//   // 微信中行
//   if (payWay === 141) {
//     backUrl = `${FROUNT_URL_OLD}/order/wxTicket?${qs.stringify({
//       orderId,
//       orderPayId
//     })}`;
//   } else {
//     backUrl = `${FROUNT_URL_OLD}${backRoute}?${qs.stringify({
//       ...query,
//       bizType,
//       orderPayId,
//       orderId,
//       shopCode,
//       shizi_url,
//       orderSource,
//       totalAmount,
//       isAlreadyCreateOrder: '1'
//     })}`;
//   }
//   // 支付宝在线支付 | 支付宝当面支付
//   if ([110, 111].includes(payWay)) {
//     if (!alipayExist) {
//       // app内只有这几种原生支付方式
//       paramPayWay = (scanPayMethods && scanPayMethods.code) || 111;
//     }
//   }

//   const params = {
//     payWay: paramPayWay,
//     payEnv,
//     backUrl,
//     payBillId: orderPayId
//   };
//   // 微信小程序支付 & 微信支付 时获取 appId
//   if (payEnv === 2 && payWay === 101) {
//     const match = navigator.userAgent.match(/wx[0-9a-z]+$/);
//     if (match && match[0]) {
//       const appId = match[0];
//       return { ...params, wechatAppId: appId };
//     }
//   }
//   return params;
// };
// // 微信支付
// export const processWxPayV2 = async (props: {
//   payWay: number;
//   query: any;
//   orderId: string;
//   orderPayId: number;
//   curRoute: string;
//   totalAmount: string;
//   showPayModel: (props: { scanUrl: string; totalAmount: string; payWay: number }) => void;
//   cancelRequesting: () => void;
//   continueRequesting: () => void;
//   isNativeWx?: boolean;
// }) => {
//   const {
//     payWay,
//     query,
//     orderPayId,
//     orderId,
//     curRoute = '/order/create',
//     showPayModel,
//     totalAmount,
//     cancelRequesting = () => {},
//     continueRequesting = () => {},
//     isNativeWx
//   } = props;
//   const { bizType, shizi_url, shopCode, isUpdate } = query;

//   const wechatExist = await getWxExist();
//   const payEnv = await getEnvEnum();

//   const params = getPayParamsV2({
//     payWay,
//     payEnv,
//     totalAmount,
//     orderId,
//     query,
//     orderPayId,
//     backRoute: curRoute
//   });

//   const payConfigRes = await billCheckOut(params);
//   const {
//     data: resData,
//     status: payConfigResStatus,
//     resultCode: payConfigResultCode,
//     errorMsg: payConfigErrorMsg
//   } = payConfigRes;
//   cancelRequesting();

//   const { data: payConfigData } = resData || {};
//   if (payConfigResultCode !== 200 || !payConfigData) {
//     JOJO.toast.show({ content: payConfigErrorMsg || '系统开小差啦', duration: 2000, icon: 'fail' });
//     return;
//   }
//   const isMiniApp = await getIsMiniprogramEnv();

//   // 小程序支付
//   if (isMiniApp) {
//     continueRequesting();
//     const url = '/pages/pkgs/course_about/pages/request_payment/main';
//     JOJO.showPage(url, {
//       params: {
//         ...payConfigData,
//         orderId,
//         backUrl: `${FROUNT_URL}${curRoute}?${qs.stringify({
//           ...query,
//           orderId,
//           orderPayId,
//           totalAmount,
//           payWay,
//           isAlreadyCreateOrder: 1
//         })}`
//       },
//       to: 'mini',
//       onNavigateToMiniComplete: () => {
//         cancelRequesting();
//       }
//     });
//     return;
//   }

//   // app支付
//   if (JOJO.Os.app) {
//     const redirectUrl = encodeURIComponent(
//       `${FROUNT_URL}${curRoute}?${qs.stringify({
//         ...query,
//         orderPayId,
//         payWay,
//         orderId,
//         totalAmount,
//         isAlreadyCreateOrder: 1
//       })}`
//     );
//     const wechatPayUrl = `${payConfigData.mwebUrl}&redirect_url=${redirectUrl}`;
//     if (wechatExist) {
//       // 跳转微信支付h5页面
//       window.location.replace(wechatPayUrl);
//     } else {
//       // 简化的先判断没有微信（只有在app内才会返回false，但是和整个逻辑保持一致，先判断是否在app内）
//       // 同时展示金额应该从支付里取
//       const { amount } = payConfigData;
//       const scanUrl = window.btoa(
//         `${FROUNT_URL}/order/pending?${qs.stringify({
//           orderId,
//           orderPayId,
//           totalAmount,
//           isEntity: true,
//           isUpdate,
//           shizi_url,
//           preFetch: !wechatExist,
//           shopCode,
//           bizType
//         })}`
//       );
//       showPayModel({ scanUrl, totalAmount: amount, payWay });
//     }
//     return;
//   }

//   JOJO.showPage(curRoute, {
//     params: {
//       ...query,
//       orderId,
//       payWay,
//       totalAmount,
//       orderPayId,
//       isAlreadyCreateOrder: 1
//     },
//     mode: 'replace'
//   });
//   // 原生支付
//   continueRequesting();
//   // 招行支付
//   if (payWay === 130 && payEnv === 1) {
//     const { content } = payConfigData;

//     window.location.href = content;
//     return;
//   }
//   // 中行支付
//   if (payWay === 141 && payEnv === 1) {
//     const { content } = payConfigData;
//     const payParams = content && JSON.parse(content);

//     WxPay(payParams, (res) => {
//       cancelRequesting();

//       if (res !== 'ok') {
//         JOJO.toast.show({ content: '支付失败!', duration: 2000, icon: 'fail' });
//         return;
//       }
//       JOJO.toast.show({ content: '支付成功', duration: 2000, icon: 'success' });
//       // 先学后付二次支付，无需跳转 /order/pending
//       if (curRoute === '/order/payForLearningFirst') {
//         return;
//       }
//       const url = `/order/pending?${qs.stringify({
//         orderId,
//         orderPayId,
//         isEntity: true,
//         isUpdate,
//         shizi_url,
//         shopCode
//       })}`;
//       JOJO.showPage(url, { mode: 'replace' });
//     });
//     return;
//   }

//   WxPay(payConfigData, (res) => {
//     cancelRequesting();
//     if (res !== 'ok') {
//       JOJO.toast.show({ content: '支付失败!', duration: 2000, icon: 'fail' });
//       return;
//     }
//     JOJO.toast.show({ content: '支付成功', duration: 2000, icon: 'success' });
//     if (isNativeWx) {
//       const href = window.location.href.replace('preFetch=true', '');
//       window.location.href = href;
//     } else {
//       // 先学后付二次支付，无需跳转 /order/pending
//       if (curRoute === '/order/payForLearningFirst') {
//         return;
//       }
//       const url = `/order/pending?${qs.stringify({
//         orderId,
//         orderPayId,
//         isEntity: true,
//         isUpdate,
//         shizi_url,
//         shopCode,
//         bizType
//       })}`;
//       JOJO.showPage(`${FROUNT_URL_OLD}${url}`, { mode: 'replace' });
//     }
//   });
// };
