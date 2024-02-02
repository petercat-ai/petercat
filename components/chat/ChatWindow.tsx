'use client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRef, useState, ReactElement, useCallback } from 'react';
import type { FormEvent } from 'react';
import { ChatMessageBubble } from '@/components/chat/ChatMessageBubble';
import { UploadDocumentsForm } from '@/components/UploadDocumentsForm';
import { IntermediateStep } from './IntermediateStep';
import { useChat } from '../hooks/useChat';
import { Avatar } from '@nextui-org/react';
import BotInfoCard from '../BotInfoCard';
import AppendixIcon from '../icons/AppendixIcon';
import { ToolsCheck } from './ToolsCheck';
import { ImgItem } from './ImgItem';

export function ChatWindow(props: {
  endpoint: string;
  emptyStateComponent?: ReactElement;
  placeholder?: string;
  titleText?: string;
  avatar?: string;
  name?: string;
  showIngestForm?: boolean;
  showIntermediateStepsToggle?: boolean;
  prompt?: string;
  description?: string;
  starters?: string[];
  streamming?: boolean;
  loading?: boolean;
  enableImgGeneration?: boolean;
  voice?: string;
}) {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    endpoint,
    emptyStateComponent,
    placeholder,
    titleText,
    showIngestForm,
    showIntermediateStepsToggle,
    avatar,
    description,
    starters,
    name,
    loading = false,
    prompt,
    enableImgGeneration,
    voice,
  } = props;

  const [showIntermediateSteps, setShowIntermediateSteps] = useState(true);
  const ingestForm = showIngestForm && (
    <UploadDocumentsForm></UploadDocumentsForm>
  );
  const intemediateStepsToggle = showIntermediateStepsToggle && (
    <div>
      <input
        type="checkbox"
        id="show_intermediate_steps"
        name="show_intermediate_steps"
        checked={showIntermediateSteps}
        onChange={(e) => setShowIntermediateSteps(e.target.checked)}
      ></input>
      <label htmlFor="show_intermediate_steps"> Show intermediate steps</label>
    </div>
  );

  const [sourcesForMessages, setSourcesForMessages] = useState<
    Record<string, any>
  >({});

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading: chatEndpointIsLoading,
    stop,
  } = useChat({
    api: endpoint,
    onError: (e) => {
      toast(e.message, {
        theme: 'light',
      });
    },
  });

  const handleKeydown = useCallback(
    (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        handleSubmit({
          prompt,
          enableImgGeneration,
          show_intermediate_steps: true,
        });
      }
    },
    [handleSubmit, prompt, enableImgGeneration],
  );

  const welcomeComponent = emptyStateComponent ?? (
    <BotInfoCard
      loading={loading}
      name={name!}
      description={description!}
      avatar={avatar!}
      starters={starters!}
      setInput={setInput}
    />
  );

  const sendMessage = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setInput('');
      if (!chatEndpointIsLoading) {
        return handleSubmit({
          prompt,
          enableImgGeneration,
          show_intermediate_steps: true,
        });
      }
      stop();
    },
    [chatEndpointIsLoading, handleSubmit, prompt, stop, enableImgGeneration],
  );

  return (
    <div className="flex flex-col h-full items-center p-2 md:p-4 grow overflow-hidden relative mx-auto w-[1024px]">
      <h2 className="items-center text-l">{titleText}</h2>
      <h3
        className={`${
          messages.length > 0 ? '' : 'hidden'
        } text-xl flex items-center`}
      >
        <Avatar
          src={avatar!}
          className="h-12 w-12 text-large m-4"
          name={name!}
        />

        <div className="flex">{name}</div>
      </h3>
      {messages.length === 0 ? welcomeComponent : ''}

      <div
        className="flex flex-col-reverse w-full mb-16 overflow-auto transition-[flex-grow] ease-in-out"
        ref={messageContainerRef}
      >
        {messages.length > 0
          ? [...messages].reverse().map((m, i) => {
              const sourceKey = (messages.length - 1 - i).toString();
              if (m.role === 'system') {
                return (
                  <IntermediateStep key={m.id} message={m}></IntermediateStep>
                );
              }
              if (/\$\$TOOLS\$\$/.test(m.content) && enableImgGeneration) {
                if (/\$\$END\$\$/.test(m.content)) {
                  return (
                    <ImgItem
                      key={m.id}
                      aiName={name}
                      aiAvatar={avatar}
                      message={m}
                    />
                  );
                }
                return (
                  <ToolsCheck key={m.id} aiName={name} aiAvatar={avatar} />
                );
              }
              return (
                <ChatMessageBubble
                  key={m.id}
                  message={m}
                  aiName={name}
                  aiAvatar={avatar}
                  voice={voice}
                  sources={sourcesForMessages[sourceKey]}
                ></ChatMessageBubble>
              );
            })
          : ''}
      </div>

      {messages.length === 0 && ingestForm}
      <form
        className="flex w-full flex-col absolute p-2 md:p-4inset-x-0 bottom-0"
        onSubmit={sendMessage}
      >
        <div className="flex">{intemediateStepsToggle}</div>
        <label htmlFor="chat-input" className="sr-only">
          Enter your prompt
        </label>
        <div className="relative">
          <button
            type="button"
            className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-500"
          >
            <AppendixIcon />

            <span className="sr-only">Use voice input</span>
          </button>
          <textarea
            id="chat-input"
            className="block w-full resize-none rounded-xl bg-white whitespace-nowrap border p-4 pl-10 pr-20 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:ring-blue-500 sm:text-base"
            rows={1}
            placeholder={placeholder}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeydown}
          />
          <button
            type="submit"
            className="absolute bottom-2 right-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:text-base"
          >
            {chatEndpointIsLoading ? 'Cancel' : 'Send'}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
