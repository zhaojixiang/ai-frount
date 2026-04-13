import type { LifeMonthGroup } from '../../types';
import { LifeCard } from '../LifeCard';
import styles from './index.module.less';

type Props = {
  groups: LifeMonthGroup[];
};

export function LifeTimeline({ groups }: Props) {
  return (
    <div className={styles.timeline}>
      {groups.map((group) => (
        <section
          key={group.key}
          id={`life-${group.key}`}
          className={styles.monthSection}
          aria-labelledby={`life-h-${group.key}`}>
          <h2 id={`life-h-${group.key}`} className={styles.monthHeading}>
            {group.label}
          </h2>
          <div className={styles.track}>
            {group.items.map((record) => (
              <div key={record.id} className={styles.node}>
                <LifeCard record={record} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
