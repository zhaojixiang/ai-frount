import { Link, useSearchParams } from 'react-router-dom';

import { HomeFooter } from '@/pages/Home/components/HomeFooter';
import { HomeHeader } from '@/pages/Home/components/HomeHeader';
import { formatDisplayDate } from '@/pages/Home/utils/formatDisplayDate';

import { getBlogListPageMock } from '../mockData';
import styles from './index.module.less';

const PAGE_SIZE = 4;

export default function BlogList() {
  /**
   * 将来可改为：
   * const [data, setData] = useState<BlogListResult | null>(null);
   * useEffect(() => { request.get('/api/blog/articles', { params: { page, pageSize } }).then(setData); }, [page]);
   */
  const [searchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const { items, page: currentPage, total, totalPages } = getBlogListPageMock(page, PAGE_SIZE);
  const year = new Date().getFullYear();

  return (
    <div className={styles.page}>
      <HomeHeader />
      <header className={styles.hero}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>Blog</p>
          <h1 className={styles.title}>文章</h1>
          <p className={styles.lead}>共 {total} 篇，按发布时间倒序排列。</p>
        </div>
      </header>

      <div className={styles.main}>
        <div className={styles.grid}>
          {items.map((post) => (
            <Link key={post.id} className={styles.card} to={`/blog/${post.id}`}>
              <div className={styles.cover}>
                <img src={post.coverImage} alt='' loading='lazy' />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.metaTop}>
                  <span className={styles.category}>{post.category}</span>
                  <span className={styles.dot}>·</span>
                  <time dateTime={post.publishedAt}>{formatDisplayDate(post.publishedAt)}</time>
                  <span className={styles.dot}>·</span>
                  <span>{post.author}</span>
                </div>
                <h2 className={styles.cardTitle}>{post.title}</h2>
                <p className={styles.excerpt}>{post.excerpt}</p>
                <div className={styles.tags}>
                  {post.tags.map((t) => (
                    <span key={t} className={styles.tag}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className={styles.stats}>
                  <span className={styles.stat}>阅读 {post.views}</span>
                  <span className={styles.stat}>点赞 {post.likes}</span>
                  <span className={styles.stat}>评论 {post.comments}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <nav className={styles.pagination} aria-label='分页'>
          {currentPage <= 1 ? (
            <span className={`${styles.pageBtn} ${styles.disabled}`}>上一页</span>
          ) : (
            <Link
              className={styles.pageBtn}
              to={currentPage === 2 ? '/blog' : `/blog?page=${currentPage - 1}`}>
              上一页
            </Link>
          )}
          <span className={styles.pageInfo}>
            {currentPage} / {totalPages}
          </span>
          {currentPage >= totalPages ? (
            <span className={`${styles.pageBtn} ${styles.disabled}`}>下一页</span>
          ) : (
            <Link className={styles.pageBtn} to={`/blog?page=${currentPage + 1}`}>
              下一页
            </Link>
          )}
        </nav>
      </div>

      <HomeFooter year={year} />
    </div>
  );
}
