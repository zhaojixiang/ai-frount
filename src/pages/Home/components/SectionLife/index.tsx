import { Link } from 'react-router-dom';

import type { LifeMoment } from '../../types';
import { formatDisplayDate } from '../../utils/formatDisplayDate';
import styles from './index.module.less';

type Props = {
  moments: LifeMoment[];
};

export function SectionLife({ moments }: Props) {
  return (
    <section id='life' className={styles.section} aria-labelledby='life-title'>
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id='life-title' className={styles.title}>
            最近生活
          </h2>
          <div className={styles.headAside}>
            <span className={styles.meta}>Notes from life</span>
            <Link className={styles.more} to='/life'>
              查看全部
            </Link>
          </div>
        </div>
        <div className={styles.list}>
          {moments.map((m) => (
            <article key={m.id} className={styles.item}>
              {m.imageUrl ? (
                <img className={styles.thumb} src={m.imageUrl} alt='' />
              ) : (
                <div className={`${styles.thumb} ${styles.thumbPlaceholder}`}>Photo</div>
              )}
              <div className={styles.body}>
                <div className={styles.date}>{formatDisplayDate(m.date)}</div>
                <p className={styles.text}>{m.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
