import { IPrompt } from 'lui/interface';

/**
 * Chat api
 * @param message IPrompt
 */
export async function streamChat(messages: IPrompt[]): Promise<Response> {
  return fetch('http://localhost:8000/api/chat/stream', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      connection: 'keep-alive',
      'keep-alive': 'timeout=5',
    },
    body: JSON.stringify({
      messages: messages,
    }),
  });
}
