import type { BindBotToRepoConfig } from '@/app/services/BotsController';
import { RepoBindBotConfig } from './types';

export const diffRepoBindResult = (
  origin: RepoBindBotConfig[],
  current: RepoBindBotConfig[],
  BOT_ID: string,
): BindBotToRepoConfig[] => {
  return origin
    .map((item) => {
      const currentItem = current.find((cur) => cur.repo_id === item.repo_id);
      if (currentItem) {
        const originChecked = item.checked;
        const curChecked = currentItem.checked;

        if (originChecked !== curChecked) {
          return {
            repo_id: item.repo_id,
            robot_id: curChecked ? BOT_ID : '',
          };
        }
      }
      return null;
    })
    .filter((item) => item !== null) as BindBotToRepoConfig[];
};
