import type {
  ChatMessage,
  MetaData,
  ProChatInstance,
} from '@ant-design/pro-chat';
import { Bubble, Prompts, Sender, useXAgent, useXChat } from '@ant-design/x';
import { Button, Flex, GetProp, theme } from 'antd';
import { isEmpty } from 'lodash';
import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
} from 'react';
import useSWR from 'swr';
import { NewMessageIcon } from '../icons/NewMessageIcon';
import SignatureIcon from '../icons/SignatureIcon';
import { UploadImageIcon } from '../icons/UploadImageIcon';
import { Message, Role } from '../interface';
import { BOT_INFO } from '../mock';
import { fetcher, streamChat } from '../services/ChatController';
import { convertChunkToJson, handleStream } from '../utils';
import LegacyChat from './~index';

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

    // ============================ Roles =============================
    const roles: GetProp<typeof Bubble.List, 'roles'> = React.useMemo(() => {
      const assistantIcon = assistantMeta?.avatar || BOT_INFO.avatar;

      return {
        [Role.assistant]: {
          placement: 'start',
          avatar: {
            src: assistantIcon,
          },
          shape: 'corner',
        },
        suggestion: {
          placement: 'start',
          variant: 'borderless',
          avatar: {
            src: assistantIcon,
            style: {
              opacity: 0,
            },
          },
        },
        [Role.user]: {
          placement: 'end',
          shape: 'corner',
        },
      };
    }, [assistantMeta]);

    // ============================ Agent =============================
    type AgentType = string | string[];

    const [agent] = useXAgent<AgentType>({
      baseURL: apiDomain,
    });

    // ============================= Chat =============================
    type MessageType = string | React.ReactElement;

    const { setMessages, parsedMessages, onRequest } = useXChat<
      AgentType,
      MessageType
    >({
      agent,
      parser: (msg) => {
        if (Array.isArray(msg)) {
          return (
            <Prompts
              onItemClick={(item) => {
                setMessages([]);
                onRequest(item.data.description as string);
              }}
              items={starters.map((starter) => ({
                key: starter,
                description: starter,
              }))}
              vertical
            />
          );
        }
        return msg;
      },
    });

    const resetChat = () => {
      setMessages(
        [
          {
            id: 'init',
            status: 'success' as const,
            message: helloMessage,
          },
          starters.length
            ? {
                id: 'suggestion',
                status: 'success' as const,
                message: starters,
              }
            : null!,
        ].filter(Boolean),
      );
    };

    React.useEffect(() => {
      resetChat();
    }, []);

    // ============================ Render ============================
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
          <Flex
            vertical
            className="h-full"
            style={{ padding: designToken.paddingSM }}
          >
            <Bubble.List
              className="flex-auto"
              roles={roles}
              items={parsedMessages.map(({ status, message, id }, index) => {
                const role =
                  status === 'local'
                    ? Role.user
                    : typeof message === 'object'
                    ? 'suggestion'
                    : Role.assistant;

                return {
                  key: id || `fixed_${index}`,
                  role,
                  content: message,
                };
              })}
            />
            <div style={{ paddingTop: designToken.paddingSM }}>
              <Sender
                prefix={
                  <Flex gap={designToken.paddingXS}>
                    <Button icon={<NewMessageIcon />} onClick={resetChat} />
                    <Button icon={<UploadImageIcon />} />
                  </Flex>
                }
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
