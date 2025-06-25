import { useEffect } from 'react';

import { getDetail } from '@/services/api';

export default function About() {
  useEffect(() => {
    getDetail({ linkCode: 'PLvMVsMwIys' }).then((res) => {
      console.log(111111222, res, window?.process?.env);
    });
  }, []);

  const handleClick = () => JOJO.showPage('/home');

  return (
    <div>
      <div onClick={handleClick}>
        <div>window: {window?.process?.env?.ENV_NAME}</div>
      </div>
    </div>
  );
}
