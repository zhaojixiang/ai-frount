import { useRequest } from 'ahooks';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import StateHandler, { LoadStatus } from '@/components/StateHandler';
import { getCouponActivityDetail } from '@/services/api';

import S from './index.module.less';

const Index: React.FC<any> = () => {
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('activityId') || '';

  const [pageStatus, setPageStatus] = useState<any>({});
  const [detail, setDetail] = useState<any>({});

  const { loading, runAsync: _getCouponActivityDetail } = useRequest(getCouponActivityDetail, {
    manual: true
  });

  const { data: activityDetail } = detail || {};

  const { activityDescription } = activityDetail || {};

  useEffect(() => {
    initPage();
  }, []);

  useEffect(() => {
    if (loading) {
      setPageStatus({
        status: LoadStatus.Loading,
        option: {}
        // loadingElement: <Skeleton />
      });
    }
  }, [loading]);

  const initPage = async () => {
    try {
      const res = await _getCouponActivityDetail({ activityId });
      setPageStatus({ res });
      const { resultCode, data } = res || {};
      setPageStatus({ res });
      if (resultCode === 200) {
        setDetail(data);
      }
    } catch (error) {
      console.log('获取优惠券详情失败', error);
      setPageStatus({
        status: LoadStatus.Error,
        errorMsg: '获取优惠券详情失败'
      });
    }
  };

  // 活动描述
  let detailArr = [];
  if (typeof activityDescription === 'string' && activityDescription.length) {
    detailArr = activityDescription.split('$$');
  } else {
    return null;
  }

  return (
    <StateHandler options={pageStatus}>
      <main className={S.rules}>
        {detailArr.map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </main>
    </StateHandler>
  );
};

export default Index;
