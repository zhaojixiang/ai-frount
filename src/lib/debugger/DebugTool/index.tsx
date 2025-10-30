import { Button, Form, Input, Popup } from 'antd-mobile';
import React, { useRef, useState } from 'react';
import { useDrag } from 'react-use-gesture';

import S from './index.module.less';

const DebugTool: React.FC = () => {
  const curUserId = localStorage.getItem('userId');
  const initX = window.innerWidth - 390;
  const initY = window.innerHeight - 45;
  const [visible, setVisible] = useState(false);
  const [userId, setUserId] = useState(curUserId || '');

  const positionRef = useRef({ x: initX, y: initY });
  const [position, setPosition] = useState(positionRef.current);

  const bind = useDrag(
    ({ movement: [mx, my], last, event }) => {
      event?.stopPropagation();
      event?.preventDefault();

      // movement 是从初始位置开始累计的
      const newX = positionRef.current.x + mx;
      const newY = positionRef.current.y + my;

      setPosition({ x: newX, y: newY });

      if (last) {
        // 拖动结束后记住最终位置
        positionRef.current = { x: newX, y: newY };
      }
    },
    {
      pointer: { touch: true },
      filterTaps: true,
      pointerButtons: [1]
    }
  );

  const handleToggle = () => {
    setVisible(!visible);
  };

  const handleClose = () => {
    setVisible(false);
  };

  /**
   * 保存配置
   */
  const onFinish = (values: any) => {
    localStorage.setItem('userId', values.userId);
    setVisible(false);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <div
      {...bind()}
      className={S.debugTool}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 9999,
        cursor: 'move',
        touchAction: 'none' // 很关键：让拖动不会被浏览器原生手势打断
      }}>
      <div className={S.debugToolHeader} onClick={handleToggle}>
        账号
      </div>
      <Popup
        bodyClassName={S.debugToolContentWrapper}
        visible={visible}
        closeOnMaskClick={true}
        onMaskClick={handleClose}>
        <div className={S.debugToolContent}>
          <h3>本地调试工具</h3>
          <Form
            layout='horizontal'
            mode='card'
            onFinish={onFinish}
            initialValues={{ userId: curUserId }}
            footer={
              <Button block type='submit' color='primary' size='small'>
                提交
              </Button>
            }>
            <Form.Item label='UserId' name='userId'>
              <Input
                placeholder='请输入UserId'
                value={userId}
                clearable
                onChange={(val) => {
                  setUserId(val);
                }}
              />
            </Form.Item>
          </Form>
        </div>
      </Popup>
    </div>
  );
};

export default DebugTool;
