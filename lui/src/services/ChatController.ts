import axios from 'axios';
import { IPrompt } from '../interface';

/**
 * Chat api
 * @param message IPrompt
 */
export async function streamChat(
  messages: IPrompt[],
  apiDomain: string,
  apiUrl = '/api/chat/stream_builder',
  prompt = '',
  token = '',
): Promise<Response> {
  return fetch(`${apiDomain}${apiUrl}`, {
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

export async function fetcher(url: string) {
  const response = await axios.get(url);
  return response.data.data;
}

export async function getBotDetail(id: string, apiDomain: string) {
  const url = `${apiDomain}/api/bot/detail?id=${id}`;
  return fetcher(url);
}
