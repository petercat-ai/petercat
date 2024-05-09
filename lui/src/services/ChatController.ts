import { IPrompt } from '../interface';

/**
 * Chat api
 * @param message IPrompt
 */
export async function streamChat(
  messages: IPrompt[],
  host = 'http://127.0.0.1:8000',
): Promise<Response> {
  return fetch(`${host}/api/chat/builder`, {
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
