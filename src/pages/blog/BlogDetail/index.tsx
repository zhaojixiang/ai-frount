import ReactMarkdown from 'react-markdown';
import { Link, useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';

import { HomeFooter } from '@/pages/Home/components/HomeFooter';
import { HomeHeader } from '@/pages/Home/components/HomeHeader';
import { formatDisplayDate } from '@/pages/Home/utils/formatDisplayDate';

import { getBlogDetailMock } from '../mockData';
import styles from './index.module.less';

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  /**
   * 将来可改为：
   * useEffect(() => { request.get(`/api/blog/articles/${id}`).then(setDetail); }, [id]);
   */
  const result = id ? getBlogDetailMock(id) : null;
  const year = new Date().getFullYear();

  if (!result) {
    return (
      <div className={styles.page}>
        <HomeHeader />
        <div className={styles.empty}>
          <p>未找到这篇文章。</p>
          <Link className={styles.back} to='/blog'>
            返回文章列表
          </Link>
        </div>
        <HomeFooter year={year} />
      </div>
    );
  }

  const { article, prevId, nextId } = result;
  const prevArticle = prevId ? getBlogDetailMock(prevId)?.article : null;
  const nextArticle = nextId ? getBlogDetailMock(nextId)?.article : null;

  return (
    <div className={styles.page}>
      <HomeHeader />
      <article className={styles.articleWrap}>
        <div className={styles.meta}>
          <span className={styles.category}>{article.category}</span>
          <span className={styles.dot}>·</span>
          <time dateTime={article.publishedAt}>{formatDisplayDate(article.publishedAt)}</time>
          <span className={styles.dot}>·</span>
          <span>{article.author}</span>
        </div>
        <h1 className={styles.title}>{article.title}</h1>
        <p className={styles.excerpt}>{article.excerpt}</p>
        <div className={styles.cover}>
          <img src={article.coverImage} alt='' />
        </div>
        <div className={styles.tags}>
          {article.tags.map((t) => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>
        <div className={styles.stats}>
          <span className={styles.stat}>阅读 {article.views}</span>
          <span className={styles.stat}>点赞 {article.likes}</span>
          <span className={styles.stat}>评论 {article.comments}</span>
        </div>

        <div className={styles.md}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.contentMarkdown}</ReactMarkdown>
        </div>

        <footer className={styles.navFoot}>
          <div>
            {prevId && prevArticle ? (
              <Link className={styles.navLink} to={`/blog/${prevId}`}>
                <div className={styles.navLabel}>上一篇</div>
                <div className={styles.navTitle}>{prevArticle.title}</div>
              </Link>
            ) : (
              <div className={`${styles.navLink} ${styles.navLinkMuted}`}>
                <div className={styles.navLabel}>上一篇</div>
                <div className={styles.navTitle}>没有了</div>
              </div>
            )}
          </div>
          <div className={styles.navColNext}>
            {nextId && nextArticle ? (
              <Link className={styles.navLink} to={`/blog/${nextId}`}>
                <div className={styles.navLabel}>下一篇</div>
                <div className={styles.navTitle}>{nextArticle.title}</div>
              </Link>
            ) : (
              <div className={`${styles.navLink} ${styles.navLinkMuted}`}>
                <div className={styles.navLabel}>下一篇</div>
                <div className={styles.navTitle}>没有了</div>
              </div>
            )}
          </div>
        </footer>
      </article>
      <HomeFooter year={year} />
    </div>
  );
}
