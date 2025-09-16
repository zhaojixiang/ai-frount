import cx from 'classnames';
import { useEffect } from 'react';

import Check from '@/components/Check';

// import { sensClickInitiative, sensElementView } from '@/utils/sensors';
import S from './index.module.less';

interface IProps {
  payWays: any;
  curPayWay: any;
  onChange: (code: number) => void;
  subscriptionType?: string;
}

export default (props: IProps) => {
  const { payWays, curPayWay, onChange, subscriptionType } = props;

  useEffect(() => {
    if (subscriptionType) {
      // sensClickInitiative({
      //   $element_name: '确认订单收银台-支付方式选择',
      //   $element_content: '支付宝订阅'
      // });
    } else if (curPayWay) {
      // const payWay = payWays?.find((item: any) => item?.code === curPayWay);
      // sensClickInitiative({
      //   $element_name: '确认订单收银台-支付方式选择',
      //   $element_content: `${payWay?.name} ${payWay?.code}`
      // });
    }
  }, [curPayWay, payWays, subscriptionType]);

  useEffect(() => {
    if (subscriptionType) {
      // sensElementView({
      //   $element_name: '确认订单收银台-支付方式',
      //   $element_content: '支付宝订阅'
      // });
    } else if (payWays?.length) {
      // sensElementView({
      //   $element_name: '确认订单收银台-支付方式',
      //   $element_content: `${payWays
      //     ?.map((item: any) => `${item?.name}(${item?.code})`)
      //     ?.toString()}`
      // });
    }
  }, [payWays, subscriptionType]);

  // 渲染单个支付方式项
  const renderPayWayItem = (item: any) => {
    let iconClass = '';
    let label = '';
    let extraContent = null;
    if (item.platform === 'WxPay') {
      // 微信支付
      iconClass = S.wxpayIcon;
      label = '微信支付';
    } else {
      // 判断支付方式类型
      if ([110, 140]?.includes(item?.code)) {
        // 支付宝在线支付 | 支付宝(中行)
        iconClass = S.alipayIcon;
        label = '支付宝';
      } else if ([111, 142]?.includes(item?.code)) {
        // 支付宝当面付 | 中行支付宝扫码付
        iconClass = S.aliscanIcon;
        label = '支付宝扫码付';
      } else if ([999]?.includes(item?.code)) {
        // 先学后付
        iconClass = S.payAfterIcon;
        label = '先学后付';
        if (item?.code === 999) {
          extraContent = <span className={S.payAfterTips}>试学30天，满意再付款</span>;
        }
      } else if ([160]?.includes(item?.code)) {
        // Apple Pay
        iconClass = S.appleIcon;
        label = item?.name;
      } else if ([180]?.includes(item?.code)) {
        // Google Pay
        iconClass = S.googleIcon;
        label = item?.name;
      } else {
        return null; // 不支持的支付方式
      }
    }
    return (
      <div className={cx(S.itemBox)} key={item?.code} onClick={() => onChange(item?.code)}>
        <div className={S.label}>
          <div className={cx(S.labelIcon, iconClass)} />
          {label} {extraContent}
        </div>
        <Check
          checkActiveClass={S.check}
          noCheckClass={S.noCheck}
          check={curPayWay === item?.code}
        />
      </div>
    );
  };

  return (
    <div className={S.priceWrap}>
      {subscriptionType ? (
        <div className={cx(S.itemBox)}>
          <div className={S.label}>
            <div className={cx(S.labelIcon, S.alipayIcon)} />
            支付宝
          </div>
          <Check checkActiveClass={S.check} noCheckClass={S.noCheck} check />
        </div>
      ) : (
        <>{payWays?.map((item: any) => renderPayWayItem(item))}</>
      )}
    </div>
  );
};
