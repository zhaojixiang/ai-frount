import { Skeleton } from 'antd-mobile';

export default function SkeletonPop() {
  return (
    <div className='sku-select-pop'>
      <Skeleton animated style={{ '--width': '100%', '--height': '410px' }} />
      <div style={{ padding: '0 16px 16px' }}>
        <Skeleton.Title />
        <Skeleton.Paragraph lineCount={2} />

        <Skeleton animated style={{ '--width': '100%', '--height': '100px' }} />
      </div>
      <div style={{ padding: '16px' }}>
        <Skeleton.Paragraph lineCount={6} />
      </div>
    </div>
  );
}
