/** 单条生活记录（与后端对齐时可抽到 src/types） */
export type LifeRecord = {
  id: string;
  /** ISO 日期 YYYY-MM-DD */
  date: string;
  title: string;
  excerpt: string;
  /** 无图时卡片展示占位 */
  imageUrl?: string;
};

/** 按月份聚合后的分组 */
export type LifeMonthGroup = {
  /** 用于锚点 id，如 2026-04 */
  key: string;
  year: number;
  month: number;
  /** 展示用，如「2026年4月」 */
  label: string;
  items: LifeRecord[];
};

/** 归档：年 → 月 */
export type LifeYearArchive = {
  year: number;
  label: string;
  months: { key: string; month: number; label: string; count: number }[];
};
