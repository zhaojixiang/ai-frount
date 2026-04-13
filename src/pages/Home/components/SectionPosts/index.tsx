import { Link } from 'react-router-dom';

import type { BlogPost } from '../../types';
import { formatDisplayDate } from '../../utils/formatDisplayDate';
import styles from './index.module.less';

type Props = {
  posts: BlogPost[];
};

export function SectionPosts({ posts }: Props) {
  return (
    <section id='posts' className={styles.section} aria-labelledby='posts-title'>
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id='posts-title' className={styles.title}>
            最新文章
          </h2>
          <span className={styles.meta}>Latest writing</span>
        </div>
        <div className={styles.list}>
          {posts.map((post) => (
            <Link key={post.id} className={styles.row} to={`/blog/${post.id}`}>
              <time className={styles.date} dateTime={post.publishedAt}>
                {formatDisplayDate(post.publishedAt)}
              </time>
              <p className={styles.articleTitle}>{post.title}</p>
              <span className={styles.arrow} aria-hidden>
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
