export interface SkuSaleResp {
  id: string;
  stock: number;
  skuName: string;
  subscriptionList: any[];
  preSubscriptionType: number;
  existActivated: boolean;
  isOnArgument: boolean;
  onlyRenewPay: boolean;
}

/**
 * sku选择弹窗参数
 */
export type SkuSelectParams = {
  curPrice: number;
  curSubscribeType: number | string;
  giftPools: string; // 赠品sku encode 字符串
};
