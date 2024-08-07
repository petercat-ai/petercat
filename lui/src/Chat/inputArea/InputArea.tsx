import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';
import { NewMessageIcon } from '../../icons/NewMessageIcon';
import { SendMessageIcon } from '../../icons/SendMessageIcon';
import { StopMessageIcon } from '../../icons/StopMessageIcon';
import { UploadImageIcon } from '../../icons/UploadImageIcon';

const InputAreaRender = (props: {
  isShowStop: boolean;
  onMessageSend: (message: string) => void | Promise<any>;
  onClear: () => void;
  onStop: () => void;
}) => {
  const [form] = Form.useForm();
  const [message, setMessage] = useState('');
  const finish = (value: { question: string }) => {
    if (props && props.onMessageSend) {
      setMessage('');
      form.resetFields();
      props.onMessageSend(value.question ?? '');
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      setMessage('');
      form.resetFields();
      props.onMessageSend(message);
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };
  return (
    <Form
      form={form}
      onFinish={finish}
      className="px-[12px] py-[10px] m-[12px] rounded-[10px] lui-input-area bg-[#f1f1f1]"
    >
      <Form.Item name="question">
        <Input.TextArea
          value={message}
          onChange={handleChange}
          style={{
            height: 100,
            border: 'none',
            resize: 'none',
            backgroundColor: '#F1F1F1',
          }}
          onKeyDown={handleKeyDown}
        />
      </Form.Item>
      <div className="flex w-[100%]">
        <div className="space-x-2 flex-1">
          {props && props.isShowStop && (
            <Button
              type="primary"
              className="bg-white hover:!bg-white"
              icon={<StopMessageIcon />}
              onClick={() => {
                if (props && props.onStop) {
                  props.onStop();
                }
              }}
            ></Button>
          )}
          <Button
            type="primary"
            className="bg-white hover:!bg-white"
            onClick={() => {
              if (props && props.onClear) {
                props.onClear();
              }
            }}
            icon={<NewMessageIcon />}
          ></Button>
          <Button
            type="primary"
            className="bg-white hover:!bg-white"
            icon={<UploadImageIcon />}
          ></Button>
        </div>
        <Button
          type="primary"
          className="w-[32px] bg-gray-700 hover:!bg-gray-700"
          htmlType="submit"
          icon={<SendMessageIcon />}
        ></Button>
      </div>
    </Form>
  );
};
export default InputAreaRender;
