import type { LifeMonthGroup, LifeRecord, LifeYearArchive } from '../types';

const monthLabel = (y: number, m: number) => `${y}年${m}月`;

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/** 将记录按月份分组，时间新的在前 */
export function groupRecordsByMonth(records: LifeRecord[]): LifeMonthGroup[] {
  const map = new Map<string, LifeRecord[]>();
  for (const r of records) {
    const d = new Date(r.date);
    if (Number.isNaN(d.getTime())) continue;
    const key = monthKey(d);
    const list = map.get(key);
    if (list) list.push(r);
    else map.set(key, [r]);
  }

  const keys = [...map.keys()].sort((a, b) => b.localeCompare(a));
  return keys.map((key) => {
    const [ys, ms] = key.split('-');
    const year = Number(ys);
    const month = Number(ms);
    const items = map.get(key)!;
    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return {
      key,
      year,
      month,
      label: monthLabel(year, month),
      items
    };
  });
}

/** 由分组生成侧边栏「按年 / 月」归档树 */
export function buildYearArchives(groups: LifeMonthGroup[]): LifeYearArchive[] {
  const byYear = new Map<number, LifeYearArchive['months']>();
  for (const g of groups) {
    const months = byYear.get(g.year) ?? [];
    months.push({
      key: g.key,
      month: g.month,
      label: `${g.month}月`,
      count: g.items.length
    });
    byYear.set(g.year, months);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);
  return years.map((year) => ({
    year,
    label: `${year}年`,
    months: byYear.get(year)!
  }));
}
