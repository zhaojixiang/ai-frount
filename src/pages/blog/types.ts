/** 列表项字段（与后端对齐时可抽到 src/types） */
export type BlogArticleSummary = {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  author: string;
  coverImage: string;
};

export type BlogArticleDetail = BlogArticleSummary & {
  contentMarkdown: string;
};

export type BlogListResult = {
  items: BlogArticleSummary[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type BlogDetailResult = {
  article: BlogArticleDetail;
  /** 较旧的一篇（发布时间更早） */
  prevId: string | null;
  /** 较新的一篇（发布时间更晚） */
  nextId: string | null;
};
