import { useQuery } from '@tanstack/react-query';
import { getAvaliableLLMs } from '../services/UserController';

export function useAvaliableLLMs() {
  return useQuery<string[]>({
    queryKey: [`avaliable.llms`],
    queryFn: async () => getAvaliableLLMs(),
    retry: true,
  });
}