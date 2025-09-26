import { Button } from 'antd-mobile';
import { isEmpty } from 'lodash-es';

import ErrorSrcJo from '@/assets/images/jojo/error-others.png';
import ErrorSrcUp from '@/assets/images/jojoup/error-others.png';
import { Os } from '@/lib';

import S from './index.module.less';

export enum LoadStatus {
  Loading = 'loading',
  Error = 'error',
  Success = 'success'
}

interface StateHandlerProps {
  // option 优先级高于 res
  options?: {
    status?: LoadStatus;
    errorMsg?: string;
    loadingElement?: React.ReactNode;
    // 优先获取 options 设置的状态
    res?: {
      resultCode?: number;
      errorMsg?: string;
      data?: any;
    };
  };
  retry?: () => void;
  children?: React.ReactNode;
}
// 请求失败
// const FailSrc = Os.jojoup ? ErrorSrcUp : ErrorSrcJo;
// 接口异常
const ErrorSrc = Os.jojoup ? ErrorSrcUp : ErrorSrcJo;
// 加载中

/**
 * 异常
 */
const Abnormal: React.FC<StateHandlerProps> = (props) => {
  const { retry, options } = props;
  let imageSrc = ErrorSrcJo;
  let errText: string = '哦哦，出错了！';

  if (options?.status) {
    // 优先处理options中的状态
    imageSrc = ErrorSrc;
    errText = options?.errorMsg || '哦哦，出错了！';
  } else {
    // 处理 res 返回异常
    const { res } = options || {};
    const { resultCode, errorMsg } = res || {};
    if (resultCode) {
      imageSrc = ErrorSrc;
      errText = errorMsg as string;
    } else {
      errText = '哦哦，出错了！';
      imageSrc = ErrorSrc;
    }
  }

  return (
    <div className={S.pageError}>
      <img className={S.errorImage} src={imageSrc} alt='' />
      <div className={S.errorText}>{errText}</div>
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
 * @param props StateHandlerProps
 * @returns
 */
export function StateHandler(props: StateHandlerProps) {
  const { options, children } = props;
  const { res } = options || {};
  const { resultCode } = res || {};

  // loading
  if (options?.status === LoadStatus.Loading) {
    return options?.loadingElement;
  }
  // options直接设置的异常
  if (options?.status === LoadStatus.Error) {
    return <Abnormal {...props} />;
  }
  // res异常处理
  if (!isEmpty(res)) {
    if (resultCode !== 200) {
      return <Abnormal {...props} />;
    }
  }
  // 成功直接渲染
  return children;
}
export default StateHandler;
