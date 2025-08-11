import React, { useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSearchParams } from 'react-router-dom';

import AMapLoader from '@amap/amap-jsapi-loader';
import { useQuery } from '@tanstack/react-query';
import { Toast } from 'antd-mobile';
import { LeftOutline } from 'antd-mobile-icons';
// import { Icon, Toast } from '@jojo-design/mobile';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';

import icon_copy from '@/assets/image/copy.png';
import FixBottom from '@/components/FixBottom';
// import Loading from '@/components/Loading';
import PageLoading, { LoadStatus } from '@/components/PageLoading';
import { GAODE_MAP } from '@/lib/base';
import { getDeliveryTrace, getOrderDetail } from '@/services/api/order';

// import { fromTimeStampToDate } from '@/utils/dateUtils';
// import { sensClickInitiative, sensPageView } from '@/utils/sensors';

// import { goService } from '../ListV2/components/SelectOrderPopup';
import DeliveryTimeLine from './components/DeliveryTimeLine';
import S from './index.module.less';

// const { LeftBoldOutline } = Icon;

let timer: any = null;

export default function Detail() {
  const [searchParams] = useSearchParams();
  const deliveryRecordId = searchParams.get('deliveryRecordId');
  const expressNumber = searchParams.get('expressNumber') || '';
  const gpoNo = searchParams.get('gpoNo') || '';
  const expressNo = searchParams.get('expressNo') || '';

  //   const [loadOptions, setLoadOptions] = useState({});
  const [detail, setDetail] = useState<any>({});
  //   const [isLoading, setIsLoading] = useState<boolean>(false);
  const mapRef = useRef<any>(null);

  const locationRef = useRef<any>(null);

  const {
    data: pageDataRes,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['getDeliveryDetail'],
    queryFn: () => getDeliveryTrace({ gpoNo, expressNo })
  });
  console.log(111115, gpoNo, expressNo, pageDataRes);

  useEffect(() => {
    console.log('pageDataRes', pageDataRes);

    if (!isEmpty(pageDataRes?.data)) {
      setDetail(pageDataRes?.data);
      locationRef.current = {
        city: pageDataRes?.data?.city,
        area: pageDataRes?.data?.area
      };
      initMap();
    }
  }, [pageDataRes]);

  //   const { data } = pageDataRes || {};

  //   const getDeliveryDetail = async (val: any) => {
  //     const params = {
  //       gpoNo: val?.gpoNo,
  //       expressNo: val?.expressNo
  //     };
  //     const res = await getDeliveryTrace({
  //       ...params
  //     });
  //     const data = res.data || res.content || [];
  //     setDetail(data);
  //     locationRef.current = {
  //       city: data?.city,
  //       area: data?.area
  //     };
  //     initMap();
  //   };

  const initMap = () => {
    // 本地调试设置密钥
    if (JOJO.Os.debug || JOJO.Os.jojoup) {
      // 谷歌地图安全密钥
      window._AMapSecurityConfig = {
        securityJsCode: GAODE_MAP.securityJsCode
      };
    }

    // setLoadOptions(LoadHandle({ resultCode: 200 }));
    // 加载地图
    AMapLoader.load({
      key: GAODE_MAP.key, // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ['AMap.Driving', 'AMap.Geocoder']
    })
      .then((AMap: any) => {
        mapRef.current = new AMap.Map('amap', {
          // 设置地图容器id
          viewMode: '2D', // 是否为3D地图模式
          zoom: 6, // 初始化地图级别
          center: [104.065735, 30.659462], // 初始化地图中心点位置
          features: ['bg', 'point'],
          animateEnable: false,
          zooms: [5, 11]
        });
        // 绘制路线
        drawLines();
      })
      .catch(() => {
        Toast.show({
          icon: 'fail',
          content: '地图加载出错了'
        });
      });
  };

  useEffect(() => {
    // sensPageView({
    //   $title: '物流详情'
    // });
    // const a = document.querySelectorAll('meta');
    // console.log(1111, a);
    // a[1].parentNode?.removeChild(a[1]);

    return () => {
      mapRef.current?.destroy();
      //   setIsLoading(false);
      clearTimeout(timer);
    };
  }, []);

  const drawLines = () => {
    // 逆地理编码
    const geocoder = new window.AMap.Geocoder({
      city: '全国'
    });
    const address: string = `${locationRef.current?.city}${locationRef.current?.area}`;
    const addresses = ['成都市龙泉驿区', address];
    geocoder.getLocation(addresses, function (status: any, result: any) {
      if (status === 'complete' && result.info === 'OK') {
        const startLngLat = [
          result?.geocodes[0]?.location?.lng,
          result?.geocodes[0]?.location?.lat
        ];
        const endLngLat = [result?.geocodes[1]?.location?.lng, result?.geocodes[1]?.location?.lat];

        // 路径规划
        const driving = new window.AMap.Driving({
          map: mapRef.current,
          panel: 'panel',
          ferry: 1,
          showTraffic: false
        });

        driving.search(startLngLat, endLngLat, function (innerStatus: any, innerResult: any) {
          if (innerStatus === 'complete') {
            console.log('绘制路线完成');
            timer = setTimeout(() => {
              mapRef.current?.setFitView();
            }, 300);
            try {
              // 找到起始图标并添加样式
              const startIcon: any = document.querySelector('.amap-lib-marker-from');
              const endIcon: any = document.querySelector('.amap-lib-marker-to');

              if (startIcon) {
                startIcon.style.pointerEvents = 'none'; // 禁止点击事件
              }
              if (endIcon) {
                endIcon.style.pointerEvents = 'none'; // 禁止点击事件
              }
            } catch (error: any) {
              console.log('取消marker事件失败', error);
            }
          } else {
            console.log(`获取路线数据失败：`, innerResult);
          }
        });
      }
    });
  };

  /**
   * 跳转客服
   */
  const handleService = () => {
    setIsLoading(true);
    // sensClickInitiative({
    //   $title: '物流详情',
    //   $element_name: '联系客服'
    // });
    getOrderDetail({
      orderId: query?.orderId,
      skuId: query?.skuId || '',
      expressNumber: detail?.expressNo
    })
      .then((res: any) => {
        if (res?.resultCode === 200) {
          if (Object.keys(res?.data || {})?.length) {
            // goService(res?.data);
          } else {
            Toast.show({
              icon: 'fail',
              content: '未查询到该订单的相关信息'
            });
          }
        } else {
          Toast.show({
            icon: 'fail',
            content: res?.errorMsg
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (searchParams.get('gpoNo')) {
    if (!gpoNo || !expressNo) {
      return (
        <PageLoading
          options={{
            status: LoadStatus.Error,
            errorMsg: '参数错误！'
          }}
        />
      );
    }
  } else {
    if (!deliveryRecordId || !expressNumber) {
      return (
        <PageLoading
          options={{
            status: LoadStatus.Error,
            errorMsg: '参数错误！'
          }}
        />
      );
    }
  }

  return (
    <PageLoading loading={isLoading} res={pageDataRes} retry={refetch}>
      <div>
        <div className={S.delivery_detail_wrap}>
          <div className={S.mapWrap}>
            <div id='amap' className={S.maps} />
          </div>
          <div id='panel' style={{ display: 'none' }} />

          <div className={S.tracesWrapper}>
            <div className={S.tracesContentWrapper}>
              <div className={S.tracesTop}>
                <div className={S.tracesTopItem}>
                  <div className={S.tracesTopItemLeft}>{detail?.expressOrgName}</div>
                  <div className={S.tracesTopItemInfo}>{detail?.expressNo}</div>
                  <CopyToClipboard
                    onCopy={() => {
                      Toast.show({
                        icon: 'success',
                        content: '复制成功'
                      });
                    }}
                    text={detail?.expressNo}>
                    <img className={S.copy} src={icon_copy} alt='copy' />
                  </CopyToClipboard>
                </div>
                <div className={S.tracesTopItem}>
                  <div className={S.tracesTopItemLeft}>发货时间</div>
                  <div className={S.tracesTopItemInfo}>
                    {dayjs(detail?.deliveredTime).format('YYYY-MM-DD')}
                  </div>
                </div>
                <div className={S.tracesTopItem}>
                  <div className={S.tracesTopItemLeft}>包裹内容</div>
                  <div className={S.tracesTopItemInfo}>{detail?.deliveredDetail}</div>
                </div>
              </div>
              <div className={S.container}>
                {detail.traceDetailList?.length ? (
                  <DeliveryTimeLine traces={detail.traceDetailList} />
                ) : (
                  <div className={S.noContent}>暂无物流信息</div>
                )}
              </div>
            </div>
          </div>
          <FixBottom className={S.bottom_style}>
            <div className={S.service}>
              咨询物流问题，请
              <span className={S.call} onClick={handleService}>
                联系客服
              </span>
              <LeftOutline className={S.icon} color='#ACB2BB' />
              {/* <LeftBoldOutline className={S.icon} color='#ACB2BB' /> */}
            </div>
          </FixBottom>
        </div>
        {/* <Loading visible={isLoading} maskStyle={{ background: 'rgba(0, 0, 0, 0.01)' }} /> */}
      </div>
    </PageLoading>
  );
}
