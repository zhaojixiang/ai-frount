import { Skeleton } from 'antd-mobile';

export default function SkeletonPop() {
  return (
    <div className='sku-select-pop'>
      <Skeleton animated style={{ '--width': '100%', '--height': '100vh' }} />
    </div>
  );
}
