import { formatDisplayDate } from '@/pages/Home/utils/formatDisplayDate';

import type { LifeRecord } from '../../types';
import styles from './index.module.less';

type Props = {
  record: LifeRecord;
};

export function LifeCard({ record }: Props) {
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {record.imageUrl ? (
          <img src={record.imageUrl} alt='' loading='lazy' />
        ) : (
          <div className={styles.placeholder}>No photo</div>
        )}
      </div>
      <div className={styles.body}>
        <time className={styles.meta} dateTime={record.date}>
          {formatDisplayDate(record.date)}
        </time>
        <h3 className={styles.title}>{record.title}</h3>
        <p className={styles.excerpt}>{record.excerpt}</p>
      </div>
    </article>
  );
}
