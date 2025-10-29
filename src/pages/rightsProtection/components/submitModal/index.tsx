import { Mask } from 'antd-mobile';

import styles from './index.module.less';

const SubmitModal = (props: any) => {
  const { visible, onCancel, type = 'submit', onSubmit, content, btnText } = props;
  return (
    <Mask
      visible={visible}
      opacity='thin'
      onMaskClick={() => {
        onCancel();
      }}
      className={styles['submit-modal']}>
      <div className={styles.container}>
        <div className={styles.title}>
          {content ? content : '确认后将为您更换新赠课赠品，原有赠课赠品将会被回收'}
        </div>
        <div
          className={styles.btn}
          onClick={() => {
            if (type === 'submit') {
              onSubmit();
            } else {
              onCancel();
            }
          }}>
          {btnText ? btnText : '确认升级'}
        </div>
      </div>
    </Mask>
  );
};

export default SubmitModal;
