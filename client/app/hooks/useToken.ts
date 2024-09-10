import { useQuery } from '@tanstack/react-query';
import { getTokenList } from '../services/TokensController';
import { Tables, Database } from '@/types/database.types';
import { Updater, useImmer } from 'use-immer';

export declare type LLMToken = Tables<'user_llm_tokens'>;
export declare type LLMTokenInsert = Database['public']['Tables']['user_llm_tokens']['Insert'];

export function useTokenList() {
  return useQuery<LLMToken[]>({
    queryKey: [`token.list`],
    queryFn: async () => getTokenList(),
    retry: false,
  });
}

const defaultLLMToken = {}

export function useCreateToken(): [LLMTokenInsert, Updater<LLMTokenInsert>] {
  const [llmToken, setLLMToken] = useImmer<LLMTokenInsert>(defaultLLMToken);

  return [llmToken, setLLMToken]
}
