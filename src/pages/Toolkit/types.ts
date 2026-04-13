/** 工具分类 */
export type ToolkitCategory = {
  id: string;
  label: string;
};

/** 工具条目 */
export type ToolkitTool = {
  id: string;
  name: string;
  description: string;
  /** 分类 id */
  categoryId: string;
  href: string;
  /** 用于搜索与展示 */
  tags: string[];
};
