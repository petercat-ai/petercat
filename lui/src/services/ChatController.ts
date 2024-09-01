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

export const uploadImage = async (
  file: File,
  apiDomain: string,
): Promise<string> => {
  const formData = new FormData();
  formData.append('title', file?.name);
  formData.append('file', file);

  try {
    const response = await axios.post(`${apiDomain}/api/aws/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response?.data?.data?.url;
  } catch (error) {
    console.error('Error:', error);
    return '';
  }
};
