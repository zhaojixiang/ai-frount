import S from './index.module.less';

interface IProps {
  onClose: () => void;
}

function GuideMask({ onClose }: IProps) {
  return (
    <main className={S.container} onClick={() => onClose()}>
      <div className={S.top}>
        <div>进行在线付款</div>
        <div className={S.guideArrow} />
      </div>
      <div className={S.bottom}>
        点击屏幕右上角
        <div className={S.wxRightTopBtn} />
        选择浏览器打开本页
      </div>
    </main>
  );
}

export default GuideMask;
