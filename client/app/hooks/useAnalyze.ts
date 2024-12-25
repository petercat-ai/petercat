import { useQuery } from '@tanstack/react-query';
import { analyzeTokenUsage, analyzeTopBots, analyzeTopUsers } from '../services/TokensController';

export interface BotUsage {
  bot_name: string;
  total_tokens: number;
  usage_date: Date;
}

export function useAnalyze() {
  return useQuery({
    queryKey: [`usage.analyze`],
    queryFn: async () => analyzeTokenUsage(),
    retry: false,
  });
}

export function useTopBots() {
  return useQuery<BotUsage[]>({
    queryKey: [`usage.top.bots`],
    queryFn: async () => analyzeTopBots(),
    retry: false,
  });
}

export function useTopUsers() {
  return useQuery<{ user_name: string; total_tokens: number;}[]>({
    queryKey: [`usage.top.users`],
    queryFn: async () => analyzeTopUsers(),
    retry: false,
  });
}
