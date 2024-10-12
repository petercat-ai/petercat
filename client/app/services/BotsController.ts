import { omit } from 'lodash';
import { Tables } from '@/types/database.types';
import axios from 'axios';
import { BotProfile } from '@/app/interface';

export declare type Bot = Tables<'bots'>;
export declare type RAGDoc = Tables<'rag_docs'>;
export declare type RagTask = Tables<'rag_tasks'>;
export declare type GithubRepoConfig = Tables<'github_repo_config'>;
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

export async function getChunkList(
  repo_name: string,
  page_size: number,
  page_number: number,
): Promise<{ rows: RAGDoc[]; total: number }> {
  const response = await axios.get(
    `${apiDomain}/api/rag/chunk/list?bot_id=${repo_name}&page_size=${page_size}&page_number=${page_number}`,
  );
  return response.data;
}

export async function getRagTask(bot_id: string): Promise<RagTask[]> {
  const response = await axios.get(
    `${apiDomain}/api/rag/task/latest?bot_id=${bot_id}`,
  );
  return response.data.data;
}

export async function getBotApprovalList(bot_id: string, status: string) {
  const response = await axios.get(
    `${apiDomain}/api/bot/approval/list?bot_id=${bot_id}&status=${status}`,
  );
  return response.data;
}

export async function publicBot(bot_id: string) {
  return axios.post(`${apiDomain}/api/bot/deploy/market/public`, {
    bot_id,
  });
}

export async function unPublicBot(bot_id: string) {
  return axios.post(`${apiDomain}/api/bot/deploy/market/unPublic`, {
    bot_id,
  });
}

export async function deployWebsite(payload: {
  bot_id: string;
  website_url?: string;
}) {
  return axios.post(`${apiDomain}/api/bot/deploy/website`, payload);
}

/**
 * Get the repositories where the user has installed the Petercat Assistant GitHub app.
 * @returns
 */
export async function getUserPeterCatAppRepos(): Promise<{
  data: GithubRepoConfig[];
}> {
  const response = await axios.get(
    `${apiDomain}/api/github/user/repos_installed_app`,
  );
  return response.data;
}

export interface BindBotToRepoConfig {
  repo_id: string;
  robot_id: string;
}

export async function bindBotToRepo(repsConfigs: BindBotToRepoConfig[]) {
  const response = await axios.post(`${apiDomain}/api/github/repo/bind_bot`, {
    repos: repsConfigs,
  });
  return response.data;
}
