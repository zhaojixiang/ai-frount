import styles from './index.module.less';

export function HomeHero() {
  return (
    <section className={styles.hero} aria-labelledby='hero-title'>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Personal blog</p>
        <h1 id='hero-title' className={styles.title}>
          以文字与工具，记录思考与日常。
        </h1>
        <p className={styles.lead}>
          这里是一个人的数字客厅：写作、实验、以及偶尔的生活切片。界面刻意保持安静，让内容成为主角。
        </p>
        <div className={styles.line} aria-hidden />
      </div>
    </section>
  );
}
