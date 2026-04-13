import {
  HomeFooter,
  HomeHeader,
  HomeHero,
  SectionLife,
  SectionPosts,
  SectionTools
} from './components';
import styles from './index.module.less';
import { getLatestPostsMock, getLifeMomentsMock, getToolsMock } from './mockData';

export default function Home() {
  const posts = getLatestPostsMock();
  const tools = getToolsMock();
  const moments = getLifeMomentsMock();
  const year = new Date().getFullYear();

  return (
    <div className={styles.page}>
      <HomeHeader />
      <main>
        <HomeHero />
        <SectionPosts posts={posts} />
        <SectionTools tools={tools} />
        <SectionLife moments={moments} />
      </main>
      <HomeFooter year={year} />
    </div>
  );
}
