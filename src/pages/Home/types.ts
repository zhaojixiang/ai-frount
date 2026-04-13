/** 文章条目（与后端对齐时可抽到 src/types） */
export type BlogPost = {
  id: string;
  title: string;
  publishedAt: string;
};

/** 推荐工具 */
export type ToolEntry = {
  id: string;
  name: string;
  description: string;
  href: string;
  tag: string;
};

/** 生活记录 */
export type LifeMoment = {
  id: string;
  date: string;
  excerpt: string;
  imageUrl?: string;
};
