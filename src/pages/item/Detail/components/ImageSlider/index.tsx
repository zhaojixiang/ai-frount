import { Swiper } from 'antd-mobile';
import React, { useMemo, useState } from 'react';

import Video from '@/components/Video';

import S from './index.module.less';

interface IProps {
  pageData: any;
}
export default function ImageSlider(props: IProps) {
  const { pageData } = props;
  const [currentCarouselNum, setCurrentCarouselNum] = useState(1);
  const { videoUrl, imageUrls } = pageData;
  /**
   *  marquee data
   */
  const marqueeList = useMemo(() => {
    if (videoUrl) {
      return [videoUrl, ...(imageUrls || [])];
    }
    return imageUrls || [];
  }, [videoUrl, imageUrls]);

  return (
    <div className={S.carouselOuter}>
      <Swiper
        className={S.carouselWp}
        indicator={false}
        autoplay={false}
        onIndexChange={(current: any) => {
          setCurrentCarouselNum(current + 1);
        }}>
        {marqueeList?.map((item: string, index: number) => {
          return (
            <Swiper.Item key={item} className={S.carouselWp}>
              {index === 0 && videoUrl ? (
                // 将video src由carouseVideo改为map数组中的item增加可读性
                <Video
                  key={item}
                  src={item}
                  cover={pageData?.videoHeadImageUrl}
                  onStart={() => {
                    // sensClickInitiative({
                    //   $element_name: '促销点击播放视频'
                    // });
                  }}
                  className={S.carouselWp}
                />
              ) : (
                <img src={item} alt='' />
              )}
            </Swiper.Item>
          );
        })}
      </Swiper>
      {marqueeList?.length > 1 && (
        <div className={S.carouselPage}>
          <span>{currentCarouselNum}</span>/<span>{marqueeList.length || 1}</span>
        </div>
      )}
    </div>
  );
}
