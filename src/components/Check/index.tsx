import cx from 'classnames';

import S from './index.module.less';

export default (props: {
  check: boolean;
  className?: string;
  checkActiveClass?: string;
  noCheckClass?: string;
  disabled?: boolean;
}) => {
  const { check = false, className, checkActiveClass, noCheckClass, disabled = false } = props;

  return (
    <div className={cx(S.check_wrap, className, disabled ? S.disabled : '')}>
      {check ? (
        <div className={cx(S.check, checkActiveClass)} />
      ) : (
        <div className={cx(S.noCheck, noCheckClass)} />
      )}
    </div>
  );
};
