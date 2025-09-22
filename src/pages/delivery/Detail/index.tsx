import AMapLoader from '@amap/amap-jsapi-loader';
import { useRequest } from 'ahooks';
import { LeftOutline } from 'antd-mobile-icons';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSearchParams } from 'react-router-dom';

import icon_copy from '@/assets/images/copy.png';
import FixBottom from '@/components/FixBottom';
import StateHandler, { LoadStatus } from '@/components/StateHandler';
import type { IJingTanParams } from '@/modules/customerService';
import { getJingTanPath, getOriginParams } from '@/modules/customerService';
import { getDeliveryTrace, getOrderDetail } from '@/services/api/order';
import { FROUNT_URL_OLD, GAODE_MAP, MARKETING_BASE_URL } from '@/services/config';

import DeliveryTimeLine from './components/DeliveryTimeLine';
import Skeleton from './components/Skeleton';
import S from './index.module.less';

let timer: any = null;

export default function Detail() {
  const [searchParams] = useSearchParams();
  const deliveryRecordId = searchParams.get('deliveryRecordId');
  const expressNumber = searchParams.get('expressNumber') || '';
  const gpoNo = searchParams.get('gpoNo') || '';
  const expressNo = searchParams.get('expressNo') || '';
  const orderId = searchParams.get('orderId') || '';
  const skuId = searchParams.get('skuId') || '';

  const [detail, setDetail] = useState<any>({});
  const [pageStatus, setPageStatus] = useState<any>({});
  const mapRef = useRef<any>(null);

  const locationRef = useRef<any>(null);

  const { loading, runAsync: _getDeliveryTrace } = useRequest(getDeliveryTrace, {
    manual: true
  });

  useEffect(() => {
    if (loading) {
      setPageStatus({
        status: LoadStatus.Loading,
        loadingElement: <Skeleton />
      });
    }
  }, [loading]);

  useEffect(() => {
    initPage();
    return () => {
      mapRef.current?.destroy();
      clearTimeout(timer);
    };
  }, []);

  const initPage = async () => {
    if (searchParams.get('gpoNo')) {
      if (!gpoNo || !expressNo) {
        setPageStatus({
          status: LoadStatus.Error,
          errorMsg: '参数错误！'
        });
        return;
      }
    } else {
      if (!deliveryRecordId || !expressNumber) {
        setPageStatus({
          status: LoadStatus.Error,
          errorMsg: '参数错误！'
        });
        return;
      }
    }
    try {
      const res = await _getDeliveryTrace({ gpoNo, expressNo });

      const { resultCode, data } = res || {};
      setPageStatus({ res });
      if (resultCode === 200) {
        setDetail(data);
        locationRef.current = {
          city: data?.city,
          area: data?.area
        };
        initMap();
      }
    } catch (error) {
      console.error('获取物流轨迹失败', error);
      setPageStatus({
        status: LoadStatus.Error,
        errorMsg: '获取物流轨迹失败！'
      });
    }
  };

  /**
   * 初始化地图
   */
  const initMap = () => {
    // 本地调试设置密钥
    if (JOJO.Os.debug || JOJO.Os.jojoup) {
      // 谷歌地图安全密钥
      window._AMapSecurityConfig = {
        securityJsCode: GAODE_MAP.securityJsCode
      };
    }

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
        JOJO.toast.show({
          icon: 'fail',
          content: '地图加载出错了'
        });
      });
  };

  /**
   * 绘制路线
   */
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
  const goService = async (record: any) => {
    const originParams = await getOriginParams();
    const params: IJingTanParams = {
      orderCard: {
        orderStatus: 0,
        statusCustom: record?.statusDesc || '',
        createTime: record.createTime,
        orderCode: record.orderId,
        orderUrl: `${FROUNT_URL_OLD}/order/detail?orderId=${record.orderId}`,
        goodsCount: record?.itemQt || 1,
        totalFee: (record?.money ?? 0) * 100,
        goods: [
          {
            pictureUrl: record?.imageUrl ?? '',
            name: record?.title ?? ''
          }
        ]
      },
      ...originParams
    };
    let url = getJingTanPath(params);
    url = `${MARKETING_BASE_URL}/transform/customerCenter?serviceUrl=${encodeURIComponent(
      url
    )}&fromType=mall`;
    if (JOJO.Os.jojoReadApp) {
      JOJO.showPage(url, {
        mode: 'replace',
        to: 'flutter'
      });
    } else {
      JOJO.showPage(url, {
        mode: 'replace',
        to: 'externalWeb'
      });
    }

    setTimeout(() => {
      window.location.href = url;
    }, 300);
  };

  /**
   * 跳转客服
   */
  const handleService = () => {
    JOJO.loading.show({ content: '加载中...' });
    getOrderDetail({
      orderId,
      skuId: skuId || '',
      expressNumber: detail?.expressNo
    })
      .then((res: any) => {
        if (res?.resultCode === 200) {
          if (Object.keys(res?.data || {})?.length) {
            goService(res?.data);
          } else {
            JOJO.toast.show({
              icon: 'fail',
              content: '未查询到该订单的相关信息'
            });
          }
        } else {
          JOJO.toast.show({
            icon: 'fail',
            content: res?.errorMsg
          });
        }
      })
      .finally(() => {
        JOJO.loading.close();
      });
  };

  return (
    <StateHandler options={pageStatus}>
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
                    JOJO.toast.show({
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
          </div>
        </FixBottom>
      </div>
    </StateHandler>
  );
}
