import { Empty } from 'antd';

export default (props: { status: 'empty' | 'error' }) => {
  const { status } = props || {};

  let title = '未查询到数据哦';

  if (status === 'empty') {
    title = '未查询到数据哦';
  }
  if (status === 'error') {
    title = '错误';
  }

  return <Empty description={title} />;
};
