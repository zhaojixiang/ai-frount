import { Link } from 'react-router-dom';

import type { ToolEntry } from '../../types';
import styles from './index.module.less';

type Props = {
  tools: ToolEntry[];
};

export function SectionTools({ tools }: Props) {
  return (
    <section id='tools' className={styles.section} aria-labelledby='tools-title'>
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id='tools-title' className={styles.title}>
            推荐工具
          </h2>
          <span className={styles.meta}>Tools</span>
        </div>
        <div className={styles.grid}>
          {tools.map((tool) => {
            const body = (
              <>
                <h3 className={styles.name}>{tool.name}</h3>
                <p className={styles.desc}>{tool.description}</p>
                <span className={styles.tag}>{tool.tag}</span>
              </>
            );
            const isHash = tool.href.startsWith('#');
            if (isHash) {
              return (
                <a key={tool.id} className={styles.card} href={tool.href}>
                  {body}
                </a>
              );
            }
            return (
              <Link key={tool.id} className={styles.card} to={tool.href}>
                {body}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
