import {
  bindBotToRepo,
  createBot,
  deleteBot,
  deployWebsite,
  getBotApprovalList,
  getBotConfig,
  getBotDetail,
  getBotInfoByRepoName,
  getBotList,
  getChunkList,
  getGitAvatarByRepoName,
  getRagTask,
  getUserPeterCatAppRepos,
  publicBot,
  unPublicBot,
  updateBot,
} from '@/app/services/BotsController';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

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

export const useBotList = (
  personal: boolean = false,
  name: string = '',
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: [`bot.list.${personal}`, name],
    queryFn: async () => getBotList(personal, name),
    enabled,
    retry: false,
  });
};

export function useBotDelete() {
  const mutation = useMutation({
    mutationFn: deleteBot,
  });

  return {
    deleteBot: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

export function useBotEdit() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateBot,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bot.list.false'],
        refetchType: 'active',
      });
    },
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
    data: mutation.data?.data?.data,
    createBot: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

export function useBotConfigGenerator() {
  const mutation = useMutation({
    mutationFn: getBotInfoByRepoName,
  });
  return {
    data: mutation.data?.data?.data,
    getBotInfoByRepoName: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

export const useBotRAGChunkList = (
  repoName: string,
  page_size: number,
  page_number: number,
  enabled: boolean = true,
  refetchInterval: boolean = false,
) => {
  return useQuery({
    queryKey: [`rag.chunk.list`, page_number, repoName],
    queryFn: async () => getChunkList(repoName, page_size, page_number),
    select: (data) => data,
    enabled,
    retry: true,
    placeholderData: keepPreviousData,
    refetchInterval: refetchInterval ? 5 * 1000 : undefined,
  });
};

export const useGetBotRagTask = (
  repoName: string,
  enabled: boolean = true,
  refetchInterval: boolean = true,
) => {
  return useQuery({
    queryKey: [`rag.task`, repoName],
    queryFn: async () => getRagTask(repoName),
    select: (data) => data,
    enabled,
    retry: true,
    refetchInterval: refetchInterval ? 3 * 1000 : undefined,
  });
};

export function usePublicBot() {
  const mutation = useMutation({
    mutationFn: publicBot,
  });
  return {
    data: mutation.data?.data,
    publicBot: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

export function useUnPublicBot() {
  const mutation = useMutation({
    mutationFn: unPublicBot,
  });
  return {
    data: mutation.data,
    unPublicBot: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
export function useDeployWebsite() {
  const mutation = useMutation({
    mutationFn: deployWebsite,
  });
  return {
    data: mutation.data?.data,
    deployWebsite: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

export const useGetUserPeterCatAppRepos = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['github.user.app.repos'],
    queryFn: async () => getUserPeterCatAppRepos(),
    select: (data) => data.data,
    enabled,
  });
};

export const useGetGitAvatar = (repoName?: string) => {
  return useQuery({
    queryKey: ['github.repo.name', repoName],
    queryFn: async () => getGitAvatarByRepoName(repoName!),
    select: (data) => data.data.data,
    enabled: !!repoName,
  });
};

export function useBindBotToRepo() {
  const mutation = useMutation({
    mutationFn: bindBotToRepo,
  });
  return {
    data: mutation.data,
    bindBotToRepo: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

export function useGetBotApprovalList(
  botId: string,
  status: 'open' | 'closed' = 'open',
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ['bot.approval.list', botId],
    queryFn: async () => getBotApprovalList(botId, status),
    select: (data) => data.data,
    enabled: !!botId && enabled,
    retry: false,
  });
}
