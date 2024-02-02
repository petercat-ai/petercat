import { Tables } from '@/types/database.types';
import axios from 'axios';

declare type Bot = Tables<'bots'>;

export async function getBotDetail(id: string): Promise<Bot[]> {
  const response = await axios.get(`/api/bot/detail?id=${id}`);
  return response.data.data;
}
