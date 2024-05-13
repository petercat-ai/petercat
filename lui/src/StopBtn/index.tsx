import { PauseCircleFilled } from '@ant-design/icons';
import { ProChatProvider } from '@ant-design/pro-chat';
import { Space } from 'antd';
import React, { type FC } from 'react';

export interface StopBtnProps {
  text?: string;
  visible?: boolean;
  action?: () => void;
}

const StopBtn: FC<StopBtnProps> = ({ text, visible, action }) => {
  if (!visible) {
    return null;
  }
  return (
    <div className="petercat-lui">
      <ProChatProvider>
        <div
          className="h-8 w-18 flex flex-row justify-center items-center text-sm px-3 rounded-lg bg-gray-300 text-gray-800 cursor-pointer m-auto"
          onClick={() => action?.()}
        >
          <Space>
            <PauseCircleFilled />
            <span>{text ?? '停止'}</span>
          </Space>
        </div>
      </ProChatProvider>
    </div>
  );
};

export default StopBtn;
