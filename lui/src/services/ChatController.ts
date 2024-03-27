import { IPrompt } from 'lui/interface';

/**
 * Chat api
 * @param message IPrompt
 */
export async function streamChat(messages: IPrompt[]): Promise<Response> {
  return fetch('http://127.0.0.1:8000/api/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      connection: 'keep-alive',
      'keep-alive': 'timeout=5',
    },
    body: JSON.stringify({
      messages: messages,
      prompt: '',
    }),
  });
}
