import { useRequest } from 'ahooks';
import {
  createBot,
  deleteBot,
  updateBot,
  getBotDetail,
} from '../services/BotController';
import { BotProfile } from '../interface';
import { useImmer } from 'use-immer';

export const useBot = () => {
  const [botProfile, setBotProfile] = useImmer<BotProfile>({
    avatar: '',
    name: 'Untitled',
    description: '',
    prompt: '',
    starter: [],
  });

  const {
    runAsync: onGetBotDetail,
    loading: getBotDetailLoading,
    error: getBotDetailError,
  } = useRequest(getBotDetail, { manual: true });

  const {
    runAsync: onCreateBot,
    loading: createBotLoading,
    error: createBotError,
  } = useRequest(createBot, { manual: true });

  const {
    runAsync: onDeleteBot,
    loading: deleteBotLoading,
    error: deleteBotError,
  } = useRequest(deleteBot, { manual: true });
  const {
    runAsync: onUpdateBot,
    loading: updateBotLoading,
    error: updateBotError,
  } = useRequest(updateBot, { manual: true });

  return {
    botProfile,
    setBotProfile,
    onGetBotDetail,
    getBotDetailLoading,
    getBotDetailError,
    onCreateBot,
    createBotLoading,
    createBotError,
    onDeleteBot,
    deleteBotLoading,
    deleteBotError,
    onUpdateBot,
    updateBotLoading,
    updateBotError,
  };
};
