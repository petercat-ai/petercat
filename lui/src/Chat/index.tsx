import type {
  ChatItemProps,
  ChatMessage,
  MetaData,
  ProChatInstance,
} from '@ant-design/pro-chat';
import { ProChat } from '@ant-design/pro-chat';
import { Markdown } from '@ant-design/pro-editor';
import { isEmpty, map } from 'lodash';
import React, {
  ReactNode,
  memo,
  useEffect,
  useRef,
  useState,
  type FC,
} from 'react';
import useSWR from 'swr';
import StopBtn from '../StopBtn';
import ThoughtChain from '../ThoughtChain';
import SignatureIcon from '../icons/SignatureIcon';
import { Message, Role } from '../interface';
import { BOT_INFO } from '../mock';
import { fetcher, streamChat } from '../services/ChatController';
import { convertChunkToJson, handleStream } from '../utils';
import InputArea from './inputArea/InputArea';
import Actions from './inputArea/actions';

import '../style/global.css';

export interface BotInfo {
  assistantMeta?: MetaData;
  helloMessage?: string;
  starters?: string[];
}

export interface ChatProps extends BotInfo {
  apiDomain?: string;
  apiUrl?: string;
  drawerWidth?: number;
  prompt?: string;
  token?: string;
  style?: React.CSSProperties;
  hideLogo?: boolean;
  getToolsResult?: (response: any) => void;
}

const Chat: FC<ChatProps> = memo(
  ({
    helloMessage,
    apiDomain = 'http://127.0.0.1:8000',
    apiUrl,
    drawerWidth,
    assistantMeta,
    starters,
    prompt,
    token,
    style,
    hideLogo = false,
    getToolsResult,
  }) => {
    const proChatRef = useRef<ProChatInstance>();
    const [chats, setChats] = useState<ChatMessage<Record<string, any>>[]>();
    const { data: detail } = useSWR<BotInfo>(
      token ? [`${apiDomain}/api/bot/detail?id=${token}`] : null,
      fetcher,
    );

    const [botInfo, setBotInfo] = useState<BotInfo>({
      assistantMeta: {
        avatar: assistantMeta?.avatar,
        title: assistantMeta?.title,
        backgroundColor: assistantMeta?.backgroundColor,
      },
      helloMessage: helloMessage,
      starters: starters,
    });

    useEffect(() => {
      setBotInfo({
        assistantMeta: {
          avatar: assistantMeta?.avatar,
          title: assistantMeta?.title,
          backgroundColor: assistantMeta?.backgroundColor,
        },
        helloMessage: helloMessage,
        starters: starters,
      });
    }, [assistantMeta, helloMessage, starters]);

    useEffect(() => {
      if (proChatRef?.current) {
        proChatRef?.current?.clearMessage();
      }
    }, [token, prompt, proChatRef?.current]);

    useEffect(() => {
      if (isEmpty(detail)) {
        return;
      }
      // @ts-ignore
      const info = detail?.[0] as any;
      setBotInfo({
        assistantMeta: {
          avatar: info.avatar,
          title: info.name,
        },
        helloMessage: info.hello_message,
        starters: info.starters,
      });
    }, [detail]);

    const messageMinWidth = drawerWidth
      ? `calc(${drawerWidth}px - 90px)`
      : '400px';
    return (
      <div
        className="petercat-lui bg-[#FCFCFC] pb-6 pt-2"
        style={{
          ...style,
          minWidth: drawerWidth,
          height: '100%',
        }}
      >
        <div className="h-full w-full flex flex-col">
          {!hideLogo && <SignatureIcon className="mx-auto my-2 flex-none" />}
          <ProChat
            className="flex-1"
            showTitle
            chats={chats}
            onChatsChange={(chats) => {
              setChats(chats);
            }}
            chatRef={proChatRef}
            helloMessage={botInfo.helloMessage}
            userMeta={{ title: 'User' }}
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
                const originData = props.originData || {};
                if (originData?.role === Role.user) {
                  return defaultDom;
                }
                console.log('originData', originData);

                const originMessage = convertChunkToJson(
                  originData.content,
                ) as any;

                const defaultMessageContent = (
                  <div className="leftMessageContent">{defaultDom}</div>
                );

                if (!originMessage || typeof originMessage === 'string') {
                  return defaultMessageContent;
                }

                const { message: answerStr, tools = [] } = originMessage;

                if (isEmpty(tools)) {
                  return (
                    <div
                      className="leftMessageContent"
                      style={{ minWidth: messageMinWidth }}
                    >
                      <Markdown
                        className="ant-pro-chat-list-item-message-content"
                        style={{ overflowX: 'hidden', overflowY: 'auto' }}
                      >
                        {answerStr}
                      </Markdown>
                    </div>
                  );
                }

                const lastTool = tools[tools.length - 1];
                const { type, extra } = lastTool;

                if (![Role.knowledge, Role.tool].includes(type)) {
                  return defaultMessageContent;
                }
                getToolsResult?.(extra);
                const { status, source } = extra;

                return (
                  <div
                    className="leftMessageContent"
                    style={{ maxWidth: messageMinWidth }}
                  >
                    <div className="mb-1">
                      <ThoughtChain
                        content={extra}
                        status={status}
                        source={source}
                      />
                    </div>
                    <Markdown
                      className="ant-pro-chat-list-item-message-content"
                      style={{ overflowX: 'hidden', overflowY: 'auto' }}
                    >
                      {answerStr}
                    </Markdown>
                  </div>
                );
              },
            }}
            assistantMeta={{
              avatar: botInfo.assistantMeta?.avatar || BOT_INFO.avatar,
              title: botInfo.assistantMeta?.title || BOT_INFO.name,
              backgroundColor:
                botInfo.assistantMeta?.backgroundColor || '#FAE4CB',
            }}
            autocompleteRequest={async (value) => {
              if (value === '/') {
                const questions = botInfo.starters || BOT_INFO.starters;
                return map(questions, (question: string) => ({
                  value: question,
                  label: question,
                }));
              }
              return [];
            }}
            request={async (messages) => {
              const newMessages = messages
                .filter(
                  (item) =>
                    item.role !== Role.tool && item.role !== Role.knowledge,
                )
                .map((message) => ({
                  role: message.role,
                  content: [
                    {
                      type: 'text',
                      text: message.content,
                    },
                  ],
                })) as Message[];

              const response = await streamChat(
                newMessages,
                apiDomain,
                apiUrl,
                prompt,
                token,
              );
              return handleStream(response);
            }}
            inputAreaRender={(
              _: ReactNode,
              onMessageSend: (message: string) => void | Promise<any>,
              onClear: () => void,
            ) => {
              return (
                <InputArea
                  isShowStop={!!proChatRef?.current?.getChatLoadingId()}
                  onMessageSend={onMessageSend}
                  onClear={onClear}
                  onStop={() => proChatRef?.current?.stopGenerateMessage()}
                />
              );
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
      </div>
    );
  },
);

export default Chat;
