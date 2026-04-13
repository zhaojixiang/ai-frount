/** 根据 id 稳定映射到渐变样式下标（同 id 每次相同） */
export function gradientIndexForId(id: string, total: number): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h % total;
}
