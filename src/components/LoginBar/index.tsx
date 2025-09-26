import jojoAccount from '@jojo/account-sdk';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

import { isLogin, popLogin, toAuthrize } from '@/modules/auth';

import S from './index.module.less';

export default function LoginBar(props: { onLoginSuccess?: () => void; isPopLogin?: boolean }) {
  const { onLoginSuccess, isPopLogin } = props;
  const [userInfo, setUserInfo] = useState<any>({});
  const [uid, setUid] = useState('');
  useEffect(() => {
    getUserInfo();
    setUid(Cookies.get('uid') || '');
  }, []);

  /**
   * 获取用户信息
   */
  const getUserInfo = async () => {
    const data = await jojoAccount.getLoginUserInfo();
    if (data.status === 0) {
      setUserInfo(data?.data);
    } else {
      setUserInfo({});
    }
  };

  /**
   * 点击登录
   */
  const handleLogin = async () => {
    if (window.location.href.includes('/item/detail') && isPopLogin) {
      popLogin({
        callback: () => {
          getUserInfo();
          onLoginSuccess?.();
        }
      });
    } else {
      const redirectUrl = await toAuthrize({
        mode: 1,
        authBizType: 3
      });
      window.location.replace(redirectUrl);
    }
  };
  /**
   * 切换账号
   */
  const handleChangeLogin = async () => {
    if (window.location.href.includes('/item/detail') && isPopLogin) {
      popLogin({
        callback: () => {
          getUserInfo();
          onLoginSuccess?.();
        }
      });
    } else {
      await jojoAccount.logout();
      let domain = '';
      if (JOJO.Os.jojoup) {
        domain = '.mohezi.cn';
      } else if (JOJO.Os.jojo) {
        domain = '.tinman.cn';
      } else {
        domain = '.cdssylkj.com';
      }
      Cookies.remove('authToken', {
        domain,
        path: '/'
      });
      const redirectUrl = await toAuthrize({
        mode: 1,
        authBizType: 3
      });
      window.location.replace(redirectUrl);
    }
  };

  return (
    <div className={S.loginBar}>
      {!isLogin() ? (
        <div className={S.noLogin}>
          <div className={S.logo}>
            {JOJO.Os.jojoup ? <div className={S.jojoupLogo} /> : <div className={S.jojoLogo} />}
            <div className={S.unLoginText}>未登录</div>
          </div>
          <div className={S.login_btn} onClick={handleLogin}>
            登录
          </div>
        </div>
      ) : (
        <div className={S.hasLogin}>
          <div className={S.user_info}>
            <div
              className={S.head_img}
              style={{ backgroundImage: `url(${userInfo?.babyAvatarUrl || ''})` }}
            />
            <div className={S.user_name}>
              <div className={S.user_name_text}>
                {userInfo?.babyNickname}（{uid}）
              </div>
              <div className={S.user_phone}>{userInfo?.credentialDesc}</div>
            </div>
          </div>
          <div className={S.login_btn} onClick={handleChangeLogin}>
            切换账号
          </div>
        </div>
      )}
    </div>
  );
}
