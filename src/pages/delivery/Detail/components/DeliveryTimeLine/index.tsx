import cx from 'classnames';
import dayjs from 'dayjs';
import React from 'react';

import css from './index.module.less';

const Index: React.FC<any> = ({ traces }) => {
  return (
    <section className={css.timeLine}>
      {traces &&
        traces.map((t: any, i: number) => {
          const activeCss = i === 0 ? [css.contentRight, css.active] : [css.contentRight];

          return (
            <div
              className={cx(css.container, { [css.last]: i === traces.length - 1 })}
              key={t?.time}>
              <div className={css.contentLeft} />
              <div className={cx(...activeCss)}>
                <div className={css.title}>
                  {t.state !== '配送中' ? <span className={css.state}>{t.state}</span> : null}
                  <span className={css.time}>
                    {t.time ? dayjs(t.time).format('YYYY-MM-DD HH:mm:ss') : null}
                  </span>
                </div>
                <div className={css.desc}>{t.context}</div>
              </div>
            </div>
          );
        })}
    </section>
  );
};

export default Index;
