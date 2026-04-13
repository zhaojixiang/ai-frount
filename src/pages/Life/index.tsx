import { HomeFooter } from '../Home/components/HomeFooter';
import { HomeHeader } from '../Home/components/HomeHeader';
import { LifeArchive, LifeTimeline } from './components';
import styles from './index.module.less';
import { getLifeRecordsMock } from './mockData';
import { buildYearArchives, groupRecordsByMonth } from './utils/groupRecords';

export default function Life() {
  /**
   * 将来可在 useEffect 中请求接口并 setState，例如：
   * const [records, setRecords] = useState<LifeRecord[]>([]);
   * useEffect(() => {
   *   let cancelled = false;
   *   (async () => {
   *     const data = await fetchLifeRecords();
   *     if (!cancelled) setRecords(data);
   *   })();
   *   return () => { cancelled = true; };
   * }, []);
   */
  const records = getLifeRecordsMock();
  const groups = groupRecordsByMonth(records);
  const archives = buildYearArchives(groups);
  const year = new Date().getFullYear();

  return (
    <div className={styles.page}>
      <HomeHeader />
      <header className={styles.hero}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>Life</p>
          <h1 className={styles.title}>生活记录</h1>
          <p className={styles.lead}>图文与时间轴：按年月归档，随手记下值得留住的时刻。</p>
        </div>
      </header>

      <div className={styles.layout}>
        <LifeArchive archives={archives} />
        <LifeTimeline groups={groups} />
      </div>

      <HomeFooter year={year} />
    </div>
  );
}
