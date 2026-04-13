import type { LifeYearArchive } from '../../types';
import styles from './index.module.less';

type Props = {
  archives: LifeYearArchive[];
};

function anchorId(monthKey: string) {
  return `life-${monthKey}`;
}

function formatMonthLabel(key: string) {
  const [y, mo] = key.split('-');
  return `${y}年${Number(mo)}月`;
}

export function LifeArchive({ archives }: Props) {
  const flatMonths = archives.flatMap((y) => y.months);

  return (
    <>
      <aside className={styles.sidebar} aria-label='按年月归档'>
        <h2 className={styles.title}>归档</h2>
        {archives.map((block) => (
          <div key={block.year} className={styles.yearBlock}>
            <h3 className={styles.year}>{block.label}</h3>
            <ul className={styles.months}>
              {block.months.map((m) => (
                <li key={m.key}>
                  <a className={styles.monthLink} href={`#${anchorId(m.key)}`}>
                    <span className={styles.monthLabel}>{m.label}</span>
                    <span className={styles.count}>{m.count}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      <nav className={styles.mobileChips} aria-label='按月份跳转'>
        <h2 className={styles.title}>月份</h2>
        <div className={styles.scroll}>
          {flatMonths.map((m) => (
            <a key={m.key} className={styles.chip} href={`#${anchorId(m.key)}`}>
              {formatMonthLabel(m.key)}
              <span className={styles.count}>({m.count})</span>
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
