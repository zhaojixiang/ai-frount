import { Skeleton } from 'antd-mobile';

export default function SkeletonPop() {
  return (
    <div style={{ padding: '16px 16px 0' }}>
      <Skeleton animated style={{ '--width': '100%', '--height': '80px' }} />
      <Skeleton.Paragraph lineCount={1} />
      <Skeleton animated style={{ '--width': '100%', '--height': '90px' }} />
      <Skeleton.Paragraph lineCount={1} />
      <Skeleton.Paragraph animated lineCount={5} />
      <div style={{ padding: '0 10px' }}>
        <Skeleton animated style={{ '--width': '100%', '--height': '160px' }} />
      </div>
    </div>
  );
}
