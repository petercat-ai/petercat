// import type { MetaData } from '@ant-design/pro-chat';
import { Bubble, useXAgent, useXChat, XStream } from '@ant-design/x';
import { MessageInfo } from '@ant-design/x/es/useXChat';
import { Flex, GetProp, theme } from 'antd';
import { isEmpty } from 'lodash';
import React, { memo, useEffect, useRef, useState, type FC } from 'react';
import useSWR from 'swr';
import SignatureIcon from '../icons/SignatureIcon';
import {
  IContentMessage,
  ImageURLContentBlock,
  ITool,
  MessageTypeEnum,
  Role,
} from '../interface';
import { BOT_INFO } from '../mock';
import { fetcher, streamChat } from '../services/ChatController';
import StarterList from '../StarterList';
import ThoughtChain from '../ThoughtChain';
import { parseStreamChunk } from '../utils';
import InputArea from './components/InputAreaRender';
import LoadingStart from './components/LoadingStart';
import MarkdownRender from './components/MarkdownRender';
import UserContent from './components/UserContent';
import { UITemplateRender } from './template';
import LegacyChat from './~index';

export interface MetaData {
  /**
   * 角色头像
   * @description 可选参数，如果不传则使用默认头像
   */
  avatar?: string;
  /**
   *  背景色
   * @description 可选参数，如果不传则使用默认背景色
   */
  backgroundColor?: string;
  /**
   * 名称
   * @description 可选参数，如果不传则使用默认名称
   */
  title?: string;
  /**
   * 自定义类名
   * @description 可选参数，如果不传则使用默认类名
   */
  className?: string;
}

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
    helloMessage = '让我们开始对话吧~',
    apiDomain = 'http://127.0.0.1:8000',
    apiUrl,
    drawerWidth = 500,
    assistantMeta,
    starters = [],
    prompt,
    token,
    style,
    disabled = false,
    hideLogo = false,
    disabledPlaceholder,
    editBotId,
    getToolsResult,
  }) => {
    const { token: designToken } = theme.useToken();
    const tokenRef = useRef<string | undefined>(token);
    useEffect(() => {
      tokenRef.current = token;
    }, [token]);
    const messageMinWidth = drawerWidth
      ? `calc(${drawerWidth}px - 90px)`
      : '400px';
    const [currentBotInfo, setCurrentBotInfo] = useState<BotInfo>({
      assistantMeta: {
        avatar: assistantMeta?.avatar,
        title: assistantMeta?.title,
        backgroundColor: assistantMeta?.backgroundColor,
      },
      helloMessage: helloMessage,
      starters: starters,
    });
    const { data: botDetail } = useSWR(
      tokenRef?.current
        ? [
            `${apiDomain}/api/bot/detail?id=${tokenRef?.current}`,
            tokenRef?.current,
          ]
        : null,
      fetcher<BotInfo>,
    );

    const [abortController, setAbortController] = useState<AbortController>();

    const resetController = () => {
      if (abortController) {
        // 在发起请求前重置控制器
        abortController.abort();
      }
      const newAbortController = new AbortController();
      setAbortController(newAbortController);
      return newAbortController;
    };

    // ============================ Agent =============================
    const [agent] = useXAgent<IContentMessage>({
      baseURL: apiDomain,
      request: async (
        { message, messages = [] },
        { onError, onUpdate, onSuccess },
      ) => {
        onUpdate({
          role: Role.loading,
          content: [],
        });
        console.log('message list are', messages);
        console.log('message is', message);
        const newMessages = messages
          .filter(
            (item) => item.role !== Role.tool && item.role !== Role.knowledge,
          )
          .map((item) => {
            return {
              ...item,
              content: item.content.filter(
                (item) =>
                  item.type !== MessageTypeEnum.ERROR &&
                  item.type !== MessageTypeEnum.TOOL,
              ),
            };
          });
        let res: IContentMessage = { role: Role.assistant, content: [] };
        try {
          const response = await streamChat(
            newMessages,
            apiDomain,
            apiUrl,
            prompt,
            editBotId || tokenRef?.current,
            resetController().signal,
          );
          if (response.body instanceof ReadableStream) {
            console.log('stream response is', response);
            for await (const chunk of XStream({
              readableStream: response.body!,
            })) {
              const resContent = parseStreamChunk(res.content, chunk.data);

              res = {
                role: Role.assistant,
                content: resContent,
              };
              onUpdate(res);
            }
          } else {
            return {
              role: Role.assistant,
              content: [
                { type: MessageTypeEnum.TEXT, text: String(response.json()) },
              ],
            };
          }
        } catch (e: any) {
          // 处理请求错误，例如网络错误
          onError(e);
        }
        onSuccess(res);
      },
    });

    // ============================= Chat =============================
    const { setMessages, messages, onRequest } = useXChat<
      IContentMessage,
      IContentMessage
    >({
      agent,
    });

    const resetChat = () => {
      const initMessages: MessageInfo<IContentMessage>[] = [
        {
          id: 'init',
          status: 'success',
          message: {
            role: Role.init,
            content: [
              {
                type: MessageTypeEnum.TEXT,
                text: helloMessage || BOT_INFO.helloMessage,
              },
            ],
          },
        },
      ];
      if (currentBotInfo.starters?.length) {
        initMessages.push({
          id: 'suggestion',
          status: 'success' as const,
          message: {
            role: Role.starter,
            content: currentBotInfo.starters.map((starterTxt) => {
              return {
                type: MessageTypeEnum.TEXT,
                text: starterTxt,
              };
            }),
          },
        });
      }
      console.log('setMessages', initMessages);
      setMessages(initMessages);
    };

    React.useEffect(() => {
      resetChat();
    }, [currentBotInfo]);

    // ============================ Event ============================
    const handleSendMessage = (message: IContentMessage) => {
      setMessages((prev) =>
        prev.filter((info) => info.id !== 'init' && info.id !== 'suggestion'),
      );
      onRequest(message);
    };

    useEffect(() => {
      if (isEmpty(botDetail)) {
        return;
      }
      // @ts-ignore
      const info = botDetail?.[0] as any;
      setCurrentBotInfo({
        assistantMeta: {
          avatar: info.avatar,
          title: info.name,
        },
        helloMessage: info.hello_message,
        starters: info.starters,
      });
    }, [botDetail]);
    // ============================ Roles =============================
    const roles: GetProp<typeof Bubble.List, 'roles'> = React.useMemo(() => {
      const { title, avatar = BOT_INFO.avatar } =
        currentBotInfo.assistantMeta ?? {};
      return {
        [Role.init]: {
          classNames: {
            avatar: 'petercat-avatar',
            header: 'petercat-header',
            content: 'petercat-content-start',
          },
          placement: 'start',
          avatar: {
            src: avatar,
          },
          header: <>{title}</>,
          messageRender: (items) => {
            try {
              // @ts-ignore
              const hello = items.content[0].text;
              return <MarkdownRender content={hello} />;
            } catch (e) {
              console.log('init items', e);
              console.log('init items', items);
            }
          },
        },
        [Role.starter]: {
          placement: 'start',
          variant: 'borderless',
          messageRender: (items) => {
            try {
              // @ts-ignore
              const starters = items.content.map((item) => item.text);
              return (
                <StarterList
                  className="ml-[52px]"
                  starters={starters}
                  onClick={(item) => {
                    handleSendMessage({
                      role: Role.user,
                      content: [
                        {
                          type: MessageTypeEnum.TEXT,
                          text: item.trim(),
                        },
                      ],
                    });
                  }}
                ></StarterList>
              );
            } catch (e) {
              console.log('starter items', e);
              console.log('starter items', items);
            }
          },
        },
        [Role.assistant]: {
          classNames: {
            avatar: 'petercat-avatar',
            header: 'petercat-header',
          },
          placement: 'start',
          avatar: {
            src: avatar,
          },
          variant: 'borderless',
          header: <>{title}</>,
          messageRender: (items)=> {
            // 这里是 IMessageContent
            console.log('++++assistant++++', items);
            const tool = items.find(item=>item.type === )
            try {
              return (
                <>
                  {/* @ts-ignore */}
                  {items.content.map((item: IContentMessage, index: number) => {
                    const { extra } = item.content as ITool;
                    getToolsResult?.(extra);
                    const { data, status, source, template_id } = extra;
                    return (
                      <>
                        {item.type === MessageTypeEnum.TOOL && (
                          <ThoughtChain
                            key={index}
                            content={extra}
                            status={status}
                            source={source}
                          />
                        )}
                        {item.type === 'text' && (
                          <MarkdownRender
                            className="petercat-content-start"
                            content={item.text}
                          />
                        )}
                        {template_id && (
                          <div
                            style={{ maxWidth: messageMinWidth }}
                            className="transition-all duration-300 ease-in-out"
                          >
                            {UITemplateRender({
                              templateId: template_id,
                              cardData: data,
                              apiDomain: apiDomain,
                              token: tokenRef?.current ?? '',
                            })}
                          </div>
                        )}
                      </>
                    );
                  })}
                </>
              );
            } catch (e) {
              console.log('items', items);
            }
          },
          typing: {
            step: 5,
          },
        },
        [Role.user]: {
          classNames: {
            avatar: 'petercat-avatar',
            header: 'petercat-header',
            content: 'petercat-content-end',
          },
          placement: 'end',
          messageRender: (items) => {
            try {
              // @ts-ignore
              const { images, text } = items.content.reduce(
                (acc: any, item: any) => {
                  if (item.type === 'image_url') acc.images.push(item);
                  else if (item.type === 'text') acc.text += item.text;
                  return acc;
                },
                { images: [] as ImageURLContentBlock[], text: '' },
              );
              return <UserContent images={images} text={text} />;
            } catch (e) {
              console.log('user items', e);
              console.log('user items', items);
            }
          },
        },
        [Role.loading]: {
          classNames: {
            avatar: 'petercat-avatar',
            header: 'petercat-header',
          },
          placement: 'start',
          avatar: {
            src: avatar,
          },
          header: <div>{title}</div>,
          variant: 'borderless',
          messageRender: () => {
            // TODO:设置一个超时时间
            return <LoadingStart loop={true}></LoadingStart>;
          },
        },
      };
    }, [currentBotInfo]);
    // ============================ Render ============================
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
            <div className="absolute top-[24px] left-0 w-full h-[50%] bg-[#FCFCFC] z-[9]" />
          )}
          <Flex
            vertical
            className="h-full"
            style={{ padding: designToken.padding }}
          >
            <Bubble.List
              className="flex-auto"
              roles={roles}
              items={messages.map(({ status, message, id }, index) => {
                const role = message.role;
                console.log('-------', status, message);
                const key = id || `fixed_${index}`;
                return {
                  key,
                  role,
                  content: { ...message, status, id },
                  typing: false,
                };
              })}
            />
            <div style={{ paddingTop: designToken.paddingSM }}>
              <InputArea
                apiDomain={apiDomain}
                disabled={disabled}
                disabledPlaceholder={disabledPlaceholder}
                isShowStop={agent.isRequesting()}
                onMessageSend={(contentStr) => {
                  const message = {
                    role: Role.user,
                    content: JSON.parse(contentStr),
                  };
                  handleSendMessage(message);
                }}
                onClear={() => {
                  resetController();
                  resetChat();
                  // TODO: handle this
                }}
                onStop={() => {
                  // TODO: handle this
                  abortController?.abort();
                }}
              />
            </div>
          </Flex>
        </div>
      </div>
    );
  },
);

(Chat as any).LegacyChat = LegacyChat;

export default Chat;
