import { Button } from 'antd-mobile';

import FailSrcJo from '@/assets/image/jojo/error-net.png';
import ErrorSrcJo from '@/assets/image/jojo/error-others.png';
import LoadingSrcJo from '@/assets/image/jojo/loading.gif';
import ErrorSrcUp from '@/assets/image/jojoup/error-others.png';
import LoadingSrcUp from '@/assets/image/jojoup/loading.gif';
import { Os } from '@/lib';

import S from './index.module.less';

export enum LoadStatus {
  Loading = 'loading',
  Error = 'error',
  Failed = 'failed'
}

interface PageLoadingProps {
  loading?: boolean;
  res?: any;
  options?: {
    status?: LoadStatus;
    errorMsg?: string;
  };
  retry?: () => void;
  children?: React.ReactNode;
}
// 请求失败
const FailSrc = Os.jojoup ? ErrorSrcUp : FailSrcJo;
// 接口异常
const ErrorSrc = Os.jojoup ? ErrorSrcUp : ErrorSrcJo;
// 加载中
const LoadingSrc = Os.jojoup ? LoadingSrcUp : LoadingSrcJo;

/**
 * 加载中
 */
const Loading: React.FC<PageLoadingProps> = (props) => {
  const { res, options } = props;
  const { resultCode } = res || {};
  const appName = Os.jojoup ? 'JOJOUP' : '叫叫';

  let loadingText = `${appName}正在赶来...`;
  if (options?.status) {
    loadingText = options?.errorMsg || '哦哦，出错了！';
  } else {
    if ([1001, 1002, 1005].includes(resultCode)) {
      loadingText = '请求授权中...';
    }
  }
  return (
    <div className={S.pageLoading}>
      <img className={S.loadingImage} src={LoadingSrc} alt='' />
      <div className={S.loadingText}>{loadingText}</div>
    </div>
  );
};

/**
 * 异常
 */
const Abnormal: React.FC<PageLoadingProps> = (props) => {
  const { res, retry, options } = props;
  const { resultCode, errorMsg } = res || {};
  let imageSrc = ErrorSrcJo;
  let errText = errorMsg;

  if (options?.status) {
    imageSrc = FailSrc;
    errText = options?.errorMsg || '哦哦，出错了！';
  } else {
    if (resultCode) {
      imageSrc = ErrorSrc;
    } else {
      errText = '哦哦，出错了！';
      imageSrc = FailSrc;
    }
  }

  return (
    <div className={S.pageError}>
      <img className={S.errorImage} src={imageSrc} alt='' />
      <p className={S.errorText}>{errText}</p>
      {retry && (
        <Button className={S.retryBtn} onClick={retry}>
          重试
        </Button>
      )}
    </div>
  );
};

/**
 * 页面loading
 * @param props PageLoadingProps
 * @returns
 */
export function PageLoading(props: PageLoadingProps) {
  const { loading, res, children, options } = props;
  const { resultCode } = res || {};

  // 加载中 || 未授权
  if (
    loading ||
    options?.status === LoadStatus.Loading ||
    [1001, 1002, 1005].includes(resultCode)
  ) {
    return <Loading {...props} />;
  }

  // 其他异常
  if (
    resultCode !== 200 ||
    options?.status === LoadStatus.Error ||
    options?.status === LoadStatus.Failed
  ) {
    return <Abnormal {...props} />;
  }

  return children;
}
export default PageLoading;
