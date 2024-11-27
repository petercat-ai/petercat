import type { MetaData } from '@ant-design/pro-chat';
import { Bubble, Prompts, Sender, useXAgent, useXChat } from '@ant-design/x';
import { Button, Flex, GetProp, theme } from 'antd';
import React, { memo, useState, type FC } from 'react';
import { NewMessageIcon } from '../icons/NewMessageIcon';
import SignatureIcon from '../icons/SignatureIcon';
import { UploadImageIcon } from '../icons/UploadImageIcon';
import { Role } from '../interface';
import { BOT_INFO } from '../mock';
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
          typing: {
            step: 5,
          },
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
      request: async ({ message }, { onSuccess }) => {
        // TODO: Use real api instead.
        await new Promise((resolve) => {
          setTimeout(resolve, 3000);
        });

        onSuccess(`Mock Reply: ${message}`);
      },
    });

    // ============================= Chat =============================
    type MessageType = string | React.ReactElement;

    const { setMessages, parsedMessages, onRequest } = useXChat<
      AgentType,
      MessageType
    >({
      agent,
      requestPlaceholder: 'Waiting...',
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

    // ============================ Sender ============================
    const [senderTxt, setSenderTxt] = useState('');

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
                  loading: status === 'loading',
                  content: message,
                };
              })}
            />
            <div style={{ paddingTop: designToken.paddingSM }}>
              <Sender
                loading={agent.isRequesting()}
                prefix={
                  <Flex gap={designToken.paddingXS}>
                    <Button icon={<NewMessageIcon />} onClick={resetChat} />
                    <Button
                      icon={<UploadImageIcon />}
                      onClick={() => {
                        // TODO: post file to server or inline data?
                      }}
                    />
                  </Flex>
                }
                value={senderTxt}
                onChange={setSenderTxt}
                onCancel={() => {
                  // TODO: handle this
                }}
                onSubmit={(txt) => {
                  setMessages((prev) =>
                    prev.filter(
                      (info) => info.id !== 'init' && info.id !== 'suggestion',
                    ),
                  );

                  onRequest(txt);
                  setSenderTxt('');
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
