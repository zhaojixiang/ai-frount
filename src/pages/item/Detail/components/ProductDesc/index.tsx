import React, { useMemo } from 'react';

import S from './index.module.less';

export default function ProductDesc(props: any) {
  const { pageData } = props;
  const { productDesc, detailHtml } = pageData;

  const productDescList = useMemo(() => {
    return productDesc ? productDesc.split(/[,，]/) : [];
  }, [productDesc]);

  return (
    <div className={S.productDesc}>
      {productDescList?.length ? (
        <div className={S.descZone}>
          <span className={S.descTitle}>说明</span>
          {productDescList?.map((item: string, index: number) => {
            return item ? (
              <span className={S.descItem} key={`desc-${index}`}>
                <span className={S.descText}>{item}</span>
                <span className={S.descDot}>&sdot;</span>
              </span>
            ) : null;
          })}
        </div>
      ) : null}
      <div className={S.detailZone}>
        <div dangerouslySetInnerHTML={{ __html: detailHtml }} />
      </div>
    </div>
  );
}
