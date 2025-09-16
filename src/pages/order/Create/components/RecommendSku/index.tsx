// import { Icon } from '@jojo-design/mobile';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';

// import { sensClickInitiative, sensElementView } from '@/utils/sensors';
import S from './index.module.less';

// const { CheckBrushOutline } = Icon;

interface IProps {
  onHandleCheck: (val: boolean, curCheck?: string) => void;
  data: any;
}
function RecommendSku(props: IProps) {
  const { onHandleCheck, data } = props;

  const [checked, setChecked] = useState<boolean>(false);
  const [changeAni, setChangeAni] = useState<boolean>(false);
  const [curCheck, setCurCheck] = useState<any>(0);

  useEffect(() => {
    if (data?.skuList?.length) {
      // sensElementView({
      //   $title: '下单页',
      //   $element_name: '扩科商品曝光',
      //   sku_id: data?.skuList?.[curCheck]?.id
      // });
    }
  }, [curCheck, data]);

  useEffect(() => {
    if (data?.skuList) {
      setCurCheck(0);
    } else {
      setChecked(false);
    }
  }, [data]);

  /**
   * 勾选
   */
  const handleCheck = () => {
    setChecked(!checked);
    onHandleCheck(!checked, data?.skuList?.[curCheck]?.id);
    // sensClickInitiative({
    //   $title: '下单页',
    //   sku_id: data?.skuList?.[curCheck]?.id,
    //   $element_name: '扩科选择按钮'
    // });
  };

  /**
   * 换一换
   */
  const handleChange = () => {
    setChecked(false);
    // 执行动画
    setChangeAni(true);
    setTimeout(() => {
      setChangeAni(false);
    }, 500);
    if (curCheck < (data?.skuList?.length || 0) - 1) {
      setCurCheck(curCheck + 1);
    } else {
      setCurCheck(0);
    }
    onHandleCheck?.(false);
    // sensClickInitiative({
    //   $title: '下单页',
    //   $element_name: '扩科换一换',
    //   sku_id: data?.skuList?.[curCheck]?.id
    // });
  };

  /**
   * 无可选sku
   */
  if (!data?.skuList?.length) {
    return null;
  }
  return (
    <div className={S.timeLimitWelfare}>
      <div className={S.top_wraper}>
        <div className={S.top_title1}>{data?.mainTitle}</div>
        <div className={S.top_title2}>{data?.subTitle}</div>
        {data?.skuList?.length > 1 ? (
          <div className={S.change}>
            <div className={cx(S.change_icon, changeAni ? S.change_ani : '')} />
            <div className={S.change_text} onClick={handleChange}>
              换一换
            </div>
          </div>
        ) : null}
      </div>
      {data?.skuList?.map((item: any, index: number) => {
        if (index === curCheck) {
          return (
            <div className={S.bottom_card} onClick={handleCheck}>
              <div className={S.img_box} style={{ backgroundImage: `url(${item?.imageUrl})` }} />
              <div className={S.info_box}>
                <div className={S.info_title}>{item?.skuName}</div>
                <div className={S.info_other}>
                  <span className={S.price}>￥{item?.price}</span>
                  <div className={S.tag_box}>
                    {item?.keyWords?.map((it: string) => {
                      return <span className={S.tag}>{it}</span>;
                    })}
                  </div>
                </div>
              </div>
              <div className={S.check_box}>
                {checked ? (
                  <div className={S.checked}>{/* <CheckBrushOutline color='#fff' /> */}</div>
                ) : (
                  <div className={S.noCheck} />
                )}
              </div>
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
}

export default RecommendSku;
