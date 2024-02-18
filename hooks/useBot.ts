import { getBotDetail, getBotList } from '@/app/services/BotController';
import { useQuery } from '@tanstack/react-query';

export const useBotDetail = (id: string) => {
  return useQuery({
    queryKey: [`bot.detail.${id}`, id],
    queryFn: async () => getBotDetail(id),
    select: (data) => data?.[0],
    enabled: !!id,
    retry: false,
  });
};

export const useBotList = (personal?: boolean) => {
  return useQuery({
    queryKey: [`bot.list.${personal}`, personal],
    queryFn: async () => getBotList(personal ?? false),
    retry: false,
  });
};
