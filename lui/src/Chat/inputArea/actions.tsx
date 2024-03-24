import {
  ItalicOutlined,
  PlusSquareOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { Button, ConfigProvider } from 'antd';
import React from 'react';

const buttonTheme = {
  components: {
    Button: {
      defaultBg: 'rgba(0, 0, 0, 0.06)',
      defaultHoverBg: 'rgb(222,222,222)',
      defaultHoverColor: 'rgba(0, 0, 0, 0.88)',
    },
  },
};

const Actions: React.FC = () => {
  return (
    <div className="flex justify-between w-full">
      <ConfigProvider theme={buttonTheme}>
        <div key="configs" className="flex">
          <Button className="mx-1" shape="circle" icon={<ToolOutlined />} />
        </div>
        <div key="actions" className="flex">
          <Button
            className="mx-1"
            shape="circle"
            icon={<PlusSquareOutlined />}
          />
          <Button className="mx-1" shape="circle" icon={<ItalicOutlined />} />
        </div>
      </ConfigProvider>
    </div>
  );
};

export default Actions;
