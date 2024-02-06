import { Tables } from '@/types/database.types';
import axios from 'axios';

declare type Bot = Tables<'bots'>;

export async function getBotDetail(id: string, uid: string): Promise<Bot[]> {
  const response = await axios.get(`/api/bot/detail?id=${id}`, {
    headers: { 'x-bot-meta-uid': uid },
  });
  return response.data.data;
}
