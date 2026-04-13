import { Link, useLocation } from 'react-router-dom';

import styles from './index.module.less';

export function HomeHeader() {
  const { pathname } = useLocation();
  const homeActive = pathname === '/' || pathname === '/home';
  const blogActive = pathname.startsWith('/blog');
  const toolkitActive = pathname === '/toolkit';
  const lifeActive = pathname === '/life';

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link className={styles.brand} to='/'>
          Journal
        </Link>
        <nav className={styles.nav} aria-label='主导航'>
          <Link className={`${styles.navItem} ${homeActive ? styles.navItemActive : ''}`} to='/'>
            首页
          </Link>
          <Link
            className={`${styles.navItem} ${blogActive ? styles.navItemActive : ''}`}
            to='/blog'>
            文章
          </Link>
          <Link
            className={`${styles.navItem} ${toolkitActive ? styles.navItemActive : ''}`}
            to='/toolkit'>
            工具
          </Link>
          <Link
            className={`${styles.navItem} ${lifeActive ? styles.navItemActive : ''}`}
            to='/life'>
            生活
          </Link>
        </nav>
      </div>
    </header>
  );
}
