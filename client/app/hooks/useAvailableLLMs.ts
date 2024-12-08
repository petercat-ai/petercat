import { useQuery } from '@tanstack/react-query';
import { getAvailableLLMs } from '../services/UserController';

export function useAvailableLLMs() {
  return useQuery<string[]>({
    queryKey: [`availableLLMS.llms`],
    queryFn: async () => getAvailableLLMs(),
    retry: true,
  });
}
