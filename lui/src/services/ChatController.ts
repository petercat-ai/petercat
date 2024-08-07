import axios from 'axios';
import { Message } from '../interface';

/**
 * Chat api
 * @param message
 */
export async function streamChat(
  messages: Message[],
  apiDomain: string,
  apiUrl = '/api/chat/stream_qa',
  prompt = '',
  token = '',
): Promise<Response> {
  return fetch(`${apiDomain}${apiUrl}`, {
    method: 'POST',
    credentials: 'include',
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

export async function fetcher(url: string) {
  const response = await axios.get(url);
  return response.data.data;
}

export async function getBotDetail(id: string, apiDomain: string) {
  const url = `${apiDomain}/api/bot/detail?id=${id}`;
  return fetcher(url);
}
