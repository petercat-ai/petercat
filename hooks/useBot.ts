import {
  deleteBot,
  getBotDetail,
  getBotList,
} from '@/app/services/BotController';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

export function useBotDelete() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteBot,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bot.list.true'],
        refetchType: 'active',
      });
    },
  });

  return {
    deleteBot: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
