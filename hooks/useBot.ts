import {
  createBot,
  deleteBot,
  getBotConfig,
  getBotDetail,
  getBotList,
  updateBot,
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

export const useBotConfig = (id: string, enabled: boolean) => {
  return useQuery({
    queryKey: [`bot.config.${id}`, id],
    queryFn: async () => getBotConfig(id),
    select: (data) => data?.[0],
    enabled,
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

export function useBotEdit() {
  const mutation = useMutation({
    mutationFn: updateBot,
  });

  return {
    updateBot: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

export function useBotCreate() {
  const mutation = useMutation({
    mutationFn: createBot,
  });

  return {
    data: mutation.data?.data?.data?.id,
    createBot: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
