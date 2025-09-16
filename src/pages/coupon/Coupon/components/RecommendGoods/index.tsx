import classnames from 'classnames';
import qs from 'query-string';
import React, { useEffect, useState } from 'react';

import recommendImg from '@/assets/images/recommend-img.png';
import { getProductsByLinkIds } from '@/services/api';

import S from './index.module.less';

const Index: React.FC<any> = (props) => {
  const { activityDetail } = props;
  const { recommendProductLinks } = activityDetail || {};

  const [productsInActivity, setProductsInActivity] = useState<any[]>([]);

  useEffect(() => {
    _getProductsByLinkIds();
  }, []);
  /**
   * 获取活动商品
   */
  const _getProductsByLinkIds = () => {
    getProductsByLinkIds(recommendProductLinks).then((res) => {
      if (res?.resultCode === 200) {
        setProductsInActivity(res?.data);
      }
    });
  };

  const goHref = (href: string) => {
    // 使用 URL 类提取查询字符串
    const urlObj = new URL(href);
    const queryString = urlObj.search; // 获取 "?linkCode=NLMgKHoyLge&activityId=BgzMwkwRgk"
    // 去掉前导的问号
    const queryParams = qs.parse(queryString?.slice(1));
    // 获取 linkCode 参数
    const { linkCode }: any = queryParams || {};
    let url = href;
    if (linkCode?.startsWith('NL')) {
      // 促销跳转需透传 活动code
      url = `${href}&activityCode=${activityDetail?.activityCode}`;
    }
    window.location.href = url;
  };

  if (!productsInActivity.length) {
    return null;
  }

  return (
    <section className={S.recommendGoods}>
      <div className={S.img}>
        <img src={recommendImg} alt='' />
      </div>
      <div className={S.goodsWrapper}>
        {productsInActivity.map((g: any) => {
          let itemCss = S.goodsItem;
          if (productsInActivity.length === 1) {
            itemCss = classnames([S.goodsItem, S.oneGoods]);
          }

          return (
            <div key={g.id} className={itemCss}>
              <img src={g.imageUrl} alt='' />
              <div className={S.goodsInfo}>
                <h3>{g.productTitle}</h3>
                <div className={S.price}>
                  ¥<em>{typeof g.price === 'number' && g.price / 100}</em>起
                </div>
                <div className={S.btn} onClick={() => goHref(g.linkUrl)}>
                  购买
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Index;
