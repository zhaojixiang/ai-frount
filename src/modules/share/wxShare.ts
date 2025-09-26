import { Toast } from 'antd-mobile';
import { t } from 'i18next';
import wx from 'weixin-js-sdk';

import { getWxSignature } from '@/services/api/product';

const _trans = t;

const { location } = window;

const defaultJsApiList = [
  'onMenuShareAppMessage',
  'onMenuShareTimeline',
  'updateAppMessageShareData',
  'updateTimelineShareData',
  'showMenuItems'
];

export function WxConfigInit(jsApiList = []) {
  getWxSignature({
    url: location.href
  }).then(function ({ data }) {
    const newData = data || {};
    if (!newData.appId) {
      console.log('no appid');
      return;
    }
    wx.config({
      ...newData,
      jsApiList: [...defaultJsApiList, ...jsApiList]
    });
    wx.error(function (res: any) {
      console.log('err', res);
    });
  });
}

function WxShare(props: any, inited?: any) {
  const { title, desc, link, isShowTipToast = true } = props;
  let { imgUrl } = props;
  if (/^\/\//.test(imgUrl)) {
    imgUrl = [location.protocol, imgUrl].join('');
  }
  wx.ready(() => {
    wx.checkJsApi({
      jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'], // 需要检测的JS接口列表
      success(res: any) {
        const { checkResult } = res;
        console.log('check js api result', res);
        const options = {
          title, // 分享标题
          desc, // 分享描述
          link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl, // 分享图标
          success() {
            // 分享成功
            console.log('share success');
          },
          cancel() {
            // 分享取消
            console.log('share cancel');
          }
        };
        if (checkResult.updateAppMessageShareData) {
          wx.updateAppMessageShareData(options);
          wx.updateTimelineShareData(options);
          if (inited) {
            return;
          }
          if (isShowTipToast) {
            Toast.show(
              _trans('Wx.PleaseClickInTheUpperRightCornerToShare', '请点击右上角【...】分享')
            );
          }
          wx.showMenuItems({
            menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:favorite'] // 要显示的菜单项，所有menu项见附录3
          });
        }
        if (inited) {
          return;
        }
        wx.onMenuShareAppMessage(options);
        wx.onMenuShareTimeline(options);
      }
    });
  });
}

export default WxShare;
