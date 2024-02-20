import { omit } from 'lodash';
import { Tables } from '@/types/database.types';
import axios from 'axios';
import { BotProfile } from '@/app/interface';

declare type Bot = Tables<'bots'>;

//  Get the public bot profile by id
export async function getBotDetail(id: string): Promise<Bot[]> {
  const response = await axios.get(`/api/bot/detail?id=${id}`);
  return response.data.data;
}

// Get current user's bot profile by id
export async function getBotConfig(id: string): Promise<Bot[]> {
  const response = await axios.get(`/api/bot/config?id=${id}`);
  return response.data.data;
}

//  Get the  bot list
export async function getBotList(personal: boolean): Promise<Bot[]> {
  const response = await axios.get(`/api/bot/list?personal=${personal}`);
  return response.data.data;
}

// Delete Bot
export async function deleteBot(id: string) {
  return axios.delete(`/api/bot/delete?id=${id}`);
}

// Create Bot
export async function createBot(profile: BotProfile) {
  const params = omit(profile, 'id');
  return axios.post('/api/bot/create', params);
}

// Update Bot
export async function updateBot(profile: BotProfile) {
  return axios.post('/api/bot/update', profile);
}
