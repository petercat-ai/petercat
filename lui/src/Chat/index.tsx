import type {
  ChatItemProps,
  ChatMessage,
  MetaData,
  ProChatInstance,
} from '@ant-design/pro-chat';
import { ProChat } from '@ant-design/pro-chat';
import StopBtn from 'lui/StopBtn';
import { theme } from 'lui/Theme';
import ThoughtChain from 'lui/ThoughtChain';
import { Role } from 'lui/interface';
import { BOT_INFO } from 'lui/mock';
import { streamChat } from 'lui/services/ChatController';
import { handleStream } from 'lui/utils';
import React, { ReactNode, memo, useRef, useState, type FC } from 'react';
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
  const [chats, setChats] = useState<ChatMessage<Record<string, any>>[]>();
  return (
    <div
      className="h-full w-full"
      style={{ backgroundColor: globalToken.chatBoxBackgroundColor }}
    >
      <ProChat
        chats={chats}
        onChatsChange={(chats) => {
          setChats(chats);
        }}
        chatRef={proChatRef}
        helloMessage={helloMessage || BOT_INFO.work_info.prologue}
        userMeta={{ title: 'User' }}
        transformToChatMessage={async (pre) => {
          if (!pre.startsWith('data:')) {
            return pre;
          }
          const regex = /data:(.*)/;
          const match = pre.match(regex);
          if (match && match[1]) {
            const res = JSON.parse(match[1]);
            const { content, role, id } = res;
            if (role === Role.tool && content.status === 'success') {
              proChatRef?.current?.pushChat({
                content: content,
                id,
                role: 'tool',
              });
            }
          } else {
            console.error('No valid JSON found in input');
            return '';
          }

          return '';
        }}
        chatItemRenderConfig={{
          avatarRender: (props: ChatItemProps) => {
            if (props.originData?.role === Role.user) {
              return <></>;
            }
            if (
              props.originData?.role === Role.tool ||
              props.originData?.role === Role.knowledge
            ) {
              return <div className="w-[40px] h-[40px]" />;
            }
          },
          contentRender: (props: ChatItemProps, defaultDom: ReactNode) => {
            const _originData = props.originData || {};
            const { role, content } = _originData;
            const { status, source } = content;

            if ([Role.knowledge, Role.tool].includes(role)) {
              return (
                <ThoughtChain
                  content={content}
                  status={status}
                  source={source}
                />
              );
            }
            return defaultDom;
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
          const newMessages = messages
            .filter(
              (item) => item.role !== Role.tool && item.role !== Role.knowledge,
            )
            .map((message) => ({
              role: message.role,
              content: message.content as string,
            }));

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
