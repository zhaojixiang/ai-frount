import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { HomeFooter } from '@/pages/Home/components/HomeFooter';
import { HomeHeader } from '@/pages/Home/components/HomeHeader';

import styles from './index.module.less';
import { getToolkitCategoriesMock, getToolkitToolsMock } from './mockData';
import { gradientIndexForId } from './utils/gradientClassForId';

const GRADIENT_KEYS = [
  styles.g0,
  styles.g1,
  styles.g2,
  styles.g3,
  styles.g4,
  styles.g5,
  styles.g6,
  styles.g7,
  styles.g8,
  styles.g9,
  styles.g10,
  styles.g11
] as const;

function matchesQuery(tool: ReturnType<typeof getToolkitToolsMock>[number], q: string): boolean {
  if (!q.trim()) return true;
  const s = q.trim().toLowerCase();
  const blob = [tool.name, tool.description, ...tool.tags].join(' ').toLowerCase();
  return blob.includes(s);
}

export default function Toolkit() {
  /**
   * 将来可改为接口拉取：
   * const [tools, setTools] = useState<ToolkitTool[]>([]);
   * useEffect(() => { request.get('/api/toolkit/tools').then(...); }, []);
   */
  const categories = useMemo(() => getToolkitCategoriesMock(), []);
  const allTools = useMemo(() => getToolkitToolsMock(), []);

  const [categoryId, setCategoryId] = useState<string>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return allTools.filter((t) => {
      const catOk = categoryId === 'all' || t.categoryId === categoryId;
      return catOk && matchesQuery(t, query);
    });
  }, [allTools, categoryId, query]);

  const categoryLabel = useMemo(() => {
    const m = new Map(categories.map((c) => [c.id, c.label]));
    return (id: string) => m.get(id) ?? id;
  }, [categories]);

  const year = new Date().getFullYear();

  return (
    <div className={styles.page}>
      <HomeHeader />
      <header className={styles.hero}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>Toolkit</p>
          <h1 className={styles.title}>工具</h1>
          <div className={styles.searchRow}>
            <input
              className={styles.search}
              type='search'
              placeholder='搜索工具名称、描述或标签…'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label='搜索工具'
            />
          </div>
        </div>
      </header>

      <div className={styles.toolbar} role='tablist' aria-label='工具分类'>
        {categories.map((c) => (
          <button
            key={c.id}
            type='button'
            role='tab'
            aria-selected={categoryId === c.id}
            className={`${styles.catBtn} ${categoryId === c.id ? styles.catBtnActive : ''}`}
            onClick={() => setCategoryId(c.id)}>
            {c.label}
          </button>
        ))}
        <span className={styles.hint}>
          {filtered.length} / {allTools.length}
        </span>
      </div>

      <main className={styles.main}>
        {filtered.length === 0 ? (
          <p className={styles.empty}>没有匹配的工具，试试其它关键词或分类。</p>
        ) : (
          <div className={styles.grid}>
            {filtered.map((tool) => {
              const gi = gradientIndexForId(tool.id, GRADIENT_KEYS.length);
              const gradClass = GRADIENT_KEYS[gi];
              const inner = (
                <>
                  <span className={styles.catPill}>{categoryLabel(tool.categoryId)}</span>
                  <h2 className={styles.name}>{tool.name}</h2>
                  <p className={styles.desc}>{tool.description}</p>
                  <div className={styles.tags}>
                    {tool.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              );
              const cardClass = `${styles.card} ${gradClass}`;
              if (tool.href.startsWith('http') || tool.href.startsWith('//')) {
                return (
                  <a
                    key={tool.id}
                    className={cardClass}
                    href={tool.href}
                    target='_blank'
                    rel='noreferrer'>
                    <div className={styles.cardInner}>{inner}</div>
                  </a>
                );
              }
              if (tool.href.startsWith('#')) {
                return (
                  <a key={tool.id} className={cardClass} href={tool.href}>
                    <div className={styles.cardInner}>{inner}</div>
                  </a>
                );
              }
              return (
                <Link key={tool.id} className={cardClass} to={tool.href}>
                  <div className={styles.cardInner}>{inner}</div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <HomeFooter year={year} />
    </div>
  );
}
