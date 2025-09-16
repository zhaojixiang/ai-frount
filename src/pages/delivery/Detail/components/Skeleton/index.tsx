import { Skeleton } from 'antd-mobile';

export default function SkeletonPop() {
  return (
    <div className='sku-select-pop'>
      <Skeleton animated style={{ '--width': '100%', '--height': '60vh' }} />
      <div style={{ padding: '0 16px 16px' }}>
        <Skeleton.Title />
        <Skeleton.Paragraph lineCount={2} />
        <Skeleton.Paragraph lineCount={2} />
        <Skeleton.Paragraph lineCount={2} />
        <Skeleton.Paragraph lineCount={2} />
      </div>
    </div>
  );
}
