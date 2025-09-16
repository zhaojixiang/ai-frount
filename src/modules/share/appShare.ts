interface AppShareProps {
  data?: {
    title?: string;
    desc?: string;
    link?: string;
    imgUrl?: string;
  };
  menuShareClick?: () => void;
  sharePageToWXCircle?: () => void;
  onShare?: () => void;
  sharePageToWX?: () => void;
  notShowShare?: boolean; // 客户端会将右上角的分享按钮逻辑调整为：弹出分享弹窗，由用户选择分享到
}

function appTrigger(triggerName: any) {
  if (
    (window as any).jsToApp[triggerName] &&
    typeof (window as any).jsToApp[triggerName] === 'function'
  ) {
    return (window as any).jsToApp[triggerName]();
  } else {
    console.log(`there isn't a function${triggerName}`);
    return false;
  }
}
const AppShare = (
  eventName: 'shareImageToWXCircle' | 'shareMiniProgram',
  data: any,
  cb?: (res: any) => void
) => {
  if (eventName === 'shareImageToWXCircle') {
    const bridgeData = {
      platformType: 0,
      title: data?.title,
      desc: data?.desc,
      url: data?.url,
      scene: data?.scene,
      shareType: 0,
      image: data?.image
    };
    JOJO.bridge.call('shareToPlatform', bridgeData, (res: any = {}) => {
      if (typeof cb === 'function') {
        cb(res);
      }
    });
  } else {
    JOJO.bridge.call(
      'shareMiniProgram',
      {
        appId: JOJO.Os.envName === 'pro' ? 'gh_4766cc74fd5d' : 'gh_87f2400c676b',
        path: `/pages/transform_space/main?type=webview&needLogin=1&linkUrl=${encodeURIComponent(
          data.url
        )}`,
        type: 0,
        ...data
      },
      (res: any = {}) => {
        if (typeof cb === 'function') {
          cb(res);
        }
      }
    );
  }
};

const appShareH5Config = ({
  data,
  menuShareClick,
  onShare,
  sharePageToWXCircle,
  sharePageToWX,
  notShowShare
}: AppShareProps) => {
  const appShareData: any = {
    title: data?.title || document.title,
    desc: data?.desc || '',
    // imgUrl:
    //   data?.imgUrl ||
    //   'https://jojopublic.oss-cn-hangzhou.aliyuncs.com/jojoread/wxapp/course/default-avatar-share.png',
    image:
      data?.imgUrl ||
      'https://jojopublic.oss-cn-hangzhou.aliyuncs.com/jojoread/wxapp/course/default-avatar-share.png',
    // link: data?.link || window.location.href,
    url: data?.link || window.location.href
  };

  if (JOJO.Os.app) {
    const params = {
      showShare: !notShowShare
    };

    JOJO.bridge.call('menuShare', params);

    if (!(window as any).jsToApp) {
      (window as any).jsToApp = {};
    }
    (window as any).appTrigger = appTrigger;

    // 右上角分享按钮点击
    (window as any).jsToApp.menuShareClick = () => {
      if (menuShareClick) menuShareClick();
      if (onShare) onShare();
    };
    // 分享到朋友圈点击
    (window as any).jsToApp.sharePageToWXCircle = () => {
      if (sharePageToWXCircle) sharePageToWXCircle();
      AppShare('shareImageToWXCircle', { ...appShareData, scene: 1 }, (res) => {
        console.log(res);
      });
    };
    // 分享到好友点击
    (window as any).jsToApp.sharePageToWX = () => {
      if (sharePageToWX) sharePageToWX();
      AppShare('shareImageToWXCircle', { ...appShareData, scene: 0 }, (res) => {
        console.log(res);
      });
    };
  }
};

export { appShareH5Config };
