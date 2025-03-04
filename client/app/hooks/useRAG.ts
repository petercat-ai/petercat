import {
  getTaskList,
  PageResponse,
  RAGKnowledge,
  PageParams,
  RAGTask,
  getKnowledgeList,
  getChunkList,
  RAGChunk,
  reloadRepo,
  restartTask
} from '@/app/services/RAGController';
import {
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';




export function useKnowledgeList(
  params: PageParams<RAGKnowledge>,
  options?: Omit<UseQueryOptions<PageResponse<RAGKnowledge>, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['knowledge', params],
    queryFn: () => getKnowledgeList(params),
    refetchOnWindowFocus: true,
    ...options
  });
}

export function useTaskList(
  params: PageParams<RAGTask>,
  options?: Omit<UseQueryOptions<PageResponse<RAGTask>, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['task', params],
    queryFn: () => getTaskList(params),
    refetchOnWindowFocus: true,
    ...options
  });
}


export function useChunkList(
  params: PageParams<RAGChunk>,
  options?: Omit<UseQueryOptions<PageResponse<RAGChunk>, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['chunk', params],
    queryFn: () => getChunkList(params),
    refetchOnWindowFocus: true,
    ...options
  });
}

export function useReloadRepo() {
  const mutation = useMutation({
    mutationFn: reloadRepo,
  });
  return {
    data: mutation.data,
    reloadRepo: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

export function useRestartTask() {
  const mutation = useMutation({
    mutationFn: restartTask,
  });
  return {
    data: mutation.data,
    restartTask: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
