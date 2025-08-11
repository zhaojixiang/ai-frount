import cx from 'classnames';

import S from './index.module.less';

export default function FixBottom(props: any) {
  const { children, className } = props;
  return <div className={cx(S.fixBottom, className)}>{children}</div>;
}
