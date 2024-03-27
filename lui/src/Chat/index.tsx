import type {
  ChatItemProps,
  MetaData,
  ProChatInstance,
} from '@ant-design/pro-chat';
import { ProChat } from '@ant-design/pro-chat';
import StopBtn from 'lui/StopBtn';
import { theme } from 'lui/Theme';
import { Role } from 'lui/interface';
import { BOT_INFO } from 'lui/mock';
import { streamChat } from 'lui/services/ChatController';
import { handleStream } from 'lui/utils';
import React, { memo, useRef, type FC } from 'react';
import Actions from './inputArea/actions';

const { getDesignToken } = theme;
const globalToken = getDesignToken();

export interface ChatProps {
  assistantMeta?: MetaData;
  helloMessage?: string;
  slot?: {
    componentID: string;
    renderFunc: (data: any) => React.ReactNode;
  }[];
}

const Chat: FC<ChatProps> = memo(({ helloMessage }) => {
  const proChatRef = useRef<ProChatInstance>();

  return (
    <div
      className="h-full w-full"
      style={{ backgroundColor: globalToken.chatBoxBackgroundColor }}
    >
      <ProChat
        showTitle
        chatRef={proChatRef}
        helloMessage={helloMessage || BOT_INFO.work_info.prologue}
        userMeta={{ title: 'User' }}
        chatItemRenderConfig={{
          avatarRender: (props: ChatItemProps) => {
            if (props.originData?.role === Role.user) {
              return <></>;
            }
          },
        }}
        assistantMeta={{
          avatar: BOT_INFO.avatar,
          title: BOT_INFO.resourceName,
        }}
        autocompleteRequest={async (value) => {
          if (value === '/') {
            return BOT_INFO.work_info.suggested_questions.map(
              (prompt: string) => ({
                value: prompt,
                label: prompt,
              }),
            );
          }
          return [];
        }}
        request={async (messages) => {
          const newMessages = messages.map((message) => {
            return {
              role: message.role,
              content: message.content as string,
            };
          });
          const response = await streamChat(newMessages);
          return handleStream(response);
        }}
        inputAreaProps={{ className: 'userInputBox h-24 !important' }}
        actions={{
          render: () => [
            <StopBtn
              key="StopBtn"
              visible={!!proChatRef?.current?.getChatLoadingId()}
              action={() => proChatRef?.current?.stopGenerateMessage()}
            />,
            <Actions key="Actions"></Actions>,
          ],
          flexConfig: {
            gap: 24,
            direction: 'vertical',
            justify: 'space-between',
          },
        }}
      />
    </div>
  );
});

export default Chat;
