'use client';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRef, useState, ReactElement, useCallback } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@nextui-org/react';

import { ChatMessageBubble } from '@/components/ChatMessageBubble';
import { UploadDocumentsForm } from '@/components/UploadDocumentsForm';
import { IntermediateStep } from './IntermediateStep';
import { useChat } from './hooks/useChat';

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
  const [intermediateStepsLoading, setIntermediateStepsLoading] =
    useState(false);
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

  const sendMessage = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatEndpointIsLoading) {
      return handleSubmit({
        prompt,
        show_intermediate_steps: true,
      });
    }
    stop();
  }, [chatEndpointIsLoading, handleSubmit, prompt, stop]);

  return (
    <div
      className={`flex flex-col items-center p-4 md:p-8 rounded grow overflow-hidden ${
        messages.length > 0 ? 'border' : ''
      }`}
    >
      <h2
        className={`${
          messages.length > 0 ? '' : 'hidden'
        } text-2xl flex items-center`}
      >
        <img className="w-12 rounded-full  m-2" alt={titleText} src={avatar!} />
        <div className="flex">{titleText}</div>
      </h2>
      {messages.length === 0 ? emptyStateComponent : ''}
      <div
        className="flex flex-col-reverse w-full mb-4 overflow-auto transition-[flex-grow] ease-in-out"
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
                  aiAvatar={avatar}
                  sources={sourcesForMessages[sourceKey]}
                ></ChatMessageBubble>
              );
            })
          : ''}
      </div>

      {messages.length === 0 && ingestForm}

      <form onSubmit={sendMessage} className="flex w-full flex-col">
        <div className="flex">{intemediateStepsToggle}</div>
        <div className="flex w-full mt-4">
          <input
            className="grow mr-8 p-4 rounded"
            value={input}
            placeholder={placeholder ?? "What's it like to be a pirate?"}
            onChange={handleInputChange}
          />
          <Button type="submit" radius="full" className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg">
            {chatEndpointIsLoading ? 'Cancel' : 'Send'}
          </Button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
