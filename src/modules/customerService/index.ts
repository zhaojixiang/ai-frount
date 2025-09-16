import { JING_TAN_NO_AUTH_URL, MARKETING_BASE_URL } from '@/services/config';

const PATH_MAP = {
  noAuth: JING_TAN_NO_AUTH_URL
};

export interface IJingTanGoodsItem {
  name: string; // 商品名称
  pictureUrl: string; // 商品图片链接（建议使用encodeURIComponent转义一下，防止链接中带有特殊符号导致参数获取失败）
}

export interface IJingTanParams {
  orderCard?: OrderCardParams; // 订单卡片
  origin: string | undefined; // 来源
  userId?: number; // 用户id，免鉴权接口必传
  channel: string; // 渠道
  channelId: number; // 渠道id
}

export interface OrderCardParams {
  orderStatus: number; // 订单状态 0: '自定义状态字段',1: '待付款',2: '待发货',3: '运输中', 4: '派送中',5: '已完成', 6: '待评价',7: '已取消'
  statusCustom: string; // 当orderStatus=0的时候，取该字段作为订单卡片的状态
  createTime: number; // 创建时间（毫秒）
  orderCode: number | string; // 订单编号 要求是 number
  orderUrl: string; // 订单链接支持跳转链接、小程序页面两种类型：跳转链接：必须使用http或https开头，才能在工作台打开。建议使用encodeURIComponent对链接进行转义）小程序页面链接：仅支持在微信内打开
  goodsCount: number; // 商品数量
  totalFee: number; // 订单金额（以分为单位，totalFee=1000相当与totalFee=10.00元，不支持小数）
  goods: IJingTanGoodsItem[]; // 商品详情数组
}

export interface IRedirectParams {
  redirect?: boolean; // 是否通过中转页处理客服，默认false
  fromType?: string; // 页面场景
}

/**
 * 处理参数（生成base64）
 * @param params
 */
export const generatorParams = (params: IJingTanParams) => {
  // if (type === 'noAuth' && !params?.userId) throw new Error('用户id必传！');
  const innerParams: any = { ...(params || {}) };

  // 删除值为undefined的字段
  Object.keys(innerParams).forEach((key: any) => {
    if (innerParams[key] === undefined) {
      delete innerParams[key];
    }
  });
  const { orderCard, ...rest } = innerParams;

  const innerOrderCard = btoa(
    encodeURIComponent(
      JSON.stringify({
        ...(orderCard || {}),
        statusCustom: encodeURIComponent(orderCard?.statusCustom || ''),
        orderUrl: encodeURIComponent(orderCard?.orderUrl || ''),
        goods: orderCard?.goods?.map((item: any) => ({
          ...item,
          name: encodeURIComponent(item.name),
          pictureUrl: encodeURIComponent(item.pictureUrl)
        }))
      })
    )
  );

  return { orderCard: innerOrderCard, ...rest };
};

/**
 * 获取来源参数
 * @returns
 */
export const getOriginParams = async () => {
  if (JOJO.Os.jojoup) {
    return {
      origin: 'jojoup_app',
      channel: 'jojoup',
      channelId: 17
    };
  } else if (JOJO.Os.jojo) {
    return {
      origin: 'jojo_app',
      channel: 'c8eee0ad911542d49133e1b05a4e5a01',
      channelId: 17
    };
  } else if (JOJO.Os.matrix) {
    if (JOJO.Os.app) {
      if (JOJO.Os.huibenAPP) {
        return {
          origin: 'huibenSH_app',
          channel: 'c354ef1438d54e47bf2d1e78cc5a3c20',
          channelId: 11
        };
      } else if (JOJO.Os.kousuanAPP) {
        return {
          origin: 'kousuanSH_app',
          channel: 'a51a7865c65f433f8734875404d1108b',
          channelId: 12
        };
      } else {
        // 叫叫识字 & 汉字大冒险
        return {
          origin: 'shizinewSH_app',
          channel: 'c9d0de7f177c4e47b898ad38b09f363f',
          channelId: 14
        };
      }
    } else {
      return {
        origin: 'juzhenSH_app',
        channel: 'c9d0de7f177c4e47b898ad38b09f363f',
        channelId: 14
      };
    }
  } else {
    return {};
  }
};

/**
 * 获取智齿客服完整地址
 * @param type
 * @param params
 */
export const getJingTanPath = (
  params: IJingTanParams,
  redirectParams: IRedirectParams = {
    redirect: false,
    fromType: 'mallDetail'
  }
) => {
  const innerParams = generatorParams(params);
  const path = PATH_MAP.noAuth;
  let str = `${path}?origin=${innerParams?.origin}&channel=${innerParams?.channel}&channelId=${innerParams?.channelId}`;
  if (params?.orderCard) str += `&orderCard=${innerParams?.orderCard}`;
  if (params?.userId) str += `&userId=${params?.userId}`;
  if (redirectParams.redirect) {
    return `${MARKETING_BASE_URL}/transform/customerCenter?serviceUrl=${encodeURIComponent(
      str
    )}&fromType=${redirectParams.fromType}`;
  }
  return str;
};
