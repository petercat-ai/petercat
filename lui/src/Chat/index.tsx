import type {
  ChatItemProps,
  ChatMessage,
  MetaData,
  ProChatInstance,
} from '@ant-design/pro-chat';
import { ProChat } from '@ant-design/pro-chat';
import { Markdown } from '@ant-design/pro-editor';
import { Image } from 'antd';
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
import {
  ImageURLContentBlock,
  Message,
  MessageContent,
  Role,
} from '../interface';
import { BOT_INFO } from '../mock';
import { fetcher, streamChat } from '../services/ChatController';
import { convertChunkToJson, handleStream } from '../utils';
import InputArea from './components/InputAreaRender';
import Loading from './components/Loading';

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
    const [complete, setComplete] = useState(false);
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

                // Function to render images and text content
                const renderContent = (
                  images: ImageURLContentBlock[],
                  text: string,
                ) => (
                  <div className="ant-pro-chat-list-item-message-content">
                    {images.map((image, index) => (
                      <Image
                        key={index}
                        src={image.image_url?.url}
                        alt="img"
                        style={{
                          maxWidth: '300px',
                          maxHeight: '400px',
                          borderRadius: '10px',
                        }}
                      />
                    ))}
                    {text && (
                      <Markdown
                        style={{
                          overflowX: 'hidden',
                          overflowY: 'auto',
                          marginTop: '8px',
                        }}
                      >
                        {text}
                      </Markdown>
                    )}
                  </div>
                );

                // If user role, try to parse and render content
                if (originData?.role === Role.user) {
                  try {
                    const content = JSON.parse(
                      originData.content,
                    ) as MessageContent[];
                    const { images, text } = content.reduce(
                      (acc, item) => {
                        if (item.type === 'image_url') acc.images.push(item);
                        else if (item.type === 'text') acc.text += item.text;
                        return acc;
                      },
                      { images: [] as ImageURLContentBlock[], text: '' },
                    );

                    return renderContent(images, text);
                  } catch (err) {
                    console.error(err);
                    return defaultDom;
                  }
                }

                const originMessage = convertChunkToJson(
                  originData.content,
                ) as any;

                // Default message content
                const defaultMessageContent = (
                  <div className="leftMessageContent">{defaultDom}</div>
                );

                // If originMessage is invalid, return default message content
                if (
                  (!originMessage || typeof originMessage === 'string') &&
                  !!proChatRef?.current?.getChatLoadingId()
                ) {
                  return defaultMessageContent;
                }

                const { message: answerStr, tools = [] } = originMessage;
                console.log(answerStr);
                // Handle chat loading state
                if (
                  !!proChatRef?.current?.getChatLoadingId() &&
                  answerStr === '...' &&
                  isEmpty(tools)
                ) {
                  return (
                    <div className="leftMessageContent">
                      <Loading
                        loop={!complete}
                        onComplete={() => setComplete(true)}
                      />
                    </div>
                  );
                }

                // If no tools, render the markdown content
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

                // Handle tool or knowledge role
                const { type, extra } = tools[tools.length - 1];
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
                .map((message) => {
                  if (message.role === Role.user) {
                    try {
                      return {
                        role: message.role,
                        // @ts-ignore
                        content: JSON.parse(message?.content),
                      };
                    } catch (e) {
                      return message;
                    }
                  } else {
                    return {
                      role: message.role,
                      content: [
                        {
                          type: 'text',
                          text: message.content,
                        },
                      ],
                    };
                  }
                }) as Message[];

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
