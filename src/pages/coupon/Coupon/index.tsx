import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import qs from 'query-string';

import PageLoading from '@/components/PageLoading';
import ReNew from '@/components/ReNew';
import { needNewAuth } from '@/lib/auth';
import { getCouponActivityDetail } from '@/services/api';

import CountDown from './components/CountDown';
import CouponWrapper from './components/CouponWrapper';
import RecommendGoods from './components/RecommendGoods';
import S from './index.module.less';

console.log(9999999, JOJO.Os);

export default function Coupon() {
  const [isShowModal, setIsShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  const useType = searchParams.get('useType');
  const activityId = searchParams.get('activityId') || '';

  const {
    data: pageDataRes,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['getCouponActivityDetail'],
    queryFn: () => getCouponActivityDetail({ activityId })
  });

  const { data: activityDetail } = pageDataRes || {};
  const { imageUrl, pickState, endTime, recommendProductLinks, bgColor } = activityDetail || {};

  useEffect(() => {
    //   if (Object.keys(linkCodeMap).includes(query.activityId)) {
    //     router.push(
    //       `/item/detail?${qs.stringify({
    //         linkCode: (linkCodeMap as any)[query.activityId]
    //       })}`
    //     );
    //     return;
    //   }

    // 当在新的浏览器中，并且是续费链接时，展示弹窗
    if (JOJO.Os.jojoup && useType === 'UPGRADE_CHINESE' && !JOJO.Os.wechatBrowser && !JOJO.Os.xcx) {
      setIsShowModal(true);
      return;
    }

    if (needNewAuth()) {
      return;
    }
    // 置空useType
    if (useType !== 'UPGRADE_CHINESE') {
      sessionStorage.setItem('l9UpdateC1UseType', '');
    }
    if (JOJO.Os.jojoup && useType === 'UPGRADE_CHINESE') {
      // 判断当前链路，是否是续费
      sessionStorage.setItem('l9UpdateC1UseType', 'UPGRADE_CHINESE');

      if (JOJO.Os.wechatBrowser || JOJO.Os.xcx) {
        // 缓存中是否有code对应的trackID
        const traceCodeSameUid = localStorage.getItem('traceCodeUid') === Cookies.get('uid');
        // 是不是当前登录的用户已经有追踪码了
        if (!traceCodeSameUid) {
          // 在追踪码页面中，最后跳转的地址
          const trackUrl = window.location.href;
          // 调转到UC换取授权unionId,然后跳转到追踪码页面，然后跳回来。
          const requestUrl = `https://mall.tinman.cn/item/track?trackUrl=${encodeURIComponent(
            trackUrl
          )}&linkCode=${activityId}`;
          const url = `https://uc-api.tinman.cn/page/wechatMp/portal/entrance?mode=3&wechatAuthType=1&requestUrl=${encodeURIComponent(
            requestUrl
          )}`;
          localStorage.setItem('打印日志：跳转到UC情况下的路由1', url);
          localStorage.setItem('打印日志：跳转到UC情况下的路由2', requestUrl);
          window.location.href = url;
        }
      }
    }
  }, []);

  const onRuleClick = () => {
    // 我想要跳转到活动规则页面
    JOJO.showPage(`/coupon/rules?${qs.stringify({ activityId })}`);
  };

  // 小升初环境拦截弹窗
  if (isShowModal) return <ReNew />;

  return (
    <PageLoading loading={isLoading} res={pageDataRes} retry={refetch}>
      <div className={S.main} style={{ backgroundColor: bgColor || '#FFD037' }}>
        <div className={S.rules} onClick={onRuleClick}>
          活动规则
        </div>
        <img className={S.headBack} src={imageUrl} alt='' />
        {pickState !== 'END' && <CountDown endTime={endTime} />}
        {/* 优惠券领取模块 */}
        <div className={S.couponWrapper}>
          <CouponWrapper activityDetail={activityDetail} />
        </div>
        {/* 推荐商品列表 */}
        {recommendProductLinks?.length ? <RecommendGoods activityDetail={activityDetail} /> : null}
      </div>
    </PageLoading>
  );
}
