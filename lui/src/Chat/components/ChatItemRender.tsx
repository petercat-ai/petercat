import React, { type FC } from 'react';
import '../index.css';

interface IProps {
  direction: 'start' | 'end';
  avatar?: any;
  title: React.ReactNode;
  content: React.ReactNode;
  starter?: React.ReactNode;
}

const ChatItemRender: FC<IProps> = ({
  direction,
  avatar,
  title,
  content,
  starter = <></>,
}) => {
  return (
    <>
      <div
        className={`flex ${
          direction === 'start'
            ? 'flex-row ant-pro-chat-list-item-left'
            : 'flex-row-reverse ant-pro-chat-list-item-right'
        } ant-pro-chat-list-item ant-pro-chat-list-item-message-content gap-[12px] p-[16px] chat_item_container`}
      >
        <div
          className="ant-avatar ant-avatar-circle ant-avatar-image w-[40px] h-[40px] rounded-full overflow-hidden animate-fade-in-left"
          style={{
            backgroundColor: `${
              avatar?.props?.avatar?.backgroundColor ?? '#FAE4CB'
            }`,
          }}
        >
          <img
            src={avatar?.props?.avatar?.avatar}
            alt={avatar?.props?.avatar?.title}
          />
        </div>
        <div className="ant-pro-chat-list-item-message-container">
          {title}
          {content}
        </div>
      </div>
      {starter}
    </>
  );
};

export default ChatItemRender;
