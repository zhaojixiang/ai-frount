import { Modal } from 'antd-mobile';

import S from './index.module.less';

export default function ReNew() {
  const handleBtn = () => {
    const linkUrl = encodeURIComponent(window.location.href);
    const params = encodeURIComponent(`type=webview&linkUrl=${linkUrl}`);
    let appid;
    let env_version;
    // 是不是生产环境
    if (JOJO.Os.debug) {
      // 非生产环境跳转到使用JOJOup测试小程序（鹦鹉学习乐园）的体验版 主要配置测试小程序的 webview网页地址，体验版可以开启测试模式忽略
      appid = 'wx0cf86b261e2591a6';
      env_version = 'trial';
    } else {
      // 生产环境跳转到使用JOJOup小程序 主要配置正式小程序的 webview网页地址，生产一定要加webview域名配置！！！
      appid = 'wxba54ef2582fad7ca';
      env_version = 'release';
    }
    const url = `weixin://dl/business/?appid=${appid}&path=pages/transform_space/main&query=${params}&env_version=${env_version}`;

    window.location.href = url;
  };
  return (
    <Modal
      visible={true}
      title='提示'
      content={<div className={S.content}>即将跳转微信小程序</div>}
      bodyClassName={S.modalAlert}
      actions={[
        {
          key: 'confirm',
          text: '前往微信小程序支付',
          onClick: handleBtn,
          className: S.confirmBtn
        }
      ]}
    />
  );
}
