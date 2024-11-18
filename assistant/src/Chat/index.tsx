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
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
} from 'react';
import useSWR from 'swr';
import { UITemplateRender } from './template/index';

import SignatureIcon from '../icons/SignatureIcon';
import {
  ImageURLContentBlock,
  Message,
  MessageContent,
  Role,
} from '../interface';
import { BOT_INFO } from '../mock';
import { fetcher, streamChat } from '../services/ChatController';
import StarterList from '../StarterList';
import ThoughtChain from '../ThoughtChain';
import { convertChunkToJson, handleStream } from '../utils';
import ChatItemRender from './components/ChatItemRender';
import InputArea from './components/InputAreaRender';
import LoadingEnd from './components/LoadingEnd';
import LoadingStart from './components/LoadingStart';
import UserContent from './components/UserContent';

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
  editBotId?: string;
  style?: React.CSSProperties;
  hideLogo?: boolean;
  disabled?: boolean;

  disabledPlaceholder?: string;
  getToolsResult?: (response: any) => void;
}

const Chat: FC<ChatProps> = memo(
  ({
    helloMessage,
    apiDomain = 'http://127.0.0.1:8000',
    apiUrl,
    drawerWidth = 500,
    assistantMeta,
    starters,
    prompt,
    token,
    style,
    disabled = false,
    hideLogo = false,
    disabledPlaceholder,
    editBotId,
    getToolsResult,
  }) => {
    const proChatRef = useRef<ProChatInstance>();
    const tokenRef = useRef<string | undefined>(token);
    const [chats, setChats] = useState<ChatMessage<Record<string, any>>[]>();
    const [complete, setComplete] = useState(false);
    useEffect(() => {
      tokenRef.current = token;
    }, [token]);
    const { data: detail } = useSWR(
      tokenRef?.current
        ? [
            `${apiDomain}/api/bot/detail?id=${tokenRef?.current}`,
            tokenRef?.current,
          ]
        : null,
      fetcher<BotInfo>,
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

    const request = useCallback(
      async (messages: any[]) => {
        const newMessages = messages
          .filter(
            (item) => item.role !== Role.tool && item.role !== Role.knowledge,
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
              const originMessage = convertChunkToJson(
                message?.content as string,
              ) as any;
              const text =
                typeof originMessage === 'string'
                  ? originMessage
                  : originMessage.message;
              return {
                role: message.role,
                content: [
                  {
                    type: 'text',
                    text: text,
                  },
                ],
              };
            }
          }) as Message[];

        try {
          const token = editBotId || tokenRef?.current;
          const response = await streamChat(
            newMessages,
            apiDomain,
            apiUrl,
            prompt,
            token,
          );
          return handleStream(response);
        } catch (e: any) {
          // 处理请求错误，例如网络错误
          return new Response(
            `data: ${JSON.stringify({
              status: 'error',
              message: e.message,
            })}`,
          );
        }
      },
      [apiDomain, apiUrl, prompt, tokenRef?.current, editBotId],
    );

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
    }, [tokenRef?.current, prompt, proChatRef?.current]);

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
        className="petercat-lui bg-[#FCFCFC] pt-2"
        style={{
          ...style,
          minWidth: drawerWidth,
          height: '100%',
        }}
      >
        <div className="h-full w-full flex flex-col relative">
          {!hideLogo && <SignatureIcon className="mx-auto my-2 flex-none" />}
          {disabled && (
            <div className="absolute top-[24px] left-0 w-full h-[50%] bg-[#FCFCFC] z-[999]" />
          )}
          <ProChat
            className="flex-1"
            showTitle
            chats={chats}
            onChatsChange={(chats) => {
              setChats(chats);
            }}
            chatRef={proChatRef}
            helloMessage={botInfo.helloMessage}
            userMeta={{ title: ' ' }}
            chatItemRenderConfig={{
              render: (
                props: ChatItemProps,
                domsMap: {
                  avatar: ReactNode;
                  title: ReactNode;
                  messageContent: ReactNode;
                  actions: ReactNode;
                  itemDom: ReactNode;
                },
                defaultDom: ReactNode,
              ) => {
                if (disabled) {
                  return;
                }
                const originData = props.originData || {};
                const isDefault = originData.role === 'hello';
                // default message content
                if (isDefault) {
                  return (
                    <ChatItemRender
                      direction={'start'}
                      title={domsMap.title}
                      avatar={domsMap.avatar}
                      content={
                        <div className="leftMessageContent">
                          <div className="ant-pro-chat-list-item-message-content">
                            <div className="text-left text-[14px] font-[500] leading-[28px] font-sf">
                              {props.message}
                            </div>
                          </div>
                        </div>
                      }
                      starter={
                        <StarterList
                          starters={botInfo?.starters ?? starters ?? []}
                          onClick={(msg: string) => {
                            proChatRef?.current?.sendMessage(
                              JSON.stringify([{ type: 'text', text: msg }]),
                            );
                          }}
                          className="ml-[72px]"
                        />
                      }
                    />
                  );
                }

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
                    return (
                      <ChatItemRender
                        direction={'end'}
                        title={domsMap.title}
                        content={<UserContent images={images} text={text} />}
                      />
                    );
                  } catch (err) {
                    console.error(err);
                    return defaultDom;
                  }
                }

                const originMessage = convertChunkToJson(
                  originData.content,
                ) as any;

                // handle errors
                if (originMessage.errors.length > 0) {
                  return (
                    <ChatItemRender
                      direction={'start'}
                      avatar={domsMap.avatar}
                      title={domsMap.title}
                      content={
                        <div className="leftMessageContent">
                          <div className="ant-pro-chat-list-item-message-content text-red-700">
                            ops...似乎出了点问题。
                          </div>
                        </div>
                      }
                    />
                  );
                }

                // Default message content
                const defaultMessageContent = (
                  <div className="leftMessageContent">{defaultDom}</div>
                );

                // If originMessage is invalid, return default message content
                if (
                  (!originMessage || typeof originMessage === 'string') &&
                  !!proChatRef?.current?.getChatLoadingId()
                ) {
                  return (
                    <ChatItemRender
                      direction={'start'}
                      avatar={domsMap.avatar}
                      title={domsMap.title}
                      content={defaultMessageContent}
                    />
                  );
                }

                const { message: answerStr, tools = [] } = originMessage;
                // Handle chat loading state
                if (
                  !!proChatRef?.current?.getChatLoadingId() &&
                  answerStr === '...' &&
                  isEmpty(tools)
                ) {
                  return (
                    <ChatItemRender
                      direction={'start'}
                      avatar={domsMap.avatar}
                      title={domsMap.title}
                      content={
                        <div className="leftMessageContent">
                          <LoadingStart
                            loop={!complete}
                            onComplete={() => setComplete(true)}
                          />
                        </div>
                      }
                    />
                  );
                }

                // If no tools, render the markdown content
                if (isEmpty(tools)) {
                  return (
                    <ChatItemRender
                      direction={'start'}
                      avatar={domsMap.avatar}
                      title={domsMap.title}
                      content={
                        <div className="leftMessageContent">
                          <LoadingEnd>
                            <Markdown
                              className="ant-pro-chat-list-item-message-content"
                              style={{ overflowX: 'hidden', overflowY: 'auto' }}
                            >
                              {answerStr}
                            </Markdown>
                          </LoadingEnd>
                        </div>
                      }
                    />
                  );
                }

                // Handle tool or knowledge role
                const { type, extra } = tools[tools.length - 1];
                if (![Role.knowledge, Role.tool].includes(type)) {
                  return (
                    <ChatItemRender
                      direction={'start'}
                      avatar={domsMap.avatar}
                      title={domsMap.title}
                      content={defaultMessageContent}
                    />
                  );
                }

                getToolsResult?.(extra);
                const { status, source, template_id, data } = extra;
                return (
                  <ChatItemRender
                    direction={'start'}
                    avatar={domsMap.avatar}
                    title={domsMap.title}
                    content={
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
                        {answerStr && (
                          <Markdown
                            className={`${
                              template_id
                                ? 'mt-2 rounded-[20px] p-3 bg-[#F1F1F1]'
                                : 'ant-pro-chat-list-item-message-content'
                            }`}
                            style={{ overflowX: 'hidden', overflowY: 'auto' }}
                          >
                            {answerStr}
                          </Markdown>
                        )}
                        {template_id &&
                          proChatRef?.current?.getChatLoadingId() ===
                            undefined && (
                            <div
                              style={{ maxWidth: messageMinWidth }}
                              className="transition-all duration-300 ease-in-out"
                            >
                              {UITemplateRender({
                                templateId: template_id,
                                cardData: data,
                                apiDomain: apiDomain,
                                token: tokenRef?.current!,
                              })}
                            </div>
                          )}
                      </div>
                    }
                  />
                );
              },
            }}
            assistantMeta={{
              avatar: botInfo.assistantMeta?.avatar || BOT_INFO.avatar,
              title: botInfo.assistantMeta?.title || BOT_INFO.name,
              backgroundColor: botInfo.assistantMeta?.backgroundColor,
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
            request={request}
            inputAreaRender={(
              _: ReactNode,
              onMessageSend: (message: string) => void | Promise<any>,
              onClear: () => void,
            ) => {
              return (
                <InputArea
                  apiDomain={apiDomain}
                  disabled={disabled}
                  disabledPlaceholder={disabledPlaceholder}
                  isShowStop={!!proChatRef?.current?.getChatLoadingId()}
                  onMessageSend={onMessageSend}
                  onClear={onClear}
                  onStop={() => proChatRef?.current?.stopGenerateMessage()}
                />
              );
            }}
            inputAreaProps={{ className: 'userInputBox h-24 !important' }}
          />
        </div>
      </div>
    );
  },
);

export default Chat;
