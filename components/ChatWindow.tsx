'use client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRef, useState, ReactElement, useCallback } from 'react';
import type { FormEvent } from 'react';
import { ChatMessageBubble } from '@/components/ChatMessageBubble';
import { UploadDocumentsForm } from '@/components/UploadDocumentsForm';
import { IntermediateStep } from './IntermediateStep';
import { useChat } from './hooks/useChat';
import { Avatar } from '@nextui-org/react';

export function ChatWindow(props: {
  endpoint: string;
  emptyStateComponent: ReactElement;
  placeholder?: string;
  titleText?: string;
  avatar?: string;
  showIngestForm?: boolean;
  showIntermediateStepsToggle?: boolean;
  prompt?: string;
  streamming?: boolean;
}) {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    endpoint,
    emptyStateComponent,
    placeholder,
    titleText = 'An LLM',
    showIngestForm,
    showIntermediateStepsToggle,
    avatar,
    prompt,
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

  const sendMessage = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setInput('');
      if (!chatEndpointIsLoading) {
        return handleSubmit({
          prompt,
          show_intermediate_steps: true,
        });
      }
      stop();
    },
    [chatEndpointIsLoading, handleSubmit, prompt, stop],
  );

  return (
    <div className="flex flex-col h-full items-center p-4 md:p-8 grow overflow-hidden relative">
      <h2
        className={`${
          messages.length > 0 ? '' : 'hidden'
        } text-2xl flex items-center`}
      >
        <Avatar
          src={avatar!}
          className="h-12 w-12 text-large m-4"
          name={titleText!}
        />

        <div className="flex">{titleText}</div>
      </h2>
      {messages.length === 0 ? emptyStateComponent : ''}

      <div
        className="flex flex-col-reverse w-full h-full mb-16 overflow-auto transition-[flex-grow] ease-in-out"
        ref={messageContainerRef}
      >
        {messages.length > 0
          ? [...messages].reverse().map((m, i) => {
              const sourceKey = (messages.length - 1 - i).toString();
              return m.role === 'system' ? (
                <IntermediateStep key={m.id} message={m}></IntermediateStep>
              ) : (
                <ChatMessageBubble
                  key={m.id}
                  message={m}
                  aiName={titleText}
                  aiAvatar={avatar}
                  sources={sourcesForMessages[sourceKey]}
                ></ChatMessageBubble>
              );
            })
          : ''}
      </div>

      {messages.length === 0 && ingestForm}
      <form
        className="flex w-full flex-col absolute p-4 md:p-8 inset-x-0 bottom-0"
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
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 7C9 4.23858 11.2386 2 14 2C16.7614 2 19 4.23858 19 7V15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15V9C5 8.44772 5.44772 8 6 8C6.55228 8 7 8.44772 7 9V15C7 17.7614 9.23858 20 12 20C14.7614 20 17 17.7614 17 15V7C17 5.34315 15.6569 4 14 4C12.3431 4 11 5.34315 11 7V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V9C13 8.44772 13.4477 8 14 8C14.5523 8 15 8.44772 15 9V15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15V7Z"
                fill="currentColor"
              ></path>
            </svg>
            <span className="sr-only">Use voice input</span>
          </button>
          <textarea
            id="chat-input"
            className="block w-full resize-none rounded-xl bg-white border p-4 pl-10 pr-20 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:ring-blue-500 sm:text-base"
            rows={1}
            placeholder={placeholder ?? "What's it like to be a pirate?"}
            value={input}
            onChange={handleInputChange}
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
