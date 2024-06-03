import { Button, Form, Input } from 'antd';
import React from 'react';
import { SendMessageIcon } from "../../icons/SendMessageIcon";
import { StopMessageIcon } from "../../icons/StopMessageIcon";
import { NewMessageIcon } from "../../icons/NewMessageIcon";
import { UploadImageIcon } from "../../icons/UploadImageIcon";

const inputAreaRender = (props: {
  isShowStop: boolean,
  onMessageSend: (message: string) => void | Promise<any>,
  onClear: () => void,
  onStop: () => void,
}) => {
  const finish = (value: { question: string }) => {
    if (props && props.onMessageSend) {
      props.onMessageSend(value.question ?? '');
    }
  }
  return (
    <Form
      onFinish={finish}
      className='px-[12px] py-[10px] m-[12px] rounded-[10px] lui-input-area bg-[#f1f1f1]'
    >
      <Form.Item
        name="question"
      >
        <Input.TextArea style={{ height: 100, border: 'none', resize: 'none', backgroundColor: '#F1F1F1' }} />
      </Form.Item>
      <div className="flex w-[100%]">
        <div className="space-x-2 flex-1">
          {
            props && props.isShowStop && (
              <Button type="primary" className="bg-white hover:!bg-white" icon={<StopMessageIcon />}
                onClick={() => {
                  if (props && props.onStop) {
                    props.onStop();
                  }
                }}
              >
              </Button>
            )
          }
          <Button type="primary" className="bg-white hover:!bg-white" onClick={() => {
            if (props && props.onClear) {
              props.onClear();
            }
          }} icon={<NewMessageIcon />}>
          </Button>
          <Button type="primary" className="bg-white hover:!bg-white" icon={<UploadImageIcon />}>
          </Button>
        </div>
        <Button type="primary" className="w-[32px] bg-gray-700 hover:!bg-gray-700" htmlType="submit" icon={<SendMessageIcon />}>
        </Button>
      </div>
    </Form>
  );
};
export default inputAreaRender;