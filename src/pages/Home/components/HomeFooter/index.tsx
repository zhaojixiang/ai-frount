import styles from './index.module.less';

type Props = {
  year: number;
};

export function HomeFooter({ year }: Props) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>© {year} Journal. 保留所有权利。</p>
        <div className={styles.links}>
          <a href='mailto:hello@example.com'>联系</a>
          <a href='#posts'>归档</a>
        </div>
      </div>
    </footer>
  );
}
