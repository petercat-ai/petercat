
import { uniqueId } from 'lodash';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import useSWR from 'swr';

export interface Message {
  id: string;
  createdAt?: Date;
  content: string;
  ui?: string | JSX.Element | JSX.Element[] | null | undefined;
  role: 'system' | 'user' | 'assistant' | 'function' | 'data';
}

export interface UseChatOptions {
  api: string;
  initialMessages?: Message[];
  initialInput?: string;
  onError?: (error: Error) => void;
}

export interface ChatRequest {
  messages: Message[];
  options: ChatRequestOptions;
}

export interface ChatRequestOptions {}

export function useChat({
  api,
  initialMessages = [],
  initialInput = '',
  onError,
}: UseChatOptions) {
  const hookId = useId();
  const chatKey = typeof api === 'string' ? [api, hookId] : hookId;

  const { data: messages = [], mutate } = useSWR<Message[]>([chatKey, 'messages'], null, { fallbackData: initialMessages });
  const { data: isLoading = false, mutate: mutateLoading } = useSWR<boolean>([chatKey, 'loading'], null);

  const setMessages = useCallback(
    (messages: Message[]) => {
      mutate(messages, false);
      messagesRef.current = messages;
    },
    [mutate],
  );

  // Keep the latest messages in a ref.
  const messagesRef = useRef<Message[]>(messages || []);
  useEffect(() => {
    messagesRef.current = messages || [];
  }, [messages]);

  // Input state and handlers.
  const [input, setInput] = useState(initialInput);

  // Abort controller to cancel the current API call.
  const abortControllerRef = useRef<AbortController | null>(null);

  const triggerRequest = useCallback(async (chatRequest: ChatRequest) => {
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      mutateLoading(true);
      // positive update messages
      mutate(chatRequest.messages, false);

      const promise = fetch(api, {
        method: 'POST',
        body: JSON.stringify({
          messages: chatRequest.messages,
          ...chatRequest.options,
        }),
        signal: abortControllerRef.current?.signal,
      });

      await promise.then(response => {
        mutate([
          ...chatRequest.messages,
          {
            id: uniqueId(),
            content: '',
            role: 'assistant',
          },
        ], false);

        const reader = response.body!.getReader();
        return new ReadableStream({
          start(controller) {
            function read(): Promise<string | undefined> {
              return reader.read().then(({ done, value }) => {
                mutate((prevMessages = []) => {
                  const lastMessage = prevMessages.at(-1)!;
                  const text = new TextDecoder().decode(value);
                  return [
                    ...prevMessages.slice(0, -1),
                    {
                      ...lastMessage,
                      content: lastMessage.content.concat(text),
                    },
                  ];
                }, false);

                if (done) {
                  controller.close();
                  return;
                }

                controller.enqueue(value);
                return read();
              });
            }

            return read();
          },
        });
      })
      .then((stream) => new Response(stream))
      .then((response) => response.blob());
    } catch (err) {
      if ((err as any).name === 'AbortError') {
        abortControllerRef.current = null;
        return null;
      }

      if (onError && err instanceof Error) {
        onError(err);
      }
    } finally {
      mutateLoading(false);
    }
  }, [api, mutate, mutateLoading, onError, abortControllerRef]);

  const append = useCallback(async (message: Message, options: ChatRequestOptions) => {
    if (!message.id) {
      message.id = uniqueId();
    }

    const chatRequest = {
      messages: messagesRef.current.concat(message),
      options,
    };

    return await triggerRequest(chatRequest);
  }, [triggerRequest]);

  const handleSubmit = useCallback((options: ChatRequestOptions) => {
    if (!input) return;
    append({
      content: input,
      role: 'user',
      createdAt: new Date(),
    } as Message, options);

    setInput('');
  },
  [append, input]);

  const handleInputChange = (e: any) => {
    setInput(e.target.value);
  };

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    messages,
    setMessages,

    input,
    setInput,

    handleSubmit,
    isLoading,

    handleInputChange,
    stop,
  };
}
