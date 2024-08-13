import {
  message as AntMessage,
  Button,
  Form,
  Image,
  Input,
  Space,
  Tooltip,
  Upload,
} from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { DeleteIcon } from '../../icons/DeleteIcon';
import { NewMessageIcon } from '../../icons/NewMessageIcon';
import { SendMessageIcon } from '../../icons/SendMessageIcon';
import { StopMessageIcon } from '../../icons/StopMessageIcon';
import { UploadImageIcon } from '../../icons/UploadImageIcon';
import {
  ImageURLContentBlock,
  MessageContent,
  TextContentBlock,
} from '../../interface';

const InputAreaRender = (props: {
  isShowStop: boolean;
  onMessageSend: (message: string) => void | Promise<any>;
  onClear: () => void;
  onStop: () => void;
}) => {
  const [form] = Form.useForm();
  const [message, setMessage] = useState('');
  const [fileList, setFileList] = useState<
    { url: string | ArrayBuffer | null; uid: any }[]
  >([]);

  const disabled = useMemo(() => fileList?.length >= 4, [fileList]);

  const handleMessage = useCallback(
    (text?: string) => {
      if (!props || !props?.onMessageSend || (!text && !fileList.length)) {
        return;
      }
      setMessage('');
      form.resetFields();
      let content: MessageContent[] = text
        ? [
            {
              type: 'text',
              text: text,
            } as TextContentBlock,
          ]
        : [];
      if (fileList.length > 0) {
        const images = fileList.map((file) => {
          return {
            type: 'image_url',
            image_url: {
              url: file.url,
              detail: 'low',
            },
          } as ImageURLContentBlock;
        });
        content = content.concat(images);
      }
      props.onMessageSend(JSON.stringify(content));
      setFileList([]);
    },
    [props.onMessageSend, fileList],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      handleMessage(message);
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleUpload = ({ file, uid }: { file: File | null; uid: string }) => {
    if (!file || disabled) {
      return;
    }
    if (fileList.length >= 4) {
      AntMessage.warning('上传图片不能超过 4 张');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFileList([...fileList, { url: reader.result, uid }]);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (uid: string) => {
    setFileList(fileList.filter((item) => item.uid !== uid));
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const clipboardItems = event.clipboardData.items;
    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i];
      if (item.type.includes('image')) {
        const file = item.getAsFile();
        handleUpload({ file, uid: Date.now().toString() });
      }
    }
  };

  return (
    <Form
      form={form}
      className="px-[12px] py-[10px] m-[12px] rounded-[10px] lui-input-area bg-[#f1f1f1]"
    >
      <Form.Item name="question">
        <Input.TextArea
          value={message}
          onChange={handleChange}
          onPaste={handlePaste}
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
        <div className="flex-1">
          <Space>
            {props && props.isShowStop && (
              <Button
                type="primary"
                className="bg-white hover:!bg-white shadow-md"
                icon={<StopMessageIcon />}
                onClick={() => {
                  if (props && props.onStop) {
                    props.onStop();
                  }
                }}
              />
            )}
            <Button
              type="primary"
              className="bg-white hover:!bg-white shadow-md"
              onClick={() => {
                if (props && props.onClear) {
                  props.onClear();
                }
              }}
              icon={<NewMessageIcon />}
            />
            <Upload
              accept="image/*"
              disabled={disabled}
              showUploadList={false}
              // @ts-ignore
              customRequest={handleUpload}
            >
              <Tooltip
                title={disabled ? '上传图片不能超过 4 张' : ''}
                trigger="hover"
              >
                <Button
                  type="primary"
                  className={
                    disabled
                      ? 'cu🤪rsor-not-allowed bg-white hover:!bg-white shadow-md'
                      : 'bg-white hover:!bg-white shadow-md'
                  }
                  icon={
                    <div style={disabled ? { opacity: 0.6 } : {}}>
                      <UploadImageIcon />
                    </div>
                  }
                />
              </Tooltip>
            </Upload>
            {fileList.map((file) => (
              <div key={file.uid} className="relative h-[32px]">
                <Image
                  src={file.url as string}
                  preview={{
                    mask: false,
                  }}
                  width={32}
                  height={32}
                  alt="uploaded"
                  className="object-cover rounded-lg shadow-md"
                />
                <div
                  className="absolute w-[16px] h-[16px] bg-gray-800 top-[-8px] right-[-8px] text-white rounded-full cursor-pointer"
                  style={{ border: '2px solid #f1f1f1' }}
                  onClick={() => handleRemove(file.uid)}
                >
                  <DeleteIcon />
                </div>
              </div>
            ))}
          </Space>
        </div>
        <Button
          type="primary"
          className="w-[32px] bg-gray-700 hover:!bg-gray-700 shadow-md"
          onClick={() => {
            handleMessage(form.getFieldValue('question'));
          }}
          htmlType="submit"
          icon={<SendMessageIcon />}
        />
      </div>
    </Form>
  );
};
export default InputAreaRender;
