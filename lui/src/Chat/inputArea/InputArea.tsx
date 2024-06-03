import { Button, Form, Input, Space } from 'antd';
import React from 'react';
import { SendMessageIcon } from "../../icon/sendMessageIcon";
import { StopMessageIcon } from "../../icon/stopMessageIcon";
import { NewMessageIcon } from "../../icon/newMessageIcon";
import { UploadImageIcon } from "../../icon/uploadImageIcon";

const inputAreaRender = () => {
  const finish = () => {
    
  }
  return (
    <Form
      onFinish={finish}
      className='px-[12px] py-[10px] m-[12px] rounded-[10px] lui-input-area bg-[#f1f1f1]'
    >
      <Form.Item
        name="question"
      >
        <Input.TextArea style={{ height: 100 , border: 'none',resize: 'none', backgroundColor: '#F1F1F1'}} />
      </Form.Item>
      <div className="flex w-[100%]">
        <div className="space-x-2 flex-1">
          <Button type="primary" className="bg-white hover:!bg-white" htmlType="submit" icon={<StopMessageIcon />}>
          </Button>
          <Button type="primary" className="bg-white hover:!bg-white" htmlType="submit" icon={<NewMessageIcon />}>
          </Button>
          <Button type="primary" className="bg-white hover:!bg-white" htmlType="submit" icon={<UploadImageIcon />}>
          </Button>
        </div>          
        <Button type="primary" className="w-[32px] bg-gray-700 hover:!bg-gray-700" htmlType="submit" icon={<SendMessageIcon />}>
          </Button>
      </div>
    </Form>
  );
};
export default inputAreaRender;