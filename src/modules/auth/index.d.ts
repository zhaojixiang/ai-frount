export interface AuthorizeType {
  appId?: string; //
  mode?: number; // 1 登录， 2 访客  3.不登录
  wechatAuthType?: number; // 1 用户授权 2 静默授权
  authBizType?: 1 | 2 | 3 | 4; // 1，绑定关系 2 尝试静默登录 3 双账号处理场景 4 双账号弹窗V2
  linkCode?: string; // 用于查询班期id
  requestUrl?: string; // 用于查询班期id
}

export interface WxAuthOptions {
  needPopLogin?: boolean; // 是否需要弹出登录，该参数仅用于给链接上添加needPopLogin参数，后续弹窗登录逻辑需单独处理
}
