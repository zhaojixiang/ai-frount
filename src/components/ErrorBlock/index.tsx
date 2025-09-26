import { ErrorBlock } from 'antd-mobile';

import jojoErrorFinding from '@/assets/images/jojo/error-finding.png';
import jojoErrorNet from '@/assets/images/jojo/error-net.png';
import jojoupErrorOthers from '@/assets/images/jojoup/error-others.png';

export default (props: { status: 'empty' | 'error' }) => {
  const { status } = props || {};

  let image = jojoErrorFinding;
  let title = '未查询到数据哦';

  if (status === 'empty') {
    image = JOJO.Os.jojoup ? jojoupErrorOthers : jojoErrorFinding;
    title = '未查询到数据哦';
  }
  if (status === 'error') {
    image = JOJO.Os.jojoup ? jojoupErrorOthers : jojoErrorNet;
    title = '错误';
  }

  return <ErrorBlock fullPage image={image} title={title} description='' />;
};
