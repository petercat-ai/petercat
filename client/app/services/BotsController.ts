import { omit } from 'lodash';
import { Tables } from '@/types/database.types';
import axios from 'axios';
import { BotProfile } from '@/app/interface';

declare type Bot = Tables<'bots'>;

axios.defaults.withCredentials = true;

const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;
//  Get the public bot profile by id
export async function getBotDetail(id: string): Promise<Bot[]> {
  const response = await axios.get(`${apiDomain}/api/bot/detail?id=${id}`);
  return response.data.data;
}

// Get current user's bot profile by id
export async function getBotConfig(id: string): Promise<Bot[]> {
  const response = await axios.get(`${apiDomain}/api/bot/config?id=${id}`);
  return response.data.data;
}

// Get the  bot list
export async function getBotList(
  personal: boolean,
  name: string,
): Promise<Bot[]> {
  const response = await axios.get(
    `${apiDomain}/api/bot/list?personal=${personal}&name=${name ?? ''}`,
  );
  return response.data.data;
}

// Delete Bot
export async function deleteBot(id: string) {
  return axios.delete(`${apiDomain}/api/bot/delete/${id}`);
}

// Create Bot
export async function createBot(
  repo_name: string,
  starters?: string[],
  hello_message?: string,
) {
  return axios.post(`${apiDomain}/api/bot/create`, {
    repo_name,
    starters: starters ?? [],
    hello_message,
  });
}

// Update Bot
export async function updateBot(profile: BotProfile) {
  const parmas = {
    ...omit(profile, ['gitAvatar', 'repoName', 'helloMessage']),
    hello_message: profile.helloMessage,
  };
  return axios.put(`${apiDomain}/api/bot/update/${profile.id}`, parmas);
}

// Get Bot Info by Repo Name
export async function getBotInfoByRepoName(
  repo_name: string,
  starters?: string[],
  hello_message?: string,
) {
  return axios.post(`${apiDomain}/api/bot/config/generator`, {
    repo_name,
    starters: starters ?? [],
    hello_message,
  });
}
