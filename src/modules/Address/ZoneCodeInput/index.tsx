import { Picker } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import { useEffect, useState } from 'react';

import telPrefixData from '../telPrefix';
import S from './index.module.less';

interface IProps {
  onChange?: (val: any[]) => void;
  value?: any[];
}

export default (props: IProps) => {
  const { onChange, value = [] } = props;
  const [visible, setVisible] = useState(false);

  const [preView, setPreView] = useState<string>('');

  useEffect(() => {
    setPreView(telPrefixData?.find((item) => item.value === value[0])?.value || '');
  }, [value]);

  const handleConfirm = (val: any[]) => {
    onChange?.(val);
    setPreView(val[0]);
  };

  return (
    <div className={S.zoneCodeInput}>
      <div className={S.text} onClick={() => setVisible(true)}>
        {preView || '区号'} <RightOutline className={S.icon} />
      </div>
      <Picker
        columns={[telPrefixData]}
        visible={visible}
        value={value}
        onClose={() => setVisible(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};
