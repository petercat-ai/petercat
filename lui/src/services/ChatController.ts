import { IPrompt } from '../interface';

/**
 * Chat api
 * @param message IPrompt
 */
export async function streamChat(
  messages: IPrompt[],
  apiUrl = 'http://127.0.0.1:8000/api/chat/stream_qa',
  prompt = '',
  token = '',
): Promise<Response> {
  return fetch(`${apiUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      connection: 'keep-alive',
      'keep-alive': 'timeout=5',
    },
    body: JSON.stringify({
      messages: messages,
      prompt: prompt,
      bot_id: token,
    }),
  });
}
